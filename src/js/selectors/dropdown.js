/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    'underscore',
    'fx-filter/config/errors',
    'fx-filter/config/events',
    'fx-filter/config/config',
    'fx-filter/config/config-default',
    'amplify',
    'selectize'
], function ($, log, _, ERR, EVT, C, CD) {

    'use strict';

    var defaultOptions = {},
        s = {
            DROPDOWN_CONTAINER: "[data-role='dropdown']"
        };

    function Dropdown(o) {

        $.extend(true, this, defaultOptions, o);

        this.status = {};

        this._renderTemplate();

        this._initVariables();

        this._renderDropdown();

        this._bindEventListeners();

        return this;
    }

    /**
     * getValues method
     * Mandatory method
     */
    Dropdown.prototype.getValues = function () {

        var result = {values: [], labels: {}},
            instance = this.dropdown[0].selectize,
            sel = instance.getValue() || [];

        if (!Array.isArray(sel)) {
            sel = [sel];
        }

        _.each(sel, function (s) {

            result.values.push(s);

            result.labels = {};

            result.labels[s] = instance.getItem(instance.getValue())[0].innerHTML.toString();

        });

        return result;

    };

    /**
     * Disposition method
     * Mandatory method
     */
    Dropdown.prototype.dispose = function () {

        this._dispose();

        log.info("Selector disposed successfully");

    };

    /**
     * Reset method
     * Mandatory method
     */
    Dropdown.prototype.reset = function () {

        this.printDefaultSelection();

        log.info("Selector reset successfully");

    };

    /**
     * Enable selector
     * Mandatory method
     */
    Dropdown.prototype.enable = function () {

        var instance = this.dropdown[0].selectize;

        //print default values
        instance.enable();

        log.info("Selector enabled : " + this.id);
    };

    /**
     * Disable selector
     * Mandatory method
     */
    Dropdown.prototype.disable = function () {

        var instance = this.dropdown[0].selectize;

        //print default values
        instance.disable();

        log.info("Selector disabled : " + this.id);

    };

    /**
     * Return Tree internal status
     * return {Object} status
     */
    Dropdown.prototype.getStatus = function () {

        return this._getStatus();
    };

    Dropdown.prototype._getStatus = function () {

        return this.status;
    };

    Dropdown.prototype._renderTemplate = function () {

        this.$el.append($("<div data-role='dropdown'></div>"));
    };

    Dropdown.prototype._initVariables = function () {

        this.$dropdownEl = this.$el.find(s.DROPDOWN_CONTAINER);
    };

    Dropdown.prototype._buildDropdownModel = function (fxResource, parent, cl) {

        var data = [],
            selector = this,
            selectorConfig = selector.selector || {},
            blacklist = selectorConfig.blacklist || [],
            bl = blacklist.map(function (item) {
                return item.toString()
            });

        _.each(fxResource, _.bind(function (item) {

            if (!_.contains(bl, item.code.toString())) {

                data.push({
                    value: item.code,
                    text: item.title["EN"],
                    parent: parent || '#'
                });

                if (Array.isArray(item.children) && item.children.length > 0) {
                    data = _.union(data, this._buildTreeModel(item.children, item.code, cl));
                }

            } else {

                log.warn("code [" + item.code + "] excluded from " + cl);
            }

        }, this));

        //order alphabetically
        data = data.sort(function (a, b) {
            if (a.text < b.text) return -1;
            if (a.text > b.text) return 1;
            return 0;
        });

        return data;
    };

    Dropdown.prototype._renderDropdown = function () {

        var config = this.selector,
            $container = this.$dropdownEl,
            selectize = $.extend(true, {}, config.config),
            dropdown,
            data,
            opt;

        switch (config.source.toLowerCase()) {
            case "codelist":

                data = this._buildDropdownModel(this.data);

                opt = $.extend(true, {}, selectize, {
                    options: data
                });

                dropdown = $container.selectize(opt);

                break;

            default :

                data = [];

                opt = $.extend(true, {}, selectize, {
                    options: data
                });

                for (var i = config.from; i <= config.to; i++) {
                    data.push({value: i.toString(), text: i.toString()});
                }

                opt.options = data;

                dropdown = $container.selectize(opt);
        }

        //cache data
        this.dropdownData = data;

        this.dropdown = dropdown;

        this.printDefaultSelection();

        amplify.publish(this._getEventName(EVT.SELECTOR_READY), this);

    };

    Dropdown.prototype.printDefaultSelection = function () {

        return this._printDefaultSelection();
    };

    Dropdown.prototype._printDefaultSelection = function () {

        var config = this.selector,
            instance = this.dropdown[0].selectize,
            id = config.default ? config.default : this.dropdownData[0].value;

        //print default values
        instance.setValue(id);

    };

    Dropdown.prototype._destroyDropdown = function () {

        var instance = this.dropdown[0].selectize;

        //print default values
        instance.destroy();

        log.info("Destroyed dropdown: " + this.id);
    };

    Dropdown.prototype._bindEventListeners = function () {

        var self = this;

        this.dropdown.on('change', function () {

            var data = self.getValues() || {},
                values = data.values || [],
                labels = data.labels || {},
                result = [];

            _.each(values, function (s) {
                result.push({
                    code: s,
                    label: labels[s],
                    parent: "#"
                });
            });

            amplify.publish(self._getEventName(EVT.SELECTORS_ITEM_SELECT + '.' + self.id), result);
            amplify.publish(self._getEventName(EVT.SELECTORS_ITEM_SELECT));
        });

    };

    Dropdown.prototype._unbindEventListeners = function () {
        this.dropdown.off();
    };

    Dropdown.prototype._dispose = function () {

        this._unbindEventListeners();

        this._destroyDropdown();

    };

    Dropdown.prototype._getEventName = function (evt) {
        return this.controller.id + evt;
    };

    // dependency handler

    Dropdown.prototype._dep_min = function (opts) {

        var codes = opts.data,
            from = codes[0].code,
            originalValue = this.getValues().values[0],
            data = [],
            instance = this.dropdown[0].selectize;

        if (!this.selector.to) {
            log.error("Currently the '_dep_min' is implemented only for dropdown with static model [from/to]");
            return;
        }

        for (var i = from; i <= this.selector.to; i++) {
            data.push({
                value: i,
                text: i.toString()
            })
        }

        //add new values to dropdown
        instance.clearOptions();
        instance.addOption(data);

        //Set selected value
        var v = from > originalValue ? from : originalValue;

        instance.setValue(v.toString());

    };

    return Dropdown;

});