/*global define, amplify*/
define([
    'jquery',
    'require',
    'underscore',
    'loglevel',
    'fx-filter/config/errors',
    'fx-filter/config/events',
    'fx-filter/config/config',
    'fx-filter/config/config-default',
    'text!fx-filter/html/filter.hbs',
    'i18n!fx-filter/nls/filter',
    'q',
    'handlebars',
    'amplify',
    'bootstrap'
], function ($, require, _, log, ERR, EVT, C, CD, templates, i18nLables, Q, Handlebars) {

    'use strict';

    var s = {
        SELECTORS_CLASS: ".fx-selector",
        SELECTOR_DISABLED_CLASS: "fx-selector-disabled",
        SELECTORS: "[data-selector]",
        SEMANTICS: "[data-semantic]",
        TREE_CONTAINER: "[data-role='tree']",
        FILTER_CONTAINER: "[data-role='filter']",
        CLEAR_ALL_CONTAINER: "[data-role='clear']",
        AMOUNT_CONTAINER: "[data-role='amount']",
        COMPARE_RADIO_BTNS: "input:radio[name='compare']",
        COMPARE_RADIO_BTNS_CHECKED: "input:radio[name='compare']:checked",
        ACTIVE_TAB: "ul#country-ul li.active",
        SEMANTIC_TABS: "[data-semantic] a[data-toggle='tab']",
        SWITCH: "input[data-role='switch'][name='disable-selector']",
        TEMPLATE_SELECTOR: "[data-template-selector]",
        TEMPLATE_SELECTOR_CONTAINER: "[data-container]",
        TEMPLATE_SEMANTIC: "[data-template-semantic]",
        TEMPLATE_SUMMARY: "[data-summary]",
        SUMMARY_ITEM: "[data-code]"
    };

    function Filter(o) {
        log.info("FENIX filter");
        log.info(o);

        $.extend(true, this, o, CD, C);

        var valid = this._validateInput();

        if (valid === true) {

            this._attach();

            this._initVariables();

            this._bindEventListeners();

            this._preloadSelectorScripts();

            return this;

        } else {

            log.error("Impossible to create Filter");
            log.error(valid)
        }
    }

    // API

    /**
     * Return the current selection
     * @return {Object} Selection
     */
    Filter.prototype.getValues = function (output) {

        var candidate = output || this.OUTPUT_FORMAT,
            call = this["_output_" + candidate];

        if (call) {
            return call.call(this, this._getValues());
        } else {
            log.error("Impossible to find the output format: " + candidate);
        }
    };

    /**
     * Enable advance mode
     * @param {Boolean} show
     * @return {null}
     */
    Filter.prototype.configureVisibilityAdvancedOptions = function (show) {

        return this._configureVisibilityAdvancedOptions(show)
    };

    /**
     * Reset the view content
     * @return {null}
     */
    Filter.prototype.reset = function () {

        this._destroyDependencies();

        _.each(this.selectors, _.bind(function (obj, name) {

            this._callSelectorInstanceMethod(name, 'reset');

        }, this));

        this._initDependencies();

        this._initPage();

        this._configureSelectorsStatus();

        log.info("Filter reset");
    };

    /**
     * Print default selection of each selector
     * @return {null}
     */
    Filter.prototype.printDefaultSelection = function () {

        _.each(this.selectors, _.bind(function (obj, name) {

            this._callSelectorInstanceMethod(name, 'printDefaultSelection');

        }, this));

        log.info("Printed default selection");
    };

    // end API

    Filter.prototype._updateSummary = function () {

        if (!this.hasSummary) {
            return;
        }

        log.info("Update filter summary");

        var self = this,
            templ = Handlebars.compile($(templates).find(s.TEMPLATE_SUMMARY)[0].outerHTML),
            model = {summary: createSummaryModel(this._getValues())};

        //unbind click listener
        this.summary$el.find(s.SUMMARY_ITEM).each(function () {
            $(this).off();
        });

        this.summary$el.html(templ(model));

        //bind click listener
        this.summary$el.find(s.SUMMARY_ITEM).each(function () {
            var $this = $(this);
            $this.on("click", function () {

                self._unsetSelectorValue({
                    code: $this.data("code"),
                    selector: $this.data("selector")
                });
            });
        });

        function createSummaryModel(data) {

            var values = data.values,
                labels = data.labels,
                result = [];

            try {

                _.each(values, _.bind(function (obj, name) {

                    if (Array.isArray(obj) && obj.length > 0) {

                        var id = this.semantic2selectors[name][0],
                            model = this.selectors[id] || this.semantics[id];

                        var s = {
                            label: model.template ? model.template.title : "",
                            id: id,
                            values: []
                        };

                        _.each(obj, _.bind(function (v) {

                            s.values.push({
                                code: v,
                                label : labels[name][v],
                                selector : name
                            })

                        }, this));

                        result.push(s);
                    }

                }, self));

            } catch (e) {
                log.error(ERR.SUMMARY_MODEL_CREATION);
                log.error(e);
            }

            return result;

        }
    };

    Filter.prototype._unsetSelectorValue = function (obj) {

        var name = this._resolveSelectorName(obj.selector);
        this._callSelectorInstanceMethod(name, "unsetValue", obj.code);

    };

    Filter.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //set filter id
        if (!this.id) {

            window.fx_filter_id >= 0 ? window.fx_filter_id++ : window.fx_filter_id = 0;

            this.id = window.fx_filter_id;

            log.warn("Impossible to find filter id. Set auto id to: " + this.id);
        }


        if (!this.$el) {
            errors.push({code: ERR.MISSING_CONTAINER});

            log.warn("Impossible to find filter container");
        }

        this.$el = $(this.$el);

        //Check if $el exist
        if (this.$el.length === 0) {

            errors.push({code: ERR.MISSING_CONTAINER});

            log.warn("Impossible to find box container");

        }

        //check for selectors
        if (!this.config.selectors) {

            errors.push({code: ERR.MISSING_SELECTORS});

            log.warn("Impossible to find selectors for filter: " + this.id);

        }

        //check if summary container exist
        if (this.summary$el) {

            this.summary$el = $(this.summary$el);

            if (this.summary$el.length === 0) {

                errors.push({code: ERR.MISSING_SUMMARY_CONTAINER});

                log.warn("Impossible to find summary container");

            }
        }

        this.validTimeout = window.setTimeout(function () {

            alert(ERR.READY_TIMEOUT);
            log.error(ERR.READY_TIMEOUT);

        }, C.VALID_TIMEOUT || CD.VALID_TIMEOUT);

        return errors.length > 0 ? errors : valid;
    };

    Filter.prototype._attach = function () {

        var template = this.template || $("<div></div>");

        this.$el.html(template);
    };

    Filter.prototype._initVariables = function () {

        this.semanticIds = [];
        this.semantics = {};
        this.semanticToResolve = [];

        this.selectors = {};
        this.semantic2selectors = {};
        this.selector2semantic = {};
        this.selectorTypes = [];
        this.disabledSelectors = [];

        this.dependeciesToDestory = [];

        this.mandatorySelectorIds = [];
        this.mandatorySelectors = [];

        this.codelists = [];

        _.each(this.config.selectors, _.bind(function (value, key) {

            this.semanticIds.push(key);

            if (!value.hasOwnProperty("selectors")) {

                this._processSelector(value, key, key);

            } else {

                this.semantics[key] = value;
                this.semanticToResolve.push(key);

                var semantic = $.extend(true, {}, value);

                this._getSemanticContainer(key);

                delete semantic.selectors;

                _.each(value.selectors, _.bind(function (v, k) {
                    //Hide selector switch by default
                    //remove className by default
                    var model = $.extend(true, {}, semantic, v, {
                        className: "",
                        template: {hideSwitch: true, hideHeader: true}
                    });
                    this._processSelector(model, k, key)
                }, this));
            }
        }, this));

        this.selectorsId = Object.keys(this.selectors);
        this.selectorsReady = 0; //used for "ready" event

        this.codelists = _.uniq(this.codelists);

        this.$tabs = this.$el.find(s.SEMANTIC_TABS);

        this.$switches = this.$el.find(s.SWITCH);

        //Summary
        this.hasSummary = (this.summary$el && this.summary$el.length) > 0;

    };

    Filter.prototype._bindEventListeners = function () {

        amplify.subscribe(this._getEventName(EVT.SELECTOR_READY), this, this._onSelectorReady);

        this.$tabs.on('shown.bs.tab', _.bind(function () {

            amplify.publish(this._getEventName(EVT.SELECTORS_ITEM_SELECT));

        }, this));

        amplify.subscribe(this._getEventName(EVT.SELECTORS_ITEM_SELECT), this, this._onSelectorItemSelect);

    };

    // Preload scripts and codelists

    Filter.prototype._preloadSelectorScripts = function () {

        var paths = [];

        _.each(this.selectorTypes, _.bind(function (t) {

            paths.push(this._getSelectorScriptPath(t));

        }, this));

        log.info("Selectors path to load");
        log.info(paths);

        //Async load of plugin js source
        require(paths, _.bind(this._preloadSelectorScriptsSuccess, this));

    };

    Filter.prototype._preloadSelectorScriptsSuccess = function () {
        log.info('Selectors scripts loaded successfully');

        this._preloadResources().then(
            _.bind(this._onPreloadResourceSuccess, this),
            _.bind(this._onPreloadResourceError, this)
        );

    };

    Filter.prototype._preloadResources = function () {

        var promises = [];

        log.info("Preloading codelist");

        _.each(this.codelists, _.bind(function (cd) {

            //Check if codelist is cached otherwise query
            var stored = this._getStoredCodelist(cd);

            if (stored === undefined || stored.length < 2) {

                log.info(this._getCodelistCacheKey(cd) + " not in session storage.");

                promises.push(this._createPromise(cd));

            } else {

                log.info(this._getCodelistCacheKey(cd) + " read from session storage.");
            }

        }, this));

        return Q.all(promises);

    };

    Filter.prototype._onPreloadResourceError = function () {
        log.error("Resources load: error");
    };

    Filter.prototype._onPreloadResourceSuccess = function () {

        log.info("Resources loaded");

        this._initPage();

        this._renderSelectors();

        this._configureSelectorsStatus();

    };

    Filter.prototype._createPromise = function (obj) {

        var self = this,
            body = obj,
            key = this._getCodelistCacheKey(obj);

        return this._getPromise(body).then(function (result) {

            if (typeof result === 'undefined') {
                log.info("No Code List loaded for: " + key);
            } else {
                log.info("Code List loaded successfully for: " + key);

                self._storeCodelist(body, result);
            }

        }, function (r) {

            log.error(r);
        });
    };

    Filter.prototype._storeCodelist = function (obj, cl) {

        return amplify.store.sessionStorage(this._getCodelistCacheKey(obj), cl);
    };

    Filter.prototype._getStoredCodelist = function (obj) {

        return obj ? amplify.store.sessionStorage(this._getCodelistCacheKey(obj)) : null;

    };

    Filter.prototype._getCodelistCacheKey = function (obj) {

        var key = "_",
            keys = Object.keys(obj).sort();

        for (var i = 0; i < keys.length; i++) {
            key += "_" + keys[i] + ":" + obj[keys[i]];
        }

        return key;
    };

    Filter.prototype._getPromise = function (body) {

        return Q($.ajax({
            url: CD.SERVER + CD.CODELIST_SERVICE + CD.CODES_POSTFIX,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(body),
            dataType: 'json'
        }));

    };

    Filter.prototype._getSelectorScriptPath = function (name) {

        var registeredSelectors = $.extend(true, {}, this.selector_registry),
            path;

        var conf = registeredSelectors[name];

        if (!conf) {
            log.error('Registration not found for "' + name + ' selector".');
        }

        if (conf.path) {
            path = conf.path;
        } else {
            log.error('Impossible to find path configuration for "' + name + ' tab".');
        }

        return path;
    };

    // END Preload scripts and codelists

    Filter.prototype._initPage = function () {

        //add attribute to mandatory selectors
        log.info("Add class to mandatory selectors");
        _.each(this.mandatorySelectorIds, _.bind(function (id) {

            this._getSelectorContainer(id).closest(s.SEMANTICS).addClass(this.config.MANDATORY_SELECTOR_CLASS_NAME);
            this._getSelectorContainer(id).closest(s.SELECTORS).addClass(this.config.MANDATORY_SELECTOR_CLASS_NAME);
        }, this));

    };

    Filter.prototype._configureSelectorsStatus = function () {

        //default disabled selectors
        log.info("Disabling disabled selectors by default");
        _.each(this.disabledSelectors, _.bind(function (d) {

            var semantic = this.selector2semantic[d],
                selectors = this.semantic2selectors[semantic];

            _.each(selectors, _.bind(function (s) {

                this._disableSelectorAndSwitch(s);

            }, this));

        }, this));
    };

    Filter.prototype._renderSelectors = function () {

        _.each(this.selectors, _.bind(function (obj, name) {

            var type = obj.selector.type,
                rawCl = this._getStoredCodelist(obj.cl),
                Selector = this._getSelectorRender(type);

            var is = new Selector($.extend(true, {}, obj, {
                id: name,
                data: rawCl ? rawCl : null,
                controller: this
            }));


            this.selectors[name].instance = is

        }, this));

    };

    // filter selection [values] and validation

    Filter.prototype._getValues = function () {

        var result = {
            valid: false,
            labels: {},
            values: {}
        };

        if (this.ready !== true) {
            return result;
        }

        _.each(this.semanticIds, _.bind(function (n) {

            var name = this._resolveSelectorName(n),
                status = this._callSelectorInstanceMethod(name, "getStatus");

            if (!status.disabled === true) {

                var v = this._callSelectorInstanceMethod(name, "getValues");

                result.values[n] = v.values;
                result.labels[n] = v.labels;

            } else {

                log.warn(n + " selector not included in filter result because disabled.");
            }

        }, this));

        //validate result but return it in any case
        var valid = this._validateSelection(result);

        if (valid === true) {

            result.valid = true;

        } else {
            result.errors = valid;
        }

        return result;

    };

    Filter.prototype._validateSelection = function (s) {

        var valid = true,
            errors = {};

        //mandatory fields
        _.each(this.mandatorySelectorIds, _.bind(function (id) {

            if (!s.values.hasOwnProperty(id) || !s.values[id] || s.values[id] < 1) {

                errors.code = 'missing_mandatory_field';
                errors.details = this.selector2semantic[id];

                return errors;

            }

        }, this));

        return _.isEmpty(errors) ? valid : errors;
    };

    // dependencies fns

    Filter.prototype._initDependencies = function () {

        var self = this;

        _.each(this.selectors, _.bind(function (sel, id) {

            if (sel.hasOwnProperty("dependencies")) {

                _.each(sel.dependencies, _.bind(function (dependencies, selectorId) {

                    if (!Array.isArray(dependencies)) {
                        dependencies = [dependencies];
                    }

                    _.each(dependencies, _.bind(function (dep) {

                        var d = {
                            event: EVT.SELECTORS_ITEM_SELECT + "." + selectorId,
                            callback: function (payload) {

                                var call = self["_dep_" + dep];

                                if (call) {
                                    call.call(self, payload, {src: selectorId, target: id});
                                } else {
                                    log.error("Impossible to find : " + "_dep_" + dep);
                                }
                            }
                        };

                        this.dependeciesToDestory.push(d);

                        amplify.subscribe(this._getEventName(d.event), this, d.callback);

                    }, this));


                }, this));

            }

        }, this));
    };

    Filter.prototype._destroyDependencies = function () {
        var self = this;

        _.each(this.dependeciesToDestory, function (d) {
            amplify.unsubscribe(self._getEventName(d.event), d.callback);
        });
    };

    Filter.prototype._dep_min = function (payload, o) {

        log.info("_dep_min invokation");
        log.info(o);

        this._callSelectorInstanceMethod(o.target, "_dep_min", {data: payload});

    };

    Filter.prototype._dep_parent = function (payload, o) {

        log.info("_dep_parent invokation");
        log.info(o);

        var c = this.selectors[o.target].cl;

        if (c) {

            //delete c.levels;
            c.levels = 2;
            delete c.level;

            c.codes = [];

            _.each(payload, function (item) {
                c.codes.push(item.code);
            });

            this._getPromise(c).then(
                _.bind(function (data) {
                    this._callSelectorInstanceMethod(o.target, "_dep_parent", {data: data});
                }, this),
                function (r) {
                    log.error(r);
                }
            )
        }

    };

    Filter.prototype._dep_focus = function (payload, o) {

        if (payload.code === this.selector2semantic[o.target]) {

            var d = payload.code,
                selectors = this.semantic2selectors[d];

            this.$el.find("." + this.config.FOCUSED_SELECTOR_CLASS_NAME).removeClass(this.config.FOCUSED_SELECTOR_CLASS_NAME);

            this._getSelectorContainer(selectors[0]).closest(s.SELECTORS).addClass(this.config.FOCUSED_SELECTOR_CLASS_NAME);
            this._getSelectorContainer(selectors[0]).closest(s.SEMANTICS).addClass(this.config.FOCUSED_SELECTOR_CLASS_NAME);

            _.each(selectors, _.bind(function (sel) {

                this._enableSelectorAndSwitch(sel);

            }, this));
        }
    };

    //Output formats

    Filter.prototype._output_plain = function (values) {
        return values;
    };

    Filter.prototype._output_fenix = function (values) {

        var filter = {};

        _.each(values.values, function (val, id) {

            filter[id] = compileFilter(id, val);

        });

        return filter;

        function compileFilter(id, values) {

            var m = $.extend(true, this.selectors[id].cl,
                {codes: '"' + values.join('","') + '"'});

            return JSON.parse(this._createFilterProcess(id, m));
        }

        function createFilterProcess(id, model) {

            var config = this.selectors[id].filter || {},
                process = config.process || {};

            if (!process) {
                log.error("Impossible to find '" + id + "' process template. Check your '" + id + "'.filter.process configuration.")
            }

            var template = Handlebars.compile(process);

            return template(model);

        }

    };

    // Handlers

    Filter.prototype._onSelectorReady = function () {

        this.selectorsReady++;

        if (this.selectorsReady === this.selectorsId.length) {

            log.info("All selectors are ready");

            this.ready = true;

            this._onReady();
        }
    };

    Filter.prototype._onReady = function () {

        this.$switches.on("click", _.bind(function (e) {

            log.info("Switch clicked");

            var $this = $(e.currentTarget),
                semantic = $(e.currentTarget).attr("data-target"),
                selectors = this.semantic2selectors[semantic];

            _.each(selectors, _.bind(function (sel) {

                // $this will contain a reference to the checkbox
                if ($this.is(':checked')) {
                    // the checkbox was checked

                    this._callSelectorInstanceMethod(sel, "enable");

                } else {

                    this._callSelectorInstanceMethod(sel, "disable");
                }

            }, this));

        }, this));

        this._initDependencies();

        this.printDefaultSelection();

        window.clearTimeout(this.validTimeout);

        amplify.publish(this._getEventName(EVT.SELECTORS_READY));

    };

    Filter.prototype._configureVisibilityAdvancedOptions = function (show) {

        if (show) {

            this.$advancedOptions.show();

        } else {

            this.$advancedOptions.hide();
        }
    };

    Filter.prototype._getEventName = function (evt) {

        return this.id + evt;
    };

    Filter.prototype._onSelectorItemSelect = function () {

        this._updateSummary();

    };

    // utils for selectors

    Filter.prototype._callSelectorInstanceMethod = function (name, method, opts) {

        var Instance = this._getSelectorInstance(name);

        if ($.isFunction(Instance[method])) {

            return Instance[method](opts);

        } else {
            log.error(name + " selector does not implement the mandatory " + method + "() fn");
        }

    };

    Filter.prototype._processSelector = function (obj, selectorId, semanticId) {

        if (!obj.hasOwnProperty('selector')) {
            alert(selectorId + "does not have a valid configuration");
        }

        this.selectors[selectorId] = obj;

        //Selector type
        var selectorType = obj.selector.type.toLowerCase();

        if (!this["_selector_type_" + selectorType]) {
            this["_selector_type_" + selectorType] = {};
            this.selectorTypes.push(selectorType);
        }

        this["_selector_type_" + selectorType][selectorId] = obj;

        //selector container
        obj.$el = this._getSelectorContainer(selectorId);

        //get set of codelists
        if (obj.hasOwnProperty("cl")) {
            this.codelists.push(obj.cl);
        }

        //get initially disabled selectors
        if (obj.selector.hasOwnProperty("disabled") && obj.selector.disabled === true) {
            this.disabledSelectors.push(selectorId);
        }

        //get mandatory selectors id
        if (obj.hasOwnProperty("validation") && obj.validation.mandatory === true) {
            this.mandatorySelectorIds.push(selectorId);
            this.mandatorySelectors.push(obj);
        }
        this.mandatorySelectors = _.uniq(this.mandatorySelectors);

        //
        if (!Array.isArray(this.semantic2selectors[semanticId])) {
            this.semantic2selectors[semanticId] = [];
        }
        this.semantic2selectors[semanticId].push(selectorId);

        //
        if (this.selector2semantic[selectorId]) {
            log.warn("Duplication of selector id for filter configuration: " + semanticId);
        }
        this.selector2semantic[selectorId] = semanticId;

    };

    Filter.prototype._getSelectorRender = function (name) {

        return require(this._getSelectorScriptPath(name));
    };

    Filter.prototype._getActiveSelectorBySemantic = function (name) {

        var active = this.$el.find("[data-semantic='" + name + "']")
            .find(s.SELECTORS)
            .filter(".active")
            .data("selector");

        return active;
    };

    Filter.prototype._resolveSelectorName = function (name) {

        var selector;

        if (_.contains(this.semanticToResolve, name)) {
            selector = this._getActiveSelectorBySemantic(name);
        } else {
            selector = name;
        }

        return selector;

    };

    Filter.prototype._getSelectorInstance = function (name) {

        var instance = this.selectors[name].instance;

        if (!instance) {

            log.warn("Impossible to find selector instance for " + name);
        }

        return instance;
    };

    Filter.prototype._getSelectorContainer = function (id) {

        var $cont = this.$el.find('[data-selector="' + id + '"]'),
            conf = this.selectors[id] || {};

        if ($cont.length === 0) {
            log.warn("Impossible to find selector container: " + id);

            $cont = $("<div data-selector='" + id + "'  class='" + conf.className + "'></div>");

            this.$el.prepend($cont);

        }

        if (conf.templateIsInitialized !== true) {
            conf.templateIsInitialized = true;
            $cont.prepend(this._createSelectorContainer(id));
        }

        return $cont;
    };

    Filter.prototype._getSemanticContainer = function (id) {

        var $cont = this.$el.find('[data-semantic="' + id + '"]'),
            conf = this.semantics[id] || {};

        if ($cont.length === 0) {
            log.warn("Impossible to find semantic container: " + id);

            $cont = $("<div data-semantic='" + id + "' class='" + conf.className + "'></div>");

            this.$el.append($cont);
        }

        if (conf.templateIsInitialized !== true) {
            conf.templateIsInitialized = true;
            $cont.append(this._createSemanticContainer(id));
        }

        return $cont;
    };

    Filter.prototype._createSemanticContainer = function (id) {
        log.info("Create container for semantic: " + id);

        var semantic = this.semantics[id],
            templ = Handlebars.compile($(templates).find(s.TEMPLATE_SEMANTIC)[0].outerHTML),
            $html,
            model;

        _.each(semantic.selectors, function (obj, name) {

            obj.id = name;

        });

        model = $.extend(true, {id: id}, semantic, semantic.template, i18nLables);

        $html = $(templ(model));

        //TODO active tab by conf
        $html.find("ul").children().first().addClass("active");
        $html.find(".tab-content").children().first().addClass("active");

        return $html;
    };

    Filter.prototype._createSelectorContainer = function (id) {
        log.info("Create container for selector: " + id);

        var obj = this.selectors[id].template,
            template = Handlebars.compile($(templates).find(s.TEMPLATE_SELECTOR)[0].outerHTML),
            $html = $(template($.extend(true, {id: id}, obj, i18nLables)));

        return $html;
    };

    Filter.prototype._disableSelectorAndSwitch = function (d) {

        this._getSelectorContainer(d).closest(s.SELECTORS).find(s.SWITCH).prop('checked', false);
        this._getSelectorContainer(d).closest(s.SEMANTICS).find(s.SWITCH).prop('checked', false);

        this._callSelectorInstanceMethod(d, 'disable');

    };

    Filter.prototype._enableSelectorAndSwitch = function (d) {

        this._getSelectorContainer(d).closest(s.SELECTORS).find(s.SWITCH).prop('checked', true);
        this._getSelectorContainer(d).closest(s.SEMANTICS).find(s.SWITCH).prop('checked', true);

        this._callSelectorInstanceMethod(d, 'enable');
    };

    //disposition

    Filter.prototype._unbindEventListeners = function () {

        amplify.unsubscribe(this._getEventName(EVT.SELECTOR_READY), this._onSelectorReady);

        amplify.unsubscribe(this._getEventName(EVT.SELECTORS_ITEM_SELECT), this._onSelectorItemSelect);

        //destroy selectors dependencies
        this._destroyDependencies();

        //advanced mode selectors switches
        this.$switches.off();

    };

    Filter.prototype.dispose = function () {

        //dispose selectors
        _.each(this.selectors, _.bind(function (obj, name) {
            var Instance = this._getSelectorInstance(name);
            Instance.dispose();
        }, this));

        //unbind event listeners
        this._unbindEventListeners();

    };


    // TODO to convert in dependency

    Filter.prototype._checkCompareValue = function (d) {

        var compareBy = this.$el.find(s.COMPARE_RADIO_BTNS_CHECKED).val(),
            subject = this._getSubjectBySelectorId(d),
            enabled = this._getEnablesSelectors();

        if (subject === compareBy) {
            var sel = enabled.length > 0 ? enabled[0] : this.selectorsId[0];
            this.$el.find(s.COMPARE_RADIO_BTNS).filter("[value='" + this._getSubjectBySelectorId(sel) + "']").prop('checked', true).trigger("change");
        }

    };

    return Filter;
});