define([
    'loglevel',
    'jquery',
    'underscore',
    '../../config/errors',
    '../../config/events',
    '../../config/config',
    '../../html/selector.hbs',
    '../../html/nls.hbs',
    '../../nls/labels',
    'amplify-pubsub',
    "fenix-ui-bridge",
    'q'
], function (log, $, _, ERR, EVT, C, templateSelector, templateNls, i18nLabels, amplify, Bridge, Q) {

    'use strict';

    var s = {
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

    function Selector(obj) {

        $.extend(true, this, C, {initial: obj || {}, $el: $(obj.el)});

        this._initVariables();

        this._render();

        return this;
    }

    /**
     * disposition
     * @return {Object}
     */
    Selector.prototype.dispose = function () {

        this._unbindEventListeners();

        _.each(this.selectors, _.bind(function (obj) {

            obj.instance.dispose()

        }, this));

        this.$el.remove();
    };

    /**
     * reset
     * @return {Object}
     */
    Selector.prototype.reset = function () {

        _.each(this.selectors, _.bind(function (obj) {

            obj.instance.reset()

        }, this));
    };

    /**
     * disposition
     * @return {Object}
     */
    Selector.prototype.getValues = function (format) {

        var result = {
            values: {},
            labels: {},
            valid: false
        }, v, values = {}, labels = {};

        if (this.nls) {

            if (!this.internalNls) {
                _.each(this.languages, _.bind(function (l) {

                    var selector = this.selectors[this.selectorId + "_" + l],
                        instance;

                    if (selector) {
                        instance = selector.instance;
                        v = instance.getValues(format);
                        values[l] = v.values;
                        labels[l] = v.labels;
                    } else {
                        log.warn(l + " skip language");
                    }

                }, this));
            }

            else {
                v = this.mainSelector.instance.getValues(format);
                values[this.lang.toUpperCase()] = v.values;
                labels[this.lang.toUpperCase()] = v.labels;
            }

        } else {

            v = this.mainSelector.instance.getValues(format);
            values = v.values;
            labels = v.labels;

        }

        result.values = values;
        result.labels = labels;

        return result;
    };

    /**
     * set srouces
     * @return {Object}
     */
    Selector.prototype.setSource = function (values) {

        if (this.nls) {

            if (Array.isArray(values)) {

                _.each(this.selectors, _.bind(function (selector) {
                    if (selector && typeof selector.instance === "object") {
                        selector.instance.setSource(values);
                    }
                }, this))
            }

            if (typeof values === "object") {
                _.each(values, _.bind(function (v, lang) {
                    var selector = this.selectors[this.selectorId + "_" + lang];

                    if (selector && typeof selector.instance === "object") {
                        selector.instance.setSource(v);
                    }
                }, this))
            }


        } else {

            if (Array.isArray(values)) {
                this.mainSelector.instance.setSource(values);
            }

            if (typeof values === "object" && _.contains(Object.keys(values), this.lang.toUpperCase())) {
                this.mainSelector.instance.setSource(values[this.lang.toUpperCase()]);

            }
        }
    };


    /**
     * set value
     * @return {Object}
     */
    Selector.prototype.setValue = function (values) {

        if (this.nls) {

            if (Array.isArray(values)) {

                _.each(this.selectors, _.bind(function (selector) {
                    if (selector && typeof selector.instance === "object") {
                        selector.instance.setValue(values);
                    }
                }, this))
            }

            if (typeof values === "object") {
                _.each(values, _.bind(function (v, lang) {
                    var selector = this.selectors[this.selectorId + "_" + lang];

                    if (selector && typeof selector.instance === "object") {
                        selector.instance.setValue(v);
                    }
                }, this))
            }


        } else {

            if (Array.isArray(values)) {
                this.mainSelector.instance.setValue(values);
            }

            if (typeof values === "object" && _.contains(Object.keys(values), this.lang.toUpperCase())) {
                this.mainSelector.instance.setValue(values[this.lang.toUpperCase()]);

            }
        }
    };


    /**
     * unset value
     * @return {Object}
     */
    Selector.prototype.unsetValue = function (values) {

        if (this.nls) {

            if (Array.isArray(values)) {

                _.each(this.selectors, _.bind(function (selector) {
                    if (selector && typeof selector.instance === "object") {
                        selector.instance.unsetValue(values);
                    }
                }, this))
            }

            if (typeof values === "object") {
                _.each(values, _.bind(function (v, lang) {
                    var selector = this.selectors[this.selectorId + "_" + lang];

                    if (selector && typeof selector.instance === "object") {
                        selector.instance.unsetValue(v);
                    }
                }, this))
            }


        } else {

            if (Array.isArray(values)) {
                this.mainSelector.instance.unsetValue(values);
            }

            if (typeof values === "object" && _.contains(Object.keys(values), this.lang.toUpperCase())) {
                this.mainSelector.instance.unsetValue(values[this.lang.toUpperCase()]);

            }
        }
    };

    /**
     * get Selector status
     * @return {Object}
     */
    Selector.prototype.getStatus = function () {

        return this.mainSelector.instance.getStatus();
    };


    /**
     * enable
     * @return {Object}
     */
    Selector.prototype.enable = function () {

        _.each(this.selectors, _.bind(function (obj) {
            obj.instance.enable()

        }, this));
    };

    /**
     * disable
     * @return {Object}
     */
    Selector.prototype.disable = function () {

        _.each(this.selectors, _.bind(function (obj) {
            obj.instance.disable()

        }, this));
    };


    Selector.prototype._render = function () {

        this.ready = false;

        this.selectorsReady = 0; //used for "ready" event

        var externalResource = {};

        if (this.cl) {
            externalResource.obj = this.cl;
        }

        if (this.enumeration) {
            externalResource.obj = this.enumeration;
            externalResource.type = "enumeration";
        }

        this._getExternalResource(externalResource.obj, externalResource.type).then(_.bind(function (rawCl) {

            this.data = rawCl;

            this._createSelectors();

            this._attach();

            this._attachNls();

            _.each(this.selectors, _.bind(function (obj) {
                this._renderSelector(obj)
            }, this));

            this._activateCurrentLang();

            this._bindEventListeners();

        }, this), _.bind(this._onGetExternalResourceError, this));

    };

    Selector.prototype._activateCurrentLang = function () {

        this.$el.find('[data-lang="' + this.lang.toUpperCase() + '"]').tab('show');

        log.info("Lang shown: " + this.lang);
    };

    Selector.prototype._createSelectors = function () {

        var result = {};

        if (this.nls && !this.internalNls) {

            _.each(this.languages, _.bind(function (l) {

                result[this.id + "_" + l] = {
                    id: this.id + "_" + l,
                    data: this.data,
                    controller: this.controller,
                    lang: this.lang,
                    template: this.template,
                    selector: this.selector
                };

            }, this));

        } else {

            result[this.id] = {
                id: this.id,
                data: this.data,
                controller: this.controller,
                lang: this.lang,
                template: this.template,
                selector: this.selector
            };
        }

        this.selectors = result;

        var key = Object.keys(this.selectors)[0];

        this.mainSelector = this.selectors[key];

        return result;
    };

    Selector.prototype._initVariables = function () {

        this.channels = {};

        this.selectorId = this.initial.selector.id;
        this.id = this.initial.id;
        this.controller = this.initial.controller;
        this.template = this.initial.template;
        this.selector = this.initial.selector;
        this.lang = this.initial.lang;
        this.cl = this.initial.cl;
        this.enumeration = this.initial.enumeration;
        this.plugins = this.initial.plugins;
        this.environment = this.initial.environment;
        this.cache = this.initial.cache;

        this.nls = !!this.initial.nls;
        this.internalNls = typeof this.initial.nls === "object" && this.initial.nls.gui === false;

        this.languages = this.nls ? this.initial.languages.map(function (l) {
            return l.toUpperCase();
        }) : [this.lang];

        this.cache_db = {};

        this.bridge = new Bridge({
            environment: this.environment,
            cache: this.cache
        });
    };

    Selector.prototype._renderSelector = function (obj) {

        var Selector = this._getSelector(),
            model = $.extend({
                el: this._getSelectorContainer(obj.id)
            }, obj);

        this.selectors[obj.id].instance = new Selector(model);

        this.selectors[obj.id].instance.on("ready", _.bind(this._onSelectorReady, this));

    };

    Selector.prototype._onSelectorReady = function () {

        this.selectorsReady++;

        if (this.selectorsReady === Object.keys(this.selectors).length) {

            log.info("All selectors are ready");

            this._onReady();
        }
    };

    Selector.prototype._onReady = function () {
        this._trigger("ready", {id: this.id});
        log.info("Selector is ready: " + this.id);
    };

    Selector.prototype._getSelector = function () {

        return this.plugins[this.selectorId];
    };

    Selector.prototype._attach = function () {

        this.$el = this._getSelectorContainer(this.id);

        return this.$el;
    };

    Selector.prototype._getSelectorContainer = function (id) {

        var $cont = this.$el.find('[data-selector="' + id + '"]'),
            conf = this;

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

    Selector.prototype._createSelectorContainer = function (id) {
        log.info("Create container for selector: " + id);

        var classNames = this.initial.className || "",
            obj = this.template,
            conf = $.extend(true, {id: id}, i18nLabels[this.lang], obj),
            $html;

        _.each(conf, function (value, key) {
            if (value === true) {
                classNames = classNames.concat(" " + key);
            }
        });

        $html = $(templateSelector($.extend(true, {classNames: classNames}, conf)));

        return $html.append();
    };

    Selector.prototype._attachNls = function () {

        var model = {
            nls: this.nls,
            selector: this.id,
            lang: this.lang,
            languages: this.languages,
            id: this.controller.id,
            internalNls: this.internalNls
        };

        this.$el.append(templateNls(model));
    };

    Selector.prototype._unbindEventListeners = function () {

        this.$el.find(s.SWITCH).off();

        this.$el.find(s.REMOVE_BTN).off();
    };

    Selector.prototype._bindEventListeners = function () {

        this.$el.find(s.SWITCH).on("click", _.bind(this._onSwitchClick, this));

        this.$el.find(s.REMOVE_BTN).on("click", _.bind(this._onRemoveClick, this));
    };

    Selector.prototype._onSwitchClick = function (e) {

        var checked = $(e.target).is(":checked");

        if (!!checked) {
            this.enable();
        }else {
            this.disable();
        }

    };

    Selector.prototype._onRemoveClick = function () {

        amplify.publish(this._getEventName(EVT.SELECTOR_REMOVED), {id: this.id});
    };

    Selector.prototype._getEventName = function (evt) {
        return this.controller.id + evt;
    };

    // Preload scripts and external resources

    Selector.prototype._getExternalResource = function (obj, type) {

        if (!obj) {
            log.info("No external resource needed");
            return Q.Promise(function (resolve) {
                resolve();
            });
        }

        //Check if codelist is cached otherwise query
        var stored = this._getStoredCodelist(obj);

        if (stored === undefined || stored.length < 2) {

            log.info(this._getCodelistCacheKey(obj) + " not in session storage.");

            return this._createPromise(obj, type);

        } else {

            log.info(this._getCodelistCacheKey(obj) + " read from session storage.");

            return Q.Promise(function (resolve) {
                resolve(stored);
            });
        }
    };

    Selector.prototype._onGetExternalResourceError = function (e) {
        log.error("Resources load: error");
        log.error(e)
    };

    Selector.prototype._createPromise = function (obj, type) {

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
                    title[self.lang.toUpperCase()] = "EMPTY_CODE_LIST :'(";

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

    Selector.prototype._storeCodelist = function (obj, cl) {

        this.cache_db[this._getCodelistCacheKey(obj)] = cl;

        return this.cache_db[this._getCodelistCacheKey(obj)];
    };

    Selector.prototype._getStoredCodelist = function (obj) {

        return this.cache_db[this._getCodelistCacheKey(obj)];
    };

    Selector.prototype._getCodelistCacheKey = function (o) {

        var obj = typeof o === 'object' ? o : {},
            key = "_",
            keys = Object.keys(obj).sort();

        for (var i = 0; i < keys.length; i++) {
            key += "_" + keys[i] + ":" + obj[keys[i]];
        }

        return key;
    };

    Selector.prototype._getPromise = function (body, type) {

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

    //pub/sub

    /**
     * pub/sub
     * @return {Object} component instance
     */
    Selector.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});
        return this;
    };

    Selector.prototype._trigger = function (channel) {

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

    return Selector;

});