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

        var self = this;

        $.extend(true, this, defaultOptions, o);

        this._renderTemplate();

        this._initVariables();

        this._renderDropdown();

        this._bindEventListeners();

        //force async execution
        window.setTimeout(function () {
            self.status.ready = true;
            amplify.publish(self._getEventName(EVT.SELECTOR_READY), self);

        }, 0);

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
            sel = sel.split(",");
        }

        _.each(sel, function (s) {

            result.values.push(s);

            //result.labels[s] = instance.getItem(s)[0].innerHTML.toString();
            result.labels[s] = $(instance.getItem(s)[0]).contents().get(0).nodeValue;

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

        this.status.disabled = false;

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

        this.status.disabled = true;

        log.info("Selector disabled : " + this.id);

    };

    /**
     * Return Tree internal status
     * return {Object} status
     */
    Dropdown.prototype.getStatus = function () {

        return this._getStatus();
    };

    /**
     * Unset the given value
     * return {null}
     */
    Dropdown.prototype.unsetValue = function (v) {

        var value = v.toString();

        if (this.status.disabled !== true) {
            log.info("Unset dropdown value: " + v);

            //selectize doesn't have the unsetValue method
            //get current selection and remove 'value'
            var instance = this.dropdown[0].selectize,
                values = instance.getValue();

            if (!Array.isArray(values)) {
                values = values.split(",");
            }

            values = _.without(values, value);

            instance.setValue(values);
        } else {
            log.warn("Selector is disabled. Impossible to unset dropdown value: " + v);
        }

    };

    /**
     * Resets the selected items to the given value.
     * return {null}
     */
    Dropdown.prototype.setValue = function (v, silent) {
        log.info("Set dropdown value: " + JSON.stringify(v) + ". Silent? " + silent);
        var instance = this.dropdown[0].selectize;
        instance.setValue(v, silent);
    };

    Dropdown.prototype._getStatus = function () {

        return this.status;
    };

    Dropdown.prototype._renderTemplate = function () {

        this.$el.append($("<div data-role='dropdown'></div>"));
    };

    Dropdown.prototype._initVariables = function () {

        //Init status
        this.status = {};
        this.status.disabled = this.selector.disabled;

        this.$dropdownEl = this.$el.find(s.DROPDOWN_CONTAINER);
    };

    Dropdown.prototype._buildDropdownModel = function (fxResource) {

        var data = this._buildDropdownModelFromCodelist(fxResource) || [];

        //Merge static static data
        if (this.selector.source) {

            var staticData = this.selector.source;

            if (!Array.isArray(staticData)) {
                log.error(ERR.INVALID_DATA);

            } else {

                var convertedData = staticData.map(function (i) {
                    return {value: i.value, text: i.label, parent: '#'};
                });
                data = _.uniq(_.union(data, convertedData), false, function (item) {
                    return item.value;
                });

            }
        }

        return data;
    };


    Dropdown.prototype._buildDropdownModelFromCodelist = function (fxResource, parent, cl) {

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
                    data = _.union(data, this._buildDropdownModelFromCodelist(item.children, item.code, cl));
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

        var config = $.extend(true, {}, this.selector),
            $container = this.$dropdownEl,
            selectize = $.extend(true, {}, config.config),
            dropdown,
            data,
            opt;

        data = this._buildDropdownModel(this.data);

        opt = $.extend(true, {}, selectize, {
            options: data
        });

        for (var i = config.to; i >= config.from; i--) {
            data.push({id: i.toString(), text: i.toString()});
        }

        opt.options = data;

        dropdown = $container.selectize(opt);

        //cache data
        this.dropdownData = data;

        this.dropdown = dropdown;

        this.printDefaultSelection();

    };

    Dropdown.prototype.printDefaultSelection = function () {

        return this._printDefaultSelection();
    };

    Dropdown.prototype._printDefaultSelection = function () {

        var config = this.selector,
            instance = this.dropdown[0].selectize;

        if(config.default) {
            //print default values
            instance.setValue(config.default);
        }

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

            if (self.status.ready === true) {

                var data = self.getValues() || {},
                    values = data.values || [],
                    labels = data.labels || {},
                    result = [];

                _.each(values, function (s) {
                    result.push({
                        id:self.id,
                        value: s,
                        label: labels[s],
                        parent: "#"
                    });
                });

                amplify.publish(self._getEventName(EVT.SELECTORS_ITEM_SELECT + self.id), result);
                amplify.publish(self._getEventName(EVT.SELECTORS_ITEM_SELECT));
            }

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

        var codes = opts.data.length > 0 ? opts.data : [{value: this.selector.from || 0}],
            from = codes[0].value,
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

        if (v) {
            instance.setValue(v.toString());
        }

    };

    return Dropdown;

});