/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    'underscore',
    'text!fx-filter/html/selectors/radio.hbs',
    'fx-filter/config/errors',
    'fx-filter/config/events',
    'fx-filter/config/config',
    'fx-filter/config/config-default',
    'handlebars',
    "amplify"
], function ($, log, _, templates, ERR, EVT, C, CD, Handlebars) {

    'use strict';

    var defaultOptions = {},
        s = {
            RADIO: "input[type='radio']",
            CHECKED: "input[type='radio']:checked",
            TEMPLATE_LIST: "[data-radio-list]",
            TEMPLATE_ITEM: "[data-radio-item]"
        };

    function Radio(o) {

        var self = this;

        $.extend(true, this, defaultOptions, o);

        this._renderTemplate();

        this._renderRadio();

        this._initVariables();

        this._bindEventListeners();

        this.printDefaultSelection();

        //force async execution
        window.setTimeout(function () {
            amplify.publish(self._getEventName(EVT.SELECTOR_READY), self);
        }, 0);

        return this;
    }

    /**
     * getValues method
     * Mandatory method
     */
    Radio.prototype.getValues = function () {

        var $checked = this.$radios.filter(s.CHECKED),
            val = $checked.val(),
            result = {
                values: [val],
                labels: {}
            };

        result.labels[val] = $checked.siblings("label").text();

        return result;

    };

    /**
     * Reset method
     * Mandatory method
     */
    Radio.prototype.reset = function () {

        this.printDefaultSelection();

        log.info("Selector reset successfully");

    };

    /**
     * Disposition method
     * Mandatory method
     */
    Radio.prototype.dispose = function () {

        this._dispose();

        log.info("Selector disposed successfully");

    };

    /**
     * Enable selector
     * Mandatory method
     */
    Radio.prototype.enable = function () {

        this.$radios.attr('disabled', false);

        this.status.disabled = false;

        log.info("Selector enabled : " + this.id);

    };

    /**
     * Disable selector
     * Mandatory method
     */
    Radio.prototype.disable = function () {

        this.$radios.attr('disabled', true);

        this.status.disabled = true;

        log.info("Selector disabled : " + this.id);

    };

    /**
     * Return Tree internal status
     * return {Object} status
     */
    Radio.prototype.getStatus = function () {

        return this._getStatus();
    };

    /**
     * Print print selection
     * return {Object} status
     */
    Radio.prototype.printDefaultSelection = function () {

        return this._printDefaultSelection();
    };

    /**
     * Unset the given value.
     * return {null}
     */
    Radio.prototype.unsetValue = function (v) {
        log.info("Unset tree value: " + v);

        if (this.status.disabled !== true ) {
            log.warn("Value will not be unset because of the selector configuration");
        } else {
            log.warn("Selector is disabled. Impossible to unset tree value: " + v);
        }

    };

    /**
     * Resets the selected items to the given value.
     * return {null}
     */
    Radio.prototype.setValue = function (v) {
        log.info("Set radio value: " + v);

        this.$radios.filter("[value='" + v + "']").prop('checked', true).trigger("change")

    };

    Radio.prototype._getStatus = function () {

        return this.status;
    };

    Radio.prototype._renderTemplate = function () {

    };

    Radio.prototype._initVariables = function () {

        var self =this;

        //Init status
        this.status = {};
        this.status.disabled = this.selector.disabled;

        this.$radios = this.$el.find(s.RADIO);

        this.$radios.attr("name", this.id);

        this.values = [];

        this.$radios.each(function (){
            self.values.push($(this).attr("value"));
        });

    };

    Radio.prototype._renderRadio = function () {

        this._createRadios();

    };

    Radio.prototype._createRadios = function () {

        var data = this.selector.source || [],
            $list = this.$el.addBack().find(s.TEMPLATE_LIST),
            item = $(templates).find(s.TEMPLATE_ITEM)[0].outerHTML,
            list;

        if ($list.length === 0) {
            log.info("Injecting radio list");
            list = $(templates).find(s.TEMPLATE_LIST)[0].outerHTML;
            $list = $(list);
            this.$el.append($list);
        }

        _.each(data, _.bind(function (model) {

            window.fx_filter_radio_id >= 0 ? window.fx_filter_radio_id++ : window.fx_filter_radio_id = 0;

            var tmpl = Handlebars.compile(item),
                m = $.extend(true, model, {
                    name: this.id,
                    id: "fx_radio_" + window.fx_filter_radio_id
                });


            log.info("Create radio item: " + JSON.stringify(m));

            $list.append(tmpl(m));
        }, this));

    };

    Radio.prototype._printDefaultSelection = function () {

        var config = this.selector,
            defaultValue = config.default || [];

        this.setValue(defaultValue);

    };

    Radio.prototype._getEventName = function (evt) {
        return this.controller.id + evt;
    };

    Radio.prototype._destroyRadio = function () {

        log.info("Destroyed radio: " + this.id);
    };

    Radio.prototype._bindEventListeners = function () {

        var self = this;

        this.$radios.on('change', function () {

            var r = self.getValues(),
                code = r.values[0] || "",
                label = r.labels[code];

            amplify.publish(self._getEventName(EVT.SELECTORS_ITEM_SELECT + self.id), {
                code: code,
                label: label,
                parent: null
            });

            amplify.publish(self._getEventName(EVT.SELECTORS_ITEM_SELECT));
        });

    };

    Radio.prototype._unbindEventListeners = function () {
        this.$radios.off();
    };

    Radio.prototype._dispose = function () {

        this._unbindEventListeners();

        this._destroyRadio();

    };

    // dependency handler

    Radio.prototype._dep_ensure_unset = function (opts) {

        var disabled = opts.value,
            enabled = opts.enabled,
            currentValue = this.getValues().values[0],
            candidate;

        if (disabled == currentValue) {

            for (var i = 0; i < enabled.length; i++) {
                if (_.contains(this.values, enabled[i])) {
                    candidate = enabled[i];
                    break;
                }
            }

            if (!candidate) {
                this.printDefaultSelection();
            } else {
                this.setValue(candidate);
            }

        }
    };

    return Radio;

});