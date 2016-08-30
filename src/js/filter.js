/*global define, amplify, JSON*/
define([
    'jquery',
    'require',
    'underscore',
    'loglevel',
    'fx-filter/config/errors',
    'fx-filter/config/events',
    'fx-filter/config/config',
    'text!fx-filter/html/filter.hbs',
    'i18n!fx-filter/nls/filter',
    "fx-common/bridge",
    "fx-common/utils",
    'handlebars',
    'amplify',
    'bootstrap'
], function ($, require, _, log, ERR, EVT, C, templates, i18nLabels, Bridge, Utils, Handlebars) {

    'use strict';

    var codePluginsFolder = "fx-filter/js/selectors/",
        defaultOptions = {
            summaryRender: function (params) {
                return this._summaryRender(params);
            }
        },
        s = {
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
            ACTIVE_TAB: "ul[data-semantic-list] li.active",
            SEMANTIC_TABS: "[data-semantic] a[data-toggle='tab']",
            SWITCH: "input[data-role='switch'][name='disable-selector']",
            TEMPLATE_SELECTOR: "[data-template-selector]",
            TEMPLATE_SELECTOR_CONTAINER: "[data-container]",
            TEMPLATE_SEMANTIC: "[data-template-semantic]",
            TEMPLATE_SUMMARY: "[data-summary]",
            SUMMARY_ITEM: "[data-code]",
            REMOVE_BTN: "[data-role='remove']",
            TEMPLATE_HEADER: "[data-selector-header]"
        };

    function Filter(o) {
        log.info("FENIX filter");
        log.info(o);

        $.extend(true, this, C, {initial: o}, defaultOptions);

        this._parseInput(o);

        var valid = this._validateInput();

        if (valid === true) {

            this._attach();

            this._initVariables();

            this._renderFilter();

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
    Filter.prototype.getValues = function (format, includedSelectors) {

        var candidate = format || this.outputFormat,
            call = this["_format_" + candidate];

        if ($.isFunction(call)) {
            return call.call(this, this._getValues(includedSelectors));
        } else {
            log.error("Impossible to find the output format: " + candidate);
        }
    };

    /**
     * Set filter selection
     * @return {null}
     */
    Filter.prototype.setValues = function (o, silent) {

        log.info("Set filter values. Silent? " + !!silent);

        return this._setValues(o, !!silent);
    };

    /**
     * Set selectors sources
     * @return {null}
     */
    Filter.prototype.setSources = function (o) {

        log.info("Set selectors sources");

        return this._setSources(o);
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

    /**
     * Add dynamically a selector
     * @return {null}
     */
    Filter.prototype.add = function (conf) {

        _.each(conf, _.bind(function (obj, name) {

            this._addSelector(name, obj);

        }, this));
    };

    /**
     * Remove dynamically a selector
     * @return {null}
     */
    Filter.prototype.remove = function (id) {

        //force to be array
        if (!Array.isArray(id)) {
            id = [id];
        }

        _.each(id, _.bind(function (i) {
            this._removeSelector(i);
        }, this));

        this._trigger("remove", {id: id});

    };

    /**
     * Clear the filter from all selectors
     * @return {null}
     */
    Filter.prototype.clear = function () {

        _.each(this.semanticIds, _.bind(function (id) {
            this.remove(id);
        }, this));

        log.info("Filter " + this.id + " cleared successfully");

    };

    /**
     * pub/sub
     * @return {Object} component instance
     */
    Filter.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});
        return this;
    };

    /** pub/sub
     * @return {Promise} codelist as promise
     */
    Filter.prototype.getCodelist = function (obj) {

        var promise = this._createPromise(obj);

        return promise;

    };

    Filter.prototype._trigger = function (channel) {

        if (!this.channels[channel]) {
            return false;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = this.channels[channel].length; i < l; i++) {
            var subscription = this.channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }

        return this;
    };

    // end API

    Filter.prototype._parseInput = function () {

        this.items = this.initial.items || {};
        this.$el = $(this.initial.el);
        this.template = this.initial.template;
        this.summary$el = this.initial.summaryEl;
        this.values = this.initial.values;
        this.cache = typeof this.initial.cache === "boolean" ? this.initial.cache : C.cache;

        if ($.isFunction(this.initial.summaryRender)) {
            this.summaryRender = this.initial.summaryRender;
        }

        this.direction = this.initial.direction || C.direction;
        this.ensureAtLeast = parseInt(this.initial.ensureAtLeast || C.ensureAtLeast, 10);

        this.common = this.initial.common || C.common;
        this.environment = this.initial.environment;
        this.lang = this.initial.lang || C.lang;
    };

    Filter.prototype._renderFilter = function () {

        this._initDynamicVariables();

        this._unbindEventListeners();

        this._preloadResources().then(
            _.bind(this._onPreloadResourceSuccess, this),
            _.bind(this._onPreloadResourceError, this)
        );
    };

    Filter.prototype._summaryRender = function (item) {
        return item.label + "<span class='code-brk'>[" + item.code + "]</span>";
    };

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

                            var code = typeof v === 'object' ? v.value : v,
                                item = {
                                    code: code,
                                    label: labels[name][code],
                                    selector: name
                                };

                            item.value = self.summaryRender(item);

                            s.values.push(item)

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
            this.id = String(window.fx_filter_id);
            log.info("Set filter id: " + this.id);
        }

        //Check if $el exist
        if (this.$el.length === 0) {
            errors.push({code: ERR.MISSING_CONTAINER});
            log.warn("Impossible to find filter container");
        }

        //check for selectors
        if (!this.items) {
            log.warn("Impossible to find selectors for filter: " + this.id);
            log.warn("Filer will wait for selectors dynamically");
        }

        //check if summary container exist
        if (this.summary$el) {

            this.summary$el = $(this.summary$el);

            if (this.summary$el.length === 0) {
                errors.push({code: ERR.MISSING_SUMMARY_CONTAINER});
                log.warn("Impossible to find summary container");
            }
        }

        return errors.length > 0 ? errors : valid;
    };

    Filter.prototype._attach = function () {

        this.$el.append(this.template);

    };

    Filter.prototype._initVariables = function () {

        this.semanticIds = [];
        this.semantics = {};
        this.semanticToResolve = [];

        this.selectors = {};
        this.semantic2selectors = {};
        this.selector2semantic = {};
        this.selectorTypes = [];

        this.dependeciesToDestory = [];

        this.mandatorySelectorIds = [];

        this.codelists = [];
        this.enumerations = [];

        //Summary
        this.hasSummary = (this.summary$el && this.summary$el.length) > 0;

        //Process selectors
        _.each(this.items, _.bind(function (selectorConf, selectorId) {

            this._evaluateSelectorConfiguration(selectorConf, selectorId);

        }, this));

        //pub/sub
        this.channels = {};

        this.cache_db = {};

        this.bridge = new Bridge({
            environment: this.environment,
            cache: this.cache
        })
    };

    Filter.prototype._initDynamicVariables = function () {

        this.selectorsId = Object.keys(this.selectors);

        this.codelists = _.uniq(this.codelists);
        this.enumerations = _.uniq(this.enumerations);

        this.$tabs = this.$el.find(s.SEMANTIC_TABS);

        this.$switches = this.$el.find(s.SWITCH);

    };

    Filter.prototype._removeItemReferences = function (id) {

        //remove id from result
        this.semanticIds = _.without(this.semanticIds, id);

        if (this.semantics.hasOwnProperty(id)) {

            var semantic = $.extend(true, {}, this.semantics[id]);

            _.each(semantic.selectors, _.bind(function (v, k) {
                this._removeSelectorReferences(k);
            }, this));

            semantic.$el.remove();

            this.semanticToResolve = _.without(this.semanticToResolve, id);

            delete this.semantics[id];

        }

        if (this.selectors.hasOwnProperty(id)) {
            this._removeSelectorReferences(id);
        }

    };

    Filter.prototype._removeSelectorReferences = function (id) {

        var selector = this.selectors[id];
        selector.instance.dispose();
        selector.el.remove();

        delete this.selectors[id];

        this.mandatorySelectorIds = _.without(this.mandatorySelectorIds, id);

        var semantic = this.selector2semantic[id];
        this.semantic2selectors[semantic] = _.without(this.semantic2selectors[semantic], id);

        delete this.selector2semantic[id];

        this.selectorsId = _.without(this.selectorsId, id);

    };

    Filter.prototype._evaluateSelectorConfiguration = function (value, key) {

        this.semanticIds.push(key);

        if (!this._isSemantic(value)) {

            this._processSelector(value, key, key);

        } else {

            this.semantics[key] = value;
            this.semanticToResolve.push(key);

            var semantic = $.extend(true, {}, value);

            this.semantics[key].$el = this._getSemanticContainer(key);

            delete semantic.selectors;

            _.each(value.selectors, _.bind(function (v, k) {

                //Hide selector switch by default
                //remove className by default
                var model = $.extend(true, {}, semantic, v, {
                    className: "",
                    template: {hideHeader: true}
                });

                this._processSelector(model, k, key);

            }, this));
        }

    };

    Filter.prototype._bindEventListeners = function () {

        amplify.subscribe(this._getEventName(EVT.SELECTOR_READY), this, this._onSelectorReady);

        this.$tabs.on('shown.bs.tab', _.bind(function () {

            amplify.publish(this._getEventName(EVT.SELECTORS_ITEM_SELECT));
        }, this));

        amplify.subscribe(this._getEventName(EVT.SELECTORS_ITEM_SELECT), this, this._onSelectorItemSelect);
        amplify.subscribe(this._getEventName(EVT.SELECTOR_DISABLED), this, this._updateSummary);
        amplify.subscribe(this._getEventName(EVT.SELECTOR_ENABLED), this, this._updateSummary);
        amplify.subscribe(this._getEventName(EVT.ITEM_REMOVED), this, this._onRemoveItem);

    };

    Filter.prototype._isSemantic = function (value) {
        return value.hasOwnProperty("selectors");
    };

    // Preload scripts and codelists

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

        _.each(this.enumerations, _.bind(function (cd) {

            //Check if codelist is cached otherwise query
            var stored = this._getStoredCodelist(cd);

            if (stored === undefined || stored.length < 2) {

                log.info(this._getCodelistCacheKey(cd) + " not in session storage.");

                promises.push(this._createPromise(cd, "enumeration"));

            } else {

                log.info(this._getCodelistCacheKey(cd) + " read from session storage.");
            }

        }, this));

        return this.bridge.all(promises);

    };

    Filter.prototype._onPreloadResourceError = function () {
        log.error("Resources load: error");
    };

    Filter.prototype._onPreloadResourceSuccess = function () {

        log.info("Resources loaded");

        this._bindEventListeners();

        this._initPage();

        this._renderSelectors();

    };

    Filter.prototype._createPromise = function (obj, type) {

        var self = this,
            body = obj,
            key = this._getCodelistCacheKey(obj);

        return this._getPromise(body, type)
            .then(function (result) {

                var data = [];

                if (!result) {
                    log.error("Code List loaded returned empty! id: " + key);
                    log.warn('Add placeholder code list');

                    var title = {};
                    title[self.lang] = "EMPTY_CODE_LIST :'(";

                    data.push({
                        code: "fake_code",
                        leaf: true,
                        level: 1,
                        rid: "fake_rid",
                        title: title
                    });
                }

                if (!Array.isArray(result)) {

                    _.each(result, function (obj, key) {
                        data.push({
                            code: key,
                            title: $.extend(true, {}, obj)
                        })
                    });

                } else {
                    data = result;
                }

                log.info("Code List loaded successfully for: " + key);

                self._storeCodelist(body, data);

                return data;

            }, function (r) {
                log.error(r);
            });
    };

    Filter.prototype._storeCodelist = function (obj, cl) {

        this.cache_db[this._getCodelistCacheKey(obj)] = cl;

        return this.cache_db[this._getCodelistCacheKey(obj)];
    };

    Filter.prototype._getStoredCodelist = function (obj) {

        return this.cache_db[this._getCodelistCacheKey(obj)];
    };

    Filter.prototype._getCodelistCacheKey = function (o) {

        var obj = typeof o === 'object' ? o : {},
            key = "_",
            keys = Object.keys(obj).sort();

        for (var i = 0; i < keys.length; i++) {
            key += "_" + keys[i] + ":" + obj[keys[i]];
        }

        return key;
    };

    Filter.prototype._getPromise = function (body, type) {

        var promise,
            t = type || "";
        switch (t.toLowerCase()) {

            case "enumeration" :
                promise = this.bridge.getEnumeration({
                    uid: body.uid
                });
                break;

            default :

                promise = this.bridge.getCodeList({
                    body: body
                });

                break;
        }

        return promise;

    };

    Filter.prototype._getSelectorScriptPath = function (name) {

        var corePlugins = this.corePlugins,
            registeredSelectors = $.extend(true, {}, this.pluginRegistry),
            path,
            conf,
            isCore;

        isCore = _.contains(corePlugins, name);

        if (isCore) {
            return codePluginsFolder + name;
        }

        conf = registeredSelectors[name];

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

            this._getSelectorContainer(id).closest(s.SEMANTICS).addClass(this.mandatorySelectorClassName);
            this._getSelectorContainer(id).closest(s.SELECTORS).addClass(this.mandatorySelectorClassName);
        }, this));

    };

    Filter.prototype._configureSelectorsStatus = function () {

        //default disabled selectors
        log.info("Disabling disabled selectors by default");

        _.each(this.selectorsId, _.bind(function (s) {

            var status = this._callSelectorInstanceMethod(s, "getStatus");

            var semantic = this.selector2semantic[s];

            if (status.disabled === true) {

                _.each(this.semantic2selectors[semantic], _.bind(function (n) {
                    this._disableSelectorAndSwitch(n);
                }, this));

            } else {

                _.each(this.semantic2selectors[semantic], _.bind(function (n) {
                    this._enableSelectorAndSwitch(n);
                }, this));

            }

        }, this));

    };

    Filter.prototype._renderSelectors = function () {

        this.ready = false;

        this.selectorsReady = 0; //used for "ready" event

        //In case there are selectors set timeout
        if (this.selectorsId.length > 0) {

            this.validTimeout = window.setTimeout(function () {

                //alert(ERR.READY_TIMEOUT);
                log.error(ERR.READY_TIMEOUT);

            }, C.validityTimeout);
        } else {
            //no selectors by default
            window.setTimeout(_.bind(function () {
                this._onReady();
            }, this), 100);
        }

        _.each(this.selectors, _.bind(function (obj, name) {

            if (!obj.initialized) {

                obj.initialized = true;

                var selectorId = obj.selector.id,
                    rawCl;

                rawCl = this._getStoredCodelist(obj.cl || obj.enumeration);

                this._getSelectorRender(selectorId, _.bind(function (Selector) {

                    var model = $.extend(true, {}, obj, this.common, {
                        id: name,
                        data: rawCl ? rawCl : null,
                        controller: this,
                        lang: this.lang
                    });

                    this.selectors[name].instance = new Selector(model);
                }, this));

            } else {
                log.info(name + " selector is already initialized.");

                var status = this._callSelectorInstanceMethod(name, "getStatus");

                if (status.ready === true) {

                    this._onSelectorReady();

                } else {
                    log.warn(name + " selector was previously initialized but its inner status was not set to ready.");
                }
            }

        }, this));

    };

    // filter selection [values] and validation

    Filter.prototype._getValues = function (includedSelectors) {

        var result = {
            valid: false,
            labels: {},
            values: {}
        };

        if (this.ready !== true) {
            log.warn("Abort getValues() because filter is not ready");
            return result;
        }

        _.each(this.semanticIds, _.bind(function (n) {

            var name = this._resolveSelectorName(n),
                status = this._callSelectorInstanceMethod(name, "getStatus");

            if (includeSelector(name) && status.disabled !== true) {

                var v = this._callSelectorInstanceMethod(name, "getValues");

                result.values[n] = v.values;
                result.labels[n] = v.labels;

            } else {

                log.warn(n + " selector not included in filter result.");
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

        function includeSelector(id) {
            var include = true;

            if (Array.isArray(includedSelectors) && !_.contains(includedSelectors, id)) {
                include = false;
            }

            return include;
        }

    };

    Filter.prototype._setValues = function (o, silent) {

        var source = {};

        //Extend obj with
        _.each(o.values, _.bind(function (array, key) {

            source[key] = [];

            _.each(array, function (item) {

                if (typeof item === 'object' && !item.label) {
                    var labels = o.labels[key];
                    item.label = labels ? o.labels[key][item.value] : "Missing label";
                }

                source[key].push(item);

            });

        }, this));

        _.each(source, _.bind(function (obj, key) {

            var name = this._resolveSelectorName(key);

            if (this._getSelectorInstance(name)) {
                this._callSelectorInstanceMethod(name, "setValue", obj, silent);
            } else {
                log.info(name + " skipped");
            }

        }, this));

        log.info("Filter values set");
    };

    Filter.prototype._setSources = function (o) {

        _.each(o, _.bind(function (obj, key) {

            var name = this._resolveSelectorName(key);

            if (this._getSelectorInstance(name)) {
                this._callSelectorInstanceMethod(name, "setSource", obj);
            } else {
                log.info(name + " skipped");
            }

        }, this));

        log.info("Selectors sources set");
    };

    Filter.prototype._getEnabledSelectors = function () {

        var result = [];
        _.each(this.semanticIds, _.bind(function (n) {

            var name = this._resolveSelectorName(n),
                status = this._callSelectorInstanceMethod(name, "getStatus");

            if (!status.disabled === true) {
                result.push(name)
            }

        }, this));

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

        _.each(this.selectors, _.bind(function (sel, id) {

            if (!sel.hasOwnProperty("dependencies")) {
                return;
            }

            this._processSelectDependencies(sel.dependencies, id);

        }, this));
    };

    Filter.prototype._resolveDependencySelectors = function (id) {

        if (!id.startsWith("@")) {
            return [id]
        } else {

            id = id.substring(1);

            switch (id.toLowerCase()) {
                case "all":
                    return this.selectorsId;
                    break;
                default:
                    log.error(ERR.UNKNOWN_DEPENDENCY_ID);
                    break;
            }
        }

    };

    Filter.prototype._resolveDependencyEvent = function (id) {

        var event;

        switch (id.toLowerCase()) {
            case 'disable':
                event = this._getEventName(EVT.SELECTOR_DISABLED);
                break;
            case 'select':
                event = this._getEventName(EVT.SELECTORS_ITEM_SELECT);
                break;
            default:
                log.error(ERR.UNKNOWN_DEPENDENCY_EVENT);
                break;
        }

        return event;
    };

    Filter.prototype._processSelectDependencies = function (d, id) {

        var self = this;

        _.each(d, _.bind(function (dependencies, selectorId) {

            //Ensure dependencies is an array
            if (!Array.isArray(dependencies)) {
                dependencies = [dependencies];
            }

            var selectors = this._resolveDependencySelectors(selectorId);

            _.each(selectors, _.bind(function (s) {

                _.each(dependencies, _.bind(function (d) {

                    if (typeof d !== "object") {
                        log.warn(JSON.stringify(d) + " is not a valid dependency configuration");
                        return;
                    }

                    var toAdd = {
                        event: this._resolveDependencyEvent(d.event).concat(s),
                        callback: function (payload) {

                            var call = self["_dep_" + d.id];

                            if ($.isFunction(call)) {
                                call.call(self, payload, {src: s, target: id, args: d.args});
                            } else {
                                log.error("Impossible to find : " + "_dep_" + d.id);
                            }
                        }
                    };

                    this.dependeciesToDestory.push(toAdd);

                    amplify.subscribe(toAdd.event, this, toAdd.callback);

                }, this));

            }, this));

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

        if (this.selectors[o.target]) {

            var c = this.selectors[o.target].cl;

            if (c) {

                log.info("_dep_parent invokation");
                log.info(o);

                //delete c.levels;
                //c.levels = 2;
                delete c.level;

                c.codes = [];

                _.each(payload, function (item) {
                    c.codes.push(item.value);
                });

                this._getPromise(c).then(
                    _.bind(function (data) {

                        var source = [];

                        _.each(data, function (s) {
                            source = source.concat(s.children);
                        });

                        source = _.uniq(source);
                        this._callSelectorInstanceMethod(o.target, "_dep_parent", {data: source});
                    }, this),
                    function (r) {
                        log.error(r);
                    }
                )
            }
        }
    };

    Filter.prototype._dep_parent = function (payload, o) {

        if (this.selectors[o.target]) {

            var c = this.selectors[o.target].cl;

            if (c) {

                log.info("_dep_parent invokation");
                log.info(o);

                //delete c.levels;
                //c.levels = 2;
                delete c.level;

                c.codes = [];

                _.each(payload, function (item) {
                    c.codes.push(item.value);
                });

                this._getPromise(c).then(
                    _.bind(function (data) {

                        var source = [];

                        _.each(data, function (s) {
                            source = source.concat(s.children);
                        });

                        source = _.uniq(source);
                        this._callSelectorInstanceMethod(o.target, "_dep_parent", {data: source});
                    }, this),
                    function (r) {
                        log.error(r);
                    }
                )
            }
        }
    };

    Filter.prototype._dep_process = function (payload, o) {
        if (this.selectors[o.target]) {

            var process = $.extend(true, {}, o.args);

            if (process) {

                log.info("_dep_process invokation");
                log.info(payload);
                log.info(o);

                if (!process.body) {
                    log.error("Impossible to find args.body for " + o.target + " `process` dependency configuration.");
                    return;
                }

                if (!process.uid) {
                    log.error("Impossible to find args.uid for " + o.target + " `process` dependency configuration.");
                    return;
                }

                var body = JSON.stringify(Array.isArray(process.body) ? process.body : [process.body]),
                    templ,
                    model = {};

                templ = Handlebars.compile(body);

                if (o.args.hasOwnProperty("payloadIncludes")) {

                    var selectors = _.without(this._getModelValues(o.args.payloadIncludes), o.target);

                    log.info("Selectors included in process: " + JSON.stringify(selectors));

                    var values = this.getValues(null, selectors) || {};

                    model = values.values;

                } else {

                    if (!Array.isArray(payload)){
                        payload = [payload];
                    }
                    model[o.src] = payload;
                }

                _.each(model, function (values, key) {
                    model[key] = processArrayForHandlebars(values)
                });

                log.info("Model for the process:");
                log.info(model);

                process.body = JSON.parse(templ(model));

                //add lang
                if (!process.params) {
                    process.params = {};
                }
                process.params.language = this.lang;

                this.bridge.getProcessedResource(process).then(
                    _.bind(function (result) {

                        var data = Array.isArray(result.data) ? result.data : [],
                            source = [];

                        _.each(data.data, function (s) {
                            source.push({
                                value: s[o.args.indexValueColumn || 0],
                                label: s[o.args.indexLabelColumn || 1]
                            });
                        });

                        source = _.uniq(source);

                        this._callSelectorInstanceMethod(o.target, "_dep_process", {data: source});

                    }, this),
                    function (r) {
                        log.error(r);
                    }
                )
            }
        }

        function processArrayForHandlebars(values) {

            var result = values.map(function (p) {
                return typeof p === "object" ? p.value : p;
            });

             result = result.join('","');

            return result;
        }
    };

    Filter.prototype._dep_ensure_unset = function (payload, o) {
        log.info("_dep_ensure_unset invokation");
        log.info(o);

        if (this.selectors[o.target]) {

            this._callSelectorInstanceMethod(o.target, "_dep_ensure_unset", {
                value: this.selector2semantic[o.src],
                enabled: this._getEnabledSelectors()
            });
        }

    };

    Filter.prototype._dep_disable = function (payload, o) {
        log.info("_dep_disable invokation");
        log.info(o);

        if (this.selectors[o.target]) {
            if (!!payload.value) {
                this._callSelectorInstanceMethod(o.target, "enable");
            } else {
                this._callSelectorInstanceMethod(o.target, "disable");
            }
        }

    };

    //Output formats

    Filter.prototype._format_plain = function (values) {
        return values;
    };

    Filter.prototype._format_fenix = function (values) {

        return Utils.toD3P(this.items, values);

    };

    Filter.prototype._format_catalog = function (values) {

        return Utils.toFilter(this.items, values);

    };

    // Handlers

    Filter.prototype._onSelectorReady = function () {

        this.selectorsReady++;

        if (this.selectorsReady === this.selectorsId.length) {

            log.info("All selectors are ready");

            this._onReady();

        }
    };

    Filter.prototype._onReady = function () {
        log.info("Filter [" + this.id + "] is ready");

        this.$switches.on("change", _.bind(function (e) {

            var $this = $(e.currentTarget),
                semantic = $(e.currentTarget).attr("data-target"),
                selectors = this.semantic2selectors[semantic];

            log.info("Switch change status: " + $this.is(':checked'));

            _.each(selectors, _.bind(function (sel) {

                // $this will contain a reference to the checkbox
                if ($this.is(':checked')) {
                    // the checkbox was checked

                    this._enableSelectorAndSwitch(sel);

                } else {

                    this._disableSelectorAndSwitch(sel);
                }

            }, this));

        }, this));

        this._initDependencies();

        this._configureSelectorsStatus();

        this._checkItemsAmount();

        window.clearTimeout(this.validTimeout);

        amplify.publish(this._getEventName(EVT.SELECTORS_READY));

        // set default values
        if (!$.isEmptyObject(this.values)) {
            this.setValues(this.values, true);
        }

        this.ready = true;

        this._trigger('ready');

        this._updateSummary();

    };

    Filter.prototype._getEventName = function (evt) {

        return this.id.concat(evt);
    };

    Filter.prototype._onSelectorItemSelect = function (values) {

        if (this.ready === true) {
            this._trigger('change', values);
        }

        this._updateSummary();
    };

    Filter.prototype._addSelector = function (name, obj) {

        var willBeAdded = true;

        if (_.contains(this.selectorsId, name)) {
            willBeAdded = false;
        }

        if (this._isSemantic(obj)) {

            _.each(obj.selectors, _.bind(function (obj, key) {

                if (_.contains(this.selectorsId, key)) {
                    willBeAdded = false;
                }

            }, this));
        }

        if (!willBeAdded) {
            log.warn(name + " selector will not be added because it already exist or, if semantic, contains id that already exist.");
        } else {
            this.items[name] = obj;
            this._evaluateSelectorConfiguration(obj, name);
            this._renderFilter();
            this._checkItemsAmount();
        }

    };

    Filter.prototype._onRemoveItem = function (obj) {

        this.remove(obj.id);

        this._checkItemsAmount();

    };

    Filter.prototype._lockRemoveButtons = function () {
        this.$el.find(s.REMOVE_BTN).attr("disabled", true);
    };

    Filter.prototype._unlockRemoveButtons = function () {
        this.$el.find(s.REMOVE_BTN).attr("disabled", false);
    };

    Filter.prototype._checkItemsAmount = function () {

        if (this.ensureAtLeast < 0) {
            return;
        }

        if (Object.keys(this.items).length <= this.ensureAtLeast) {
            this._lockRemoveButtons();
        } else {
            this._unlockRemoveButtons();
        }
    };

    Filter.prototype._removeSelector = function (id) {

        delete this.items[id];

        this._removeItemReferences(id);

        this._updateSummary();

    };

    // utils for selectors

    Filter.prototype._callSelectorInstanceMethod = function (name, method, opts1, opts2) {

        var Instance = this._getSelectorInstance(name);

        if (!Instance) {
            log.warn(id + " is not a current selector.");

            return
        }

        if ($.isFunction(Instance[method])) {

            return Instance[method](opts1, opts2);

        } else {
            log.error(name + " selector does not implement the mandatory " + method + "() fn");
        }

    };

    Filter.prototype._processSelector = function (obj, selectorId, semanticId) {

        if (!obj.hasOwnProperty('selector')) {
            alert(selectorId + " does not have a valid configuration. Missing 'selector' configuration.");
        }

        if (!obj.selector.hasOwnProperty('id')) {
            alert(selectorId + " does not have a valid configuration. Missing 'selector.id' configuration.");
        }

        this.selectors[selectorId] = obj;

        //Selector id
        var selectorType = obj.selector.id.toLowerCase();
        if (!_.contains(this.selectorTypes, selectorType)) {
            this.selectorTypes.push(selectorType);
        }

        //selector container
        obj.el = this._getSelectorContainer(selectorId);

        //get set of codelists
        if (obj.hasOwnProperty("cl")) {
            var cl = obj.cl;
            if (obj.selector.lazy === true) {
                log.warn("Lazy loading for selector: " + selectorId);
                cl.levels = 1;
                cl.level = 1;
            }
            this.codelists.push(cl);
        }

        //get set of enumeration
        if (obj.hasOwnProperty("enumeration")) {
            this.enumerations.push(obj.enumeration);
        }

        //get mandatory selectors id
        if (obj.hasOwnProperty("validation") && obj.validation.mandatory === true) {
            this.mandatorySelectorIds.push(selectorId);
        }

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

    Filter.prototype._getSelectorRender = function (name, callback) {

        return require([this._getSelectorScriptPath(name)], callback);
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

        var selector = this.selectors[name];

        if (!selector) {
            log.warn("Impossible to find selector obj " + name);

            return;
        }

        var instance = selector.instance;

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

            $cont = $("<div data-selector='" + id + "'  class='" + (conf.className || '') + "'></div>");

            if (this.direction === "append") {
                this.$el.append($cont);
            } else {
                this.$el.prepend($cont);
            }

        }

        if (conf.templateIsInitialized !== true) {
            conf.templateIsInitialized = true;
            $cont.append(this._createSelectorContainer(id));
        }

        return $cont;
    };

    Filter.prototype._getSemanticContainer = function (id) {

        var $cont = this.$el.find('[data-semantic="' + id + '"]'),
            conf = this.semantics[id] || {};

        if ($cont.length === 0) {
            log.warn("Impossible to find semantic container: " + id);

            $cont = $("<div data-semantic='" + id + "' class='" + conf.className + "'></div>");

            if (this.direction === "append") {
                this.$el.append($cont);
            } else {
                this.$el.prepend($cont);
            }
        }

        if (conf.templateIsInitialized !== true) {
            conf.templateIsInitialized = true;
            $cont.append(this._createSemanticContainer(id));
        }

        return $cont;
    };

    Filter.prototype._createSemanticContainer = function (id) {
        log.info("Create container for semantic: " + id);

        var classNames = "",
            semantic = this.semantics[id],
            templ = Handlebars.compile($(templates).find(s.TEMPLATE_SEMANTIC)[0].outerHTML),
            conf = $.extend(true, {}, C.template, this.common.template),
            $html,
            model;

        _.each(semantic.selectors, _.bind(function (obj, name) {
            obj.id = name;
            obj.ref = name.concat(this.id).replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_');

            if (!obj.selector) {
                obj.selector = {};
            }

            if (!obj.template) {
                obj.template = {};
            }

            obj.selector.title = obj.template.title ? obj.template.title : "Missing title: " + obj.id;

        }, this));

        model = $.extend(true, {id: id}, conf, semantic, semantic.template, i18nLabels);

        _.each(model, function (value, key) {
            if (value === true) {
                classNames = classNames.concat(key + " ");
            }
        });

        model.classNames = classNames;

        $html = $(templ(model));

        $html.find(s.REMOVE_BTN).on("click", _.bind(function () {
            amplify.publish(this._getEventName(EVT.ITEM_REMOVED), {id: id});
        }, this));

        //TODO active tab by conf
        $html.find("ul").children().first().addClass("active");
        $html.find(".tab-content").children().first().addClass("active");

        return $html;
    };

    Filter.prototype._createSelectorContainer = function (id) {
        log.info("Create container for selector: " + id);

        var classNames = "",
            obj = this.selectors[id].template,
            template = Handlebars.compile($(templates).find(s.TEMPLATE_SELECTOR)[0].outerHTML),
            conf = $.extend(true, {id: id}, i18nLabels, C.template, this.common.template, obj),
            $html;

        _.each(conf, function (value, key) {
            if (value === true) {
                classNames = classNames.concat(key + " ");
            }
        });

        $html = $(template($.extend(true, {classNames: classNames}, conf)));

        $html.find(s.REMOVE_BTN).on("click", _.bind(function () {
            amplify.publish(this._getEventName(EVT.ITEM_REMOVED), {id: id});
        }, this));

        return $html.append();
    };

    Filter.prototype._disableSelectorAndSwitch = function (d) {

        this._getSelectorContainer(d).closest(s.SELECTORS).children().children().not(s.TEMPLATE_HEADER).addClass(this.disabledSelectorClassName);
        this._getSelectorContainer(d).closest(s.SEMANTICS).children().children().not(s.TEMPLATE_HEADER).addClass(this.disabledSelectorClassName);

        this._getSelectorContainer(d).closest(s.SELECTORS).find(s.SWITCH).prop('checked', false);
        this._getSelectorContainer(d).closest(s.SEMANTICS).find(s.SWITCH).prop('checked', false);

        this._callSelectorInstanceMethod(d, 'disable');

        amplify.publish(this._getEventName(EVT.SELECTOR_DISABLED), {value: false});
        amplify.publish(this._getEventName(EVT.SELECTOR_DISABLED.concat(d)), {value: false});

        if (this.ready === true) {
            this._trigger('change');
        }
    };

    Filter.prototype._enableSelectorAndSwitch = function (d) {

        this._getSelectorContainer(d).closest(s.SELECTORS).children().children().not(s.TEMPLATE_HEADER).removeClass(this.disabledSelectorClassName);
        this._getSelectorContainer(d).closest(s.SEMANTICS).children().children().not(s.TEMPLATE_HEADER).removeClass(this.disabledSelectorClassName);

        this._getSelectorContainer(d).closest(s.SELECTORS).find(s.SWITCH).prop('checked', true);
        this._getSelectorContainer(d).closest(s.SEMANTICS).find(s.SWITCH).prop('checked', true);

        this._callSelectorInstanceMethod(d, 'enable');

        amplify.publish(this._getEventName(EVT.SELECTOR_ENABLED), {value: false});
        amplify.publish(this._getEventName(EVT.SELECTOR_ENABLED.concat(d)), {value: false});

        amplify.publish(this._getEventName(EVT.SELECTOR_DISABLED), {value: true});
        amplify.publish(this._getEventName(EVT.SELECTOR_DISABLED.concat(d)), {value: true});

        if (this.ready === true) {
            this._trigger('change');
        }

    };

    Filter.prototype._getModelValues = function (ids) {

        if (!Array.isArray(ids)) {
            log.error("`args.payloadIncludes` configuration has to be an array");
            return {};
        }

        var selectedIds = [];

        _.each(ids, _.bind(function (id) {

            selectedIds = selectedIds.concat(this._resolveDependencySelectors(id));
        }, this));

        selectedIds = _.uniq(selectedIds);

        return selectedIds;
    };

    //disposition
    Filter.prototype._unbindEventListeners = function () {

        amplify.unsubscribe(this._getEventName(EVT.SELECTOR_READY), this._onSelectorReady);
        amplify.unsubscribe(this._getEventName(EVT.SELECTORS_ITEM_SELECT), this._onSelectorItemSelect);
        amplify.unsubscribe(this._getEventName(EVT.SELECTOR_DISABLED), this._updateSummary);
        amplify.unsubscribe(this._getEventName(EVT.SELECTOR_ENABLED), this._updateSummary);
        amplify.unsubscribe(this._getEventName(EVT.ITEM_REMOVED), this._onRemoveItem);

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

        //empty filter container
        this.$el.empty();

    };

    return Filter;
});