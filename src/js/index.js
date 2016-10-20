define([
    'jquery',
    'underscore',
    'loglevel',
    '../config/errors',
    '../config/events',
    '../config/config',
    '../html/selector.hbs',
    '../html/group.hbs',
    '../html/semanticGroup.hbs',
    '../html/summary.hbs',
    '../nls/labels',
    "fenix-ui-bridge",
    "fenix-ui-converter",
    "amplify-pubsub",
    'handlebars',
    'bootstrap'
], function ($, _, log, ERR, EVT, C, templateSelector, templateGroup, templateSemanticGroup, templateSummary, i18nLabels, Bridge, Converter, amplify, Handlebars) {

    'use strict';

    var codePluginsFolder = "./selectors/",
        defaultOptions = {
            summaryRender: function (params) {
                return this._summaryRender(params);
            }
        },
        s = {
            CLASSNAME: ".fx-selector",
            SELECTOR_DISABLED_CLASSNAME: "fx-selector-disabled",
            SELECTORS: "[data-selector]",
            GROUPS: "[data-group]",
            TREE_CONTAINER: "[data-role='tree']",
            FILTER_CONTAINER: "[data-role='filter']",
            CLEAR_ALL_CONTAINER: "[data-role='clear']",
            AMOUNT_CONTAINER: "[data-role='amount']",
            COMPARE_RADIO_BTNS: "input:radio[name='compare']",
            COMPARE_RADIO_BTNS_CHECKED: "input:radio[name='compare']:checked",
            ACTIVE_TAB: "ul[data-group-list] li.active",
            GROUP_TABS: "[data-group] a[data-toggle='tab']",
            SWITCH: "input[data-role='switch'][name='disable-selector']",
            SUMMARY_SELECTOR: "[data-code]",
            REMOVE_BTN: "[data-role='remove']",
            TEMPLATE_HEADER: "[data-selector-header]"
        };

    function Filter(o) {
        log.info("FENIX filter");
        log.info(o);

        require("../css/fenix-ui-filter.css");

        $.extend(true, this, C, {initial: o}, defaultOptions);

        this._parseInput(o);

        var valid = this._validateInput();

        if (valid === true) {

            this._attach();

            this._initVariables();

            this._renderFilter();

            return this;

        } else {
            log.error("Impossible to create Filter!");
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

        _.each(this.groupIds, _.bind(function (id) {
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

        this._selectors = this.initial.selectors || {};
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

    Filter.prototype._summaryRender = function (selector) {
        return selector.label + "<span class='code-brk'>[" + selector.code + "]</span>";
    };

    Filter.prototype._updateSummary = function () {

        if (!this.hasSummary) {
            return;
        }

        log.info("Update filter summary");

        var self = this,
            model = {summary: createSummaryModel(this._getValues())};

        //unbind click listener
        this.summary$el.find(s.SUMMARY_SELECTOR).each(function () {
            $(this).off();
        });

        this.summary$el.html(templateSummary(model));

        //bind click listener
        this.summary$el.find(s.SUMMARY_SELECTOR).each(function () {
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

                        var id = this.group2selectors[name][0],
                            model = this.selectors[id] || this.groups[id];

                        var s = {
                            label: model.template ? model.template.title : "",
                            id: id,
                            values: []
                        };

                        _.each(obj, _.bind(function (v) {

                            var code = typeof v === 'object' ? v.value : v,
                                selector = {
                                    code: code,
                                    label: labels[name][code],
                                    selector: name
                                };

                            selector.value = self.summaryRender(selector);

                            s.values.push(selector)

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
        if (!this._selectors) {
            log.warn("Impossible to find 'selectors' for filter: " + this.id);
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

        this.groupIds = [];
        this.groups = {};
        this.groupToResolve = [];

        this.selectors = {};
        this.group2selectors = {};
        this.selector2group = {};
        this.selectorTypes = [];

        this.dependeciesToDestory = [];

        this.mandatorySelectorIds = [];

        this.codelists = [];
        this.enumerations = [];

        //Summary
        this.hasSummary = (this.summary$el && this.summary$el.length) > 0;

        //Process selectors
        _.each(this._selectors, _.bind(function (selectorConf, selectorId) {

            this._evaluateSelectorConfiguration(selectorConf, selectorId);

        }, this));

        //pub/sub
        this.channels = {};

        this.cache_db = {};

        this.bridge = new Bridge({
            environment: this.environment,
            cache: this.cache
        });

        //force to do not chunk codes
        return require(codePluginsFolder + this.corePlugins[0] + ".js");
    };

    Filter.prototype._initDynamicVariables = function () {

        this.selectorsId = Object.keys(this.selectors);

        this.codelists = _.uniq(this.codelists);
        this.enumerations = _.uniq(this.enumerations);

        this.$tabs = this.$el.find(s.GROUP_TABS);

        this.$switches = this.$el.find(s.SWITCH);

    };

    Filter.prototype._removeSelectorReferences = function (id) {

        //remove id from result
        this.groupIds = _.without(this.groupIds, id);

        if (this.groups.hasOwnProperty(id)) {

            var group = $.extend(true, {}, this.groups[id]);

            _.each(group.selectors, _.bind(function (v, k) {
                this._removeSelectorReferences(k);
            }, this));

            group.$el.remove();

            this.groupToResolve = _.without(this.groupToResolve, id);

            delete this.groups[id];

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

        var group = this.selector2group[id];
        this.group2selectors[group] = _.without(this.group2selectors[group], id);

        delete this.selector2group[id];

        this.selectorsId = _.without(this.selectorsId, id);

    };

    Filter.prototype._evaluateSelectorConfiguration = function (value, key) {

        this.groupIds.push(key);

        if (!this._isGroup(value)) {

            this._processSelector(value, key, key);

        } else {

            this.groups[key] = value;
            this.groupToResolve.push(key);

            var group = $.extend(true, {}, value);

            this.groups[key].$el = this._getGroupContainer(key);

            delete group.selectors;

            _.each(value.selectors, _.bind(function (v, k) {

                //Hide selector switch by default
                //remove className by default
                var model = $.extend(true, {}, group, v, {
                    className: "",
                    template: {
                        hideSwitch: true,
                        hideRemoveButton: true
                    }
                });

                this._processSelector(model, k, key);

            }, this));
        }

    };

    Filter.prototype._bindEventListeners = function () {

        amplify.subscribe(this._getEventName(EVT.SELECTOR_READY), this, this._onSelectorReady);

        this.$tabs.on('shown.bs.tab', _.bind(function () {
            amplify.publish(this._getEventName(EVT.SELECTOR_SELECT));
        }, this));

        amplify.subscribe(this._getEventName(EVT.SELECTOR_SELECT), this, this._onSelectorSelectorSelect);
        amplify.subscribe(this._getEventName(EVT.SELECTOR_CLICK), this, this._onSelectorSelectorClick);
        amplify.subscribe(this._getEventName(EVT.SELECTOR_DISABLED), this, this._updateSummary);
        amplify.subscribe(this._getEventName(EVT.SELECTOR_ENABLED), this, this._updateSummary);
        amplify.subscribe(this._getEventName(EVT.SELECTOR_REMOVED), this, this._onRemoveSelector);

    };

    Filter.prototype._isGroup = function (value) {
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
        _.each(this.mandatorySelectorIds, _.bind(function (id) {

            this._getSelectorContainer(id).closest(s.GROUPS).addClass(this.mandatorySelectorClassName);
            this._getSelectorContainer(id).closest(s.SELECTORS).addClass(this.mandatorySelectorClassName);
        }, this));

        log.info("Add class to mandatory selectors: success");

    };

    Filter.prototype._configureSelectorsStatus = function () {

        //default disabled selectors

        _.each(this.selectorsId, _.bind(function (s) {

            var status = this._callSelectorInstanceMethod(s, "getStatus");

            if (status.disabled === true) {
                this._disableSelectorAndSwitch(s);
            } else {
                this._enableSelectorAndSwitch(s);
            }

        }, this));

        log.info("Disable/enable selectors by default: success");

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

        var self = this,
            result = {
                valid: false,
                labels: {},
                values: {}
            },
            v;

        if (this.ready !== true) {
            log.warn("Abort getValues() because filter is not ready");
            return result;
        }

        _.each(this.groupIds, _.bind(function (n) {

            var group = this.groups[n];

            v = group && !group.semantic ? getValuesFromGroup(group) : getValuesFromSelectorOrSemanticGroup(n);

            result.values[n] = v.values;
            result.labels[n] = v.labels;

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

        function getValuesFromSelectorOrSemanticGroup(id) {

            var v = {},
                name = self._resolveSelectorName(id),
                status = self._callSelectorInstanceMethod(name, "getStatus");

            if (includeSelector(name) && status.disabled !== true) {

                v = self._callSelectorInstanceMethod(name, "getValues");

            } else {

                log.warn(id + " selector not included in filter result.");
            }

            return v;
        }

        function getValuesFromGroup(group) {

            var values = {},
                labels = {};

            console.log(group)

            _.each(group.selectors, _.bind(function (g) {

                var name = this._resolveSelectorName(g.id),
                    status = this._callSelectorInstanceMethod(name, "getStatus");

                if (includeSelector(name) && status.disabled !== true) {

                    var v = self._callSelectorInstanceMethod(name, "getValues");

                    values[name] = v.values;
                    labels[name] = v.labels;

                } else {

                    log.warn(name + " selector not included in filter result.");
                }

            }, self));

            return {
                values: [values],
                labels: labels
            }
        }

    };

    Filter.prototype._setValues = function (o, silent) {

        var source = {};

        //Extend obj with
        _.each(o.values, _.bind(function (array, key) {

            source[key] = [];

            _.each(array, function (selector) {

                if (typeof selector === 'object' && !selector.label) {
                    var labels = o.labels[key];
                    selector.label = labels ? o.labels[key][selector.value] : "Missing label";
                }

                source[key].push(selector);

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
        _.each(this.groupIds, _.bind(function (n) {

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
            errors = [];

        //mandatory fields
        _.each(this.mandatorySelectorIds, _.bind(function (id) {

            if (!s.values.hasOwnProperty(id) || !s.values[id] || s.values[id] < 1) {
                var e = {};
                e.code = 'missing_mandatory_field';
                e.details = {id: this.selector2group[id]};
                errors.push(e)

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
                event = this._getEventName(EVT.SELECTOR_SELECT);
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
        log.info(payload);
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

                _.each(payload, function (selector) {
                    c.codes.push(selector.value);
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

                _.each(payload, function (selector) {
                    c.codes.push(selector.value);
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

                if (process.hasOwnProperty("payloadIncludes")) {

                    var selectors = _.without(this._getModelValues(process.payloadIncludes), o.target);
                    log.info("Selectors included in process: " + JSON.stringify(selectors));

                    var values = this.getValues(null, selectors) || {};

                    model = values.values;

                } else {

                    if (!Array.isArray(payload)) {
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

                        _.each(data, function (s) {
                            source.push({
                                value: s[process.indexValueColumn || 0],
                                label: s[process.indexLabelColumn || 1]
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
                value: this.selector2group[o.src],
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

        return Converter.toD3P(this._selectors, values);

    };

    Filter.prototype._format_catalog = function (values) {

        return Converter.toFilter(this._selectors, values);

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
        log.info("~~~~ Filter [" + this.id + "] is ready");

        this.$switches.on("change", _.bind(function (e) {

            var $this = $(e.currentTarget),
                group = $(e.currentTarget).attr("data-target"),
                selectors = this.group2selectors[group];

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

        this._checkSelectorsAmount();

        window.clearTimeout(this.validTimeout);

        amplify.publish(this._getEventName(EVT.FILTER_READY));

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

    Filter.prototype._onSelectorSelectorSelect = function (values) {

        if (this.ready === true) {
            this._trigger('change', values);
        }

        this._updateSummary();
    };


    Filter.prototype._onSelectorSelectorClick = function (values) {

        if (this.ready === true) {
            this._trigger('click', values);
        }

    };

    Filter.prototype._addSelector = function (name, obj) {

        var willBeAdded = true;

        if (_.contains(this.selectorsId, name)) {
            willBeAdded = false;
        }

        if (this._isGroup(obj)) {

            _.each(obj.selectors, _.bind(function (obj, key) {

                if (_.contains(this.selectorsId, key)) {
                    willBeAdded = false;
                }

            }, this));
        }

        if (!willBeAdded) {
            log.warn(name + " selector will not be added because it already exist or, if group, contains id that already exist.");
        } else {
            this._selectors[name] = obj;
            this._evaluateSelectorConfiguration(obj, name);
            this._renderFilter();
            this._checkSelectorsAmount();
        }

    };

    Filter.prototype._onRemoveSelector = function (obj) {

        this.remove(obj.id);

        this._checkSelectorsAmount();

    };

    Filter.prototype._lockRemoveButtons = function () {
        this.$el.find(s.REMOVE_BTN).attr("disabled", true);
    };

    Filter.prototype._unlockRemoveButtons = function () {
        this.$el.find(s.REMOVE_BTN).attr("disabled", false);
    };

    Filter.prototype._checkSelectorsAmount = function () {

        if (this.ensureAtLeast < 0) {
            return;
        }

        if (Object.keys(this._selectors).length <= this.ensureAtLeast) {
            this._lockRemoveButtons();
        } else {
            this._unlockRemoveButtons();
        }
    };

    Filter.prototype._removeSelector = function (id) {

        delete this._selectors[id];

        this._removeSelectorReferences(id);

        this._updateSummary();

    };

    // utils for selectors

    Filter.prototype._callSelectorInstanceMethod = function (name, method, opts1, opts2) {

        var Instance = this._getSelectorInstance(name);

        if (!Instance) {
            log.warn(name + " is not a current selector.");

            return
        }

        if ($.isFunction(Instance[method])) {

            return Instance[method](opts1, opts2);

        } else {
            log.error(name + " selector does not implement the mandatory " + method + "() fn");
        }

    };

    Filter.prototype._processSelector = function (obj, selectorId, groupId) {

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
        if (!Array.isArray(this.group2selectors[groupId])) {
            this.group2selectors[groupId] = [];
        }
        this.group2selectors[groupId].push(selectorId);

        //
        if (this.selector2group[selectorId]) {
            log.warn("Duplication of selector id for filter configuration: " + groupId);
        }
        this.selector2group[selectorId] = groupId;

    };

    Filter.prototype._getSelectorRender = function (name, callback) {

        return require([this._getSelectorScriptPath(name) + ".js"], callback);
    };

    Filter.prototype._getActiveSelectorByGroup = function (name) {

        var active = this.$el.find("[data-group='" + name + "']")
            .find(s.SELECTORS)
            .filter(".active")
            .data("selector");

        return active;
    };

    Filter.prototype._resolveSelectorName = function (name) {

        var selector;

        if (_.contains(this.groupToResolve, name)) {
            selector = this._getActiveSelectorByGroup(name);
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

    Filter.prototype._getGroupContainer = function (id) {

        var $cont = this.$el.find('[data-group="' + id + '"]'),
            conf = this.groups[id] || {};

        if ($cont.length === 0) {
            log.warn("Impossible to find group container: " + id);

            $cont = $("<div data-group='" + id + "' class='" + conf.className + "'></div>");

            if (this.direction === "append") {
                this.$el.append($cont);
            } else {
                this.$el.prepend($cont);
            }
        }

        if (conf.templateIsInitialized !== true) {
            conf.templateIsInitialized = true;
            $cont.append(this._createGroupContainer(id));
        }

        return $cont;
    };

    Filter.prototype._createGroupContainer = function (id) {
        log.info("Create container for group: " + id);

        var classNames = "",
            group = this.groups[id],
            conf = $.extend(true, {}, C.template, this.common.template),
            $html,
            model;

        if (group.semantic === true) {
            log.info("Group : [" + group.id + "] is a semantic group");

            _.each(group.selectors, _.bind(function (obj, name) {
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

            model = $.extend(true, {id: id}, conf, group, group.template, i18nLabels[this.lang.toLowerCase()]);

            _.each(model, function (value, key) {
                if (value === true) {
                    classNames = classNames.concat(key + " ");
                }
            });

            model.classNames = classNames;

            $html = $(templateSemanticGroup(model));

            //TODO active tab by conf
            $html.find("ul").children().first().addClass("active");
            $html.find(".tab-content").children().first().addClass("active");

        } else {
            log.info("Group : [" + group.id + "] is NOT a semantic group");

            _.each(group.selectors, _.bind(function (obj, name) {
                obj.id = name;
            }, this));

            model = $.extend(true, {id: id}, conf, group, group.template, i18nLabels[this.lang.toLowerCase()]);

            $html = $(templateGroup(model));

        }

        $html.find(s.REMOVE_BTN).on("click", _.bind(function () {
            amplify.publish(this._getEventName(EVT.SELECTOR_REMOVED), {id: id});
        }, this));


        return $html;
    };

    Filter.prototype._createSelectorContainer = function (id) {
        log.info("Create container for selector: " + id);

        var classNames = "",
            obj = this.selectors[id].template,
            conf = $.extend(true, {id: id}, i18nLabels[this.lang], C.template, this.common.template, obj),
            $html;

        _.each(conf, function (value, key) {
            if (value === true) {
                classNames = classNames.concat(key + " ");
            }
        });

        $html = $(templateSelector($.extend(true, {classNames: classNames}, conf)));

        $html.find(s.REMOVE_BTN).on("click", _.bind(function () {
            amplify.publish(this._getEventName(EVT.SELECTOR_REMOVED), {id: id});
        }, this));

        return $html.append();
    };

    Filter.prototype._disableSelectorAndSwitch = function (d) {

        this._getSelectorContainer(d).closest(s.SELECTORS).children().children().not(s.TEMPLATE_HEADER).addClass(this.disabledSelectorClassName);
        this._getSelectorContainer(d).closest(s.GROUPS).children().children().not(s.TEMPLATE_HEADER).addClass(this.disabledSelectorClassName);

        this._getSelectorContainer(d).closest(s.SELECTORS).find(s.SWITCH).prop('checked', false);
        this._getSelectorContainer(d).closest(s.GROUPS).find(s.SWITCH).prop('checked', false);

        this._callSelectorInstanceMethod(d, 'disable');

        amplify.publish(this._getEventName(EVT.SELECTOR_DISABLED), {value: false});
        amplify.publish(this._getEventName(EVT.SELECTOR_DISABLED.concat(d)), {value: false});

        if (this.ready === true) {
            this._trigger('change');
        }
    };

    Filter.prototype._enableSelectorAndSwitch = function (d) {

        this._getSelectorContainer(d).closest(s.SELECTORS).children().children().not(s.TEMPLATE_HEADER).removeClass(this.disabledSelectorClassName);
        this._getSelectorContainer(d).closest(s.GROUPS).children().children().not(s.TEMPLATE_HEADER).removeClass(this.disabledSelectorClassName);

        this._getSelectorContainer(d).closest(s.SELECTORS).find(s.SWITCH).prop('checked', true);
        this._getSelectorContainer(d).closest(s.GROUPS).find(s.SWITCH).prop('checked', true);

        this._callSelectorInstanceMethod(d, 'enable');

        amplify.publish(this._getEventName(EVT.SELECTOR_ENABLED), {value: false});
        amplify.publish(this._getEventName(EVT.SELECTOR_ENABLED.concat(d)), {value: false});

        amplify.publish(this._getEventName(EVT.SELECTOR_DISABLED), {value: true});
        amplify.publish(this._getEventName(EVT.SELECTOR_DISABLED.concat(d)), {value: true});

        if (this.ready === true) {
            this._trigger('change', {});
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
        amplify.unsubscribe(this._getEventName(EVT.SELECTOR_SELECT), this._onSelectorSelectorSelect);
        amplify.unsubscribe(this._getEventName(EVT.SELECTOR_DISABLED), this._updateSummary);
        amplify.unsubscribe(this._getEventName(EVT.SELECTOR_ENABLED), this._updateSummary);
        amplify.unsubscribe(this._getEventName(EVT.SELECTOR_REMOVED), this._onRemoveSelector);

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