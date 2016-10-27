define([
    'loglevel',
    'jquery',
    'underscore',
    '../../config/errors',
    '../../config/events',
    '../../config/config',
    '../../html/group.hbs',
    '../../nls/labels',
    './selector',
    'amplify-pubsub'
], function (log, $, _, ERR, EVT, C, template, i18nLabels, Selector, amplify) {

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
        ADD_BTN: "[data-role='add']",
        TEMPLATE_HEADER: "[data-selector-header]"
    };

    Group.prototype._initVariables = function () {

        this.channels = {};

        this.id = this.initial.id;
        this.controller = this.initial.controller;
        this.template = this.initial.template;
        this.lang = this.initial.lang;

        this.environment = this.initial.environment;
        this.cache = this.initial.cache;
        this.plugins = this.initial.plugins;

        this.groups = {};
        this.selectors = {};
        this._selectors = this.initial.selectors;
        var key = Object.keys(this._selectors)[0];
        this.mainSelector = this._selectors[key];

        this.incremental = this.initial.incremental;

        this.className = this.initial.className;

        this.amount = 0;

    };

    function Group(obj) {

        $.extend(true, this, C, {initial: obj || {}, $el: $(obj.el)});

        this._initVariables();

        this._attach();

        this._render();

        return this;
    }

    /**
     * disposition
     * @return {Object}
     */
    Group.prototype.dispose = function () {

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
    Group.prototype.reset = function () {

        _.each(this.selectors, _.bind(function (obj) {

            obj.instance.reset()

        }, this));
    };

    /**
     * disposition
     * @return {Object}
     */
    Group.prototype.getValues = function (format) {

        var result = {
            values: {},
            labels: {},
            valid: false
        }, v, values = {}, labels = {};

        if (Object.keys(this.groups).length === 1) {

            var key = Object.keys(this.groups)[0];

            _.each(this.groups[key], _.bind(function (selector, key) {

                var instance = selector.instance;

                if (instance) {
                    v = instance.getValues(format);
                    values[key] = v.values;
                    labels[key] = v.labels;

                } else {
                    log.warn(key + " skip language");
                }

            }, this));

        }

        result.values = values;
        result.labels = labels;

        return result;
    };

    /**
     * set srouces
     * @return {Object}
     */
    Group.prototype.setSource = function (values) {



        _.each(this.selectors, _.bind(function (obj) {

            obj.instance.setSource(values)

        }, this));

    };


    /**
     * set value
     * @return {Object}
     */
    Group.prototype.setValue = function (values) {
        console.log("TODO")

        _.each(this.selectors, _.bind(function (obj) {

            obj.instance.setValue(values)

        }, this));

    };

    /**
     * unset value
     * @return {Object}
     */
    Group.prototype.unsetValue = function (values) {

        console.log("TODO")

        _.each(this.selectors, _.bind(function (obj) {

            obj.instance.unsetValue(values)

        }, this));


    };

    /**
     * get Group status
     * @return {Object}
     */
    Group.prototype.getStatus = function () {

        return this.mainSelector.instance.getStatus();
    };

    Group.prototype._attach = function () {

        var classNames = this.initial.className || "",
            obj = this.template,
            conf = $.extend(true, {id: this.id}, i18nLabels[this.lang], obj);

        _.each(conf, function (value, key) {
            if (value === true) {
                classNames = classNames.concat(" " + key);
            }
        });

        var model = $.extend(true, {
                classNames: classNames,
                id: this.id,
                template: this.template,
                incremental: this.incremental
            }, this.template, i18nLabels[this.lang.toLowerCase()]),
            $el = $(template(model));

        this.$el.append($el);

        this.$el = $el;

    };

    Group.prototype._render = function () {

        this.ready = false;

        this.selectorsReady = 0; //used for "ready" event

        this._addGroup();

    };

    Group.prototype._addGroup = function() {

        this.amount++;
        this.groups["group_" + this.amount] = {};

        _.each(this._selectors, _.bind(function (obj) {

            var model = $.extend(true, {
                id: obj.id,
                controller: this.controller,
                lang: this.lang,
                languages: this.languages,
                plugins: this.plugins,
                el: this.$el,
                cache: this.cache,
                environment: this.environment,
                template: {
                    hideRemoveButton : true,
                    hideSwitch : true
                }
            }, obj);

            obj.instance = new Selector(model);

            obj.instance.on("ready", _.bind(this._onSelectorReady, this));

            this.groups["group_" + this.amount][obj.id] = obj;

        }, this))

    };

    Group.prototype._onSelectorReady = function () {

        this.selectorsReady++;

        if (this.selectorsReady === Object.keys(this._selectors).length) {

            log.info("All selectors are ready");

            this._onReady();
        }
    };

    Group.prototype._onReady = function () {

        this._bindEventListeners();

        this._trigger("ready", {id: this.id});

        log.info("Group is ready: " + this.id);
    };

    Group.prototype._unbindEventListeners = function () {

        this.$el.find(s.SWITCH).off();

        this.$el.find(s.REMOVE_BTN).off();

        this.$el.find(s.ADD_BTN).off();

    };

    Group.prototype._bindEventListeners = function () {

        this.$el.find(s.SWITCH).on("click", _.bind(this._onSwitchClick, this));

        this.$el.find(s.REMOVE_BTN).on("click", _.bind(this._onRemoveClick, this));

        this.$el.find(s.ADD_BTN).on("click", _.bind(this._onAddClick, this));
    };

    Group.prototype._onSwitchClick = function (e) {

        var checked = $(e.target).is(":checked");

        _.each(this.groups, _.bind(function (group) {

            _.each(group, _.bind(function (selector) {

                if (checked === true) {
                    selector.instance.enable()
                } else {
                    selector.instance.disable()
                }

            }, this));

        }, this));

    };

    Group.prototype._onRemoveClick = function () {
        amplify.publish(this._getEventName(EVT.SELECTOR_REMOVED), {id: this.id});
    };

    Group.prototype._onAddClick = function () {
       this._addGroup();
    };

    Group.prototype._getEventName = function (evt) {
        return this.controller.id + evt;
    };

    //pub/sub

    /**
     * pub/sub
     * @return {Object} component instance
     */
    Group.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});
        return this;
    };

    Group.prototype._trigger = function (channel) {

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

    return Group;

});