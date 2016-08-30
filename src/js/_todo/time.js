if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    "jquery",
    "loglevel",
    'underscore',
    '../../config/errors',
    '../../config/events',
    '../../config/config',
    '../../nls/labels',
    '../../html/selectors/time.hbs',
    'amplify-pubsub',
    'eonasdan-bootstrap-datetimepicker'
], function ($, log, _, ERR, EVT, C, i18n, template, amplify, DatetimePicker) {

    'use strict';

    var defaultOptions = {}, s = {
        PICKER_CONTAINER: "[data-selector-time]"
    };

    function Time(o) {

        var self = this;

        $.extend(true, this, defaultOptions, o, {$el : $(o.el)});

        this._checkConfiguration(); //empty

        this._renderTemplate();

        this._initVariables();

        this._renderSelector();
        console.log(3)

        this._bindEventListeners();
        console.log(5)


        this.printDefaultSelection();
        console.log(6)

        //force async execution
        window.setTimeout(function () {
            console.log(7)

            self.status.ready = true;

            amplify.publish(self._getEventName(EVT.SELECTOR_READY), self);
            console.log(8)

        }, 0);

        return this;
    }

    /**
     * getValues method
     * Mandatory method
     */
    Time.prototype.getValues = function () {

        var date = this.$pickerEl.data('date'),
        //date = new Date(this.$pickerEl.data('date')).getTime(),
            result = {
                values: [],
                labels: {}
            };

        //add always from
        result.values.push(date);
        result.labels[date] = "Date";

        return result;
    };

    /**
     * Reset method
     * Mandatory method
     */
    Time.prototype.reset = function () {

        this.printDefaultSelection();

        log.info("Selector reset successfully");

    };

    /**
     * Disposition method
     * Mandatory method
     */
    Time.prototype.dispose = function () {

        this._dispose();

        log.info("Selector disposed successfully");
    };

    /**
     * Enable selector
     * Mandatory method
     */
    Time.prototype.enable = function () {

        this.status.disabled = false;

        this.$pickerEl.data("DateTimePicker").enable();

        log.info("Selector enabled : " + this.id);

    };

    /**
     * Disable selector
     * Mandatory method
     */
    Time.prototype.disable = function () {

        this.status.disabled = true;

        this.$pickerEl.data("DateTimePicker").disable();

        log.info("Selector disabled : " + this.id);

    };

    /**
     * Return Tree internal status
     * return {Object} status
     */
    Time.prototype.getStatus = function () {

        return this._getStatus();
    };

    /**
     * Print print selection
     * return {Object} status
     */
    Time.prototype.printDefaultSelection = function () {

        return this._printDefaultSelection();
    };

    /**
     * Unset the given value.
     * return {null}
     */
    Time.prototype.unsetValue = function (v) {
        log.info("Unset tree value: " + v);

        if (this.status.disabled !== true) {
            log.warn("Value will not be unset because of the selector configuration");
        } else {
            log.warn("Selector is disabled. Impossible to unset time value: " + v);
        }

    };

    /**
     * Resets the selected items to the given value.
     * return {null}
     */
    Time.prototype.setValue = function (v, silent) {
        log.info("Set input value: " + v);

        this.silentMode = silent;

        this.$pickerEl.data("DateTimePicker").date(new Date(v));
    };

    Time.prototype._checkConfiguration = function () {

    };

    Time.prototype._getStatus = function () {

        return this.status;
    };

    Time.prototype._renderTemplate = function () {

        var $el = this.$el.find(s.PICKER_CONTAINER);

        if ($el.length === 0) {

            log.info("Injecting template for: " + this.id);
            this.$el.append(template($.extend(true, {}, i18n[this.lang], this, this.selector)));
        }

    };

    Time.prototype._initVariables = function () {

        //Init status
        this.status = {};
        this.status.disabled = this.selector.disabled;

        this.values = [];

        this.$pickerEl = this.$el.find(s.PICKER_CONTAINER);

    };

    Time.prototype._renderSelector = function () {

        console.log("Prima")
        console.log($.fn.datetimepicker)
        console.log(DatetimePicker)

        console.log('---------------------------------')


        new DatetimePicker (
            $.extend(true, {
                el : this.$el.find(s.PICKER_CONTAINER).datetimepicker,
                icons: {
                    time: "icojam_time time-selector-icon",
                    date: "icojam_calendar_4 time-selector-icon",
                    up: "icojam_arrow_up time-selector-icon",
                    down: "icojam_arrow_down time-selector-icon"
                }
            }, /*here*/ this.selector.config) //add calculated properties
        );

        console.log("dopo")


    };

    Time.prototype._printDefaultSelection = function () {

        var config = this.selector,
            defaultValue = config.default || [];

        this.setValue(defaultValue);

    };

    Time.prototype._getEventName = function (evt) {
        return this.controller.id + evt;
    };

    Time.prototype._bindEventListeners = function () {

        var self = this;

        this.$pickerEl.on("dp.change", _.bind(function () {

            if (this.status.ready === true) {

                //workaround for silent change
                if (this.silentMode !== true) {
                    amplify.publish(self._getEventName(EVT.SELECTORS_ITEM_SELECT));
                }
                delete this.silentMode;

            }

        }, this));

    };

    Time.prototype._unbindEventListeners = function () {
        this.$pickerEl.off();
    };

    Time.prototype._dispose = function () {

        this._unbindEventListeners();

        this.$pickerEl.data("DateTimePicker").destroy();
    };

    // dependency handler

    Time.prototype._dep_ensure_unset = function (opts) {
        log.warn("_dep_ensure_unset method not implemented for time selector");
    };

    return Time;

});