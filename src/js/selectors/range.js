/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    'underscore',
    'fx-filter/config/errors',
    'fx-filter/config/events',
    'fx-filter/config/config',
    'fx-filter/config/config-default',
    "ion.rangeSlider",
    "amplify"
], function ($, log, _, ERR, EVT, C, CD) {

    'use strict';

    var defaultOptions = {
        };

    function Range(o) {

        var self = this;

        $.extend(true, this, defaultOptions, o);

        this._checkConfiguration(); //empty

        this._renderTemplate();

        this._initVariables();

        this._renderSelector();

        //this._bindEventListeners();

        this.printDefaultSelection();

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
    Range.prototype.getValues = function () {

        var slider = this.$rangeContainer.data("ionRangeSlider"),
            values = slider.result,
            result = {
                values: [],
                labels: {}
            };

        //add always from
        result.values.push(values.from);
        result.labels[values.from] = "From";

        //add to is double slider
        if (this.selector.config.type === "double") {
            result.values.push(values.to);
            result.labels[values.to] = "To";
        }

        return result;
    };

    /**
     * Reset method
     * Mandatory method
     */
    Range.prototype.reset = function () {

        this.printDefaultSelection();

        log.info("Selector reset successfully");

    };

    /**
     * Disposition method
     * Mandatory method
     */
    Range.prototype.dispose = function () {

        this._dispose();

        log.info("Selector disposed successfully");
    };

    /**
     * Enable selector
     * Mandatory method
     */
    Range.prototype.enable = function () {

        this.status.disabled = false;

        var slider = this.$rangeContainer.data("ionRangeSlider");
        slider.update({
            disable: false
        });

        log.info("Selector enabled : " + this.id);

    };

    /**
     * Disable selector
     * Mandatory method
     */
    Range.prototype.disable = function () {

        this.status.disabled = true;

        var slider = this.$rangeContainer.data("ionRangeSlider");
        slider.update( {
            disable: true
        });

        log.info("Selector disabled : " + this.id);

    };

    /**
     * Return Tree internal status
     * return {Object} status
     */
    Range.prototype.getStatus = function () {

        return this._getStatus();
    };

    /**
     * Print print selection
     * return {Object} status
     */
    Range.prototype.printDefaultSelection = function () {

        return this._printDefaultSelection();
    };

    /**
     * Unset the given value.
     * return {null}
     */
    Range.prototype.unsetValue = function (v) {
        log.info("Unset tree value: " + v);

        if (this.status.disabled !== true) {
            log.warn("Value will not be unset because of the selector configuration");
        } else {
            log.warn("Selector is disabled. Impossible to unset range value: " + v);
        }

    };

    /**
     * Resets the selected items to the given value.
     * return {null}
     */
    Range.prototype.setValue = function (v) {
        log.info("Set input value: " + v);

        // Saving it's instance to var
        var slider = this.$rangeContainer.data("ionRangeSlider");

        // UPDATE - updates slider to any new values
        slider.update({
            from: v[0]
        });

    };

    Range.prototype._checkConfiguration = function () {

    };

    Range.prototype._getStatus = function () {

        return this.status;
    };

    Range.prototype._renderTemplate = function () {

        var $container = $('<input data-selector-range type="text" name="example_name" value="" />');

        this.$el.append($container);

    };

    Range.prototype._initVariables = function () {

        //Init status
        this.status = {};
        this.status.disabled = this.selector.disabled;

        this.values = [];

        this.$rangeContainer = this.$el.find("[data-selector-range]");

    };

    Range.prototype._renderSelector = function () {

        var self = this;

        this.$rangeContainer.ionRangeSlider($.extend(true, {}, {
            type: "single",
            min: 0,
            max: 100,
            from: 50,
            keyboard: false,
            onStart: function (data) {
                //log.info("onStart");
            },
            onChange: function (data) {
                //amplify.publish(self._getEventName(EVT.SELECTORS_ITEM_SELECT + this.id), data); //format payload
                amplify.publish(self._getEventName(EVT.SELECTORS_ITEM_SELECT));
            },
            onFinish: function (data) { },
            onUpdate: function (data) {
                amplify.publish(self._getEventName(EVT.SELECTORS_ITEM_SELECT));
            }
        },  this.selector.config));

    };

    Range.prototype._printDefaultSelection = function () {

        var config = this.selector,
            defaultValue = config.default || [];

        this.setValue(defaultValue);

    };

    Range.prototype._getEventName = function (evt) {
        return this.controller.id + evt;
    };

    Range.prototype._bindEventListeners = function () {

    };

    Range.prototype._unbindEventListeners = function () {

    };

    Range.prototype._dispose = function () {

        this._unbindEventListeners();

        this.$rangeContainer.data("ionRangeSlider").destroy();
    };

    // dependency handler

    Range.prototype._dep_ensure_unset = function (opts) {
        log.warn("_dep_ensure_unset method not implemented for range selector");
    };

    return Range;

});