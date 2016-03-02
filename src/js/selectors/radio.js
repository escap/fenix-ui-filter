/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    'underscore',
    'fx-filter/config/errors',
    'fx-filter/config/events',
    'fx-filter/config/config',
    'fx-filter/config/config-default',
    "amplify"
], function ($, log, _, ERR, EVT, C, CD) {

    'use strict';

    var defaultOptions = {},
        s = {
            RADIO: "input[type='radio']",
            CHECKED: "input[type='radio']:checked"
        };

    function Radio(o) {

        $.extend(true, this, defaultOptions, o);

        this.$radios = this.$el.find(s.RADIO);

        this._renderTemplate();

        this._initVariables();

        this._renderRadio();

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

        log.info("Selector enabled : " + this.id);

    };

    /**
     * Disable selector
     * Mandatory method
     */
    Radio.prototype.disable = function () {

        this.$radios.attr('disabled',true);

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

    Radio.prototype._getStatus = function () {

        return this.status;
    };

    Radio.prototype._renderTemplate = function () {


    };

    Radio.prototype._initVariables = function () {

        this.status = {};
    };

    Radio.prototype._renderRadio = function () {

        this._bindEventListeners();

        this.printDefaultSelection();

        amplify.publish(this._getEventName(EVT.SELECTOR_READY), this);

    };

    Radio.prototype._printDefaultSelection = function () {

        var config = this.selector,
            defaultValue = config.default || [];

        this.$radios.filter("[value='" + defaultValue[0] + "']").prop("checked", true).trigger("change");

    };

    Radio.prototype._getEventName = function(evt){
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

            amplify.publish(self._getEventName(EVT.SELECTORS_ITEM_SELECT + '.' + self.id), {
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

    return Radio;

});