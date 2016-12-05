/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    'underscore',
    'text!fx-filter/html/selectors/input.hbs',
    'fx-filter/config/errors',
    'fx-filter/config/events',
    'fx-filter/config/config',
    'handlebars',
    "amplify"
], function ($, log, _, templates, ERR, EVT, C, Handlebars) {

    'use strict';

    var defaultOptions = {
            checkableInputs: ["radio", "checkbox"]
        },
        s = {
            TEMPLATE_LIST: "[data-input-list]",
            TEMPLATE_ITEM: "[data-input-item]",
            TEMPLATE_LIST_CONTAINER: "[data-input-list-container]"
        };

    function Input(o) {

        var self = this;

        $.extend(true, this, defaultOptions, o, {$el : $(o.el)});

        this._checkConfiguration();

        this._renderTemplate();

        this._renderInput();

        this._initVariables();

        this._bindEventListeners();

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
    Input.prototype.getValues = function () {

        var $checked = this.$inputs.filter("input[type='" + this.type + "']:checked"),
            result = {
                values: [],
                labels: {}
            };

        if (!_.contains(this.checkableInputs, this.type)) {
            $checked = this.$inputs.filter("input[type='" + this.type + "']");
        }

        $checked.each(function (index, element) {

            var val = $(element).val();

            result.values.push(val);
            result.labels[val] = $(element).siblings("label").text()

        });

        return result;

    };

    /**
     * Reset method
     * Mandatory method
     */
    Input.prototype.reset = function () {

        this.printDefaultSelection();

        log.info("Selector reset successfully");

    };

    /**
     * Disposition method
     * Mandatory method
     */
    Input.prototype.dispose = function () {

        this._dispose();

        log.info("Selector disposed successfully");

    };

    /**
     * Enable selector
     * Mandatory method
     */
    Input.prototype.enable = function () {

        this.$inputs.attr('disabled', false);

        this.status.disabled = false;

        log.info("Selector enabled : " + this.id);

    };

    /**
     * Disable selector
     * Mandatory method
     */
    Input.prototype.disable = function () {

        this.$inputs.attr('disabled', true);

        this.status.disabled = true;

        log.info("Selector disabled : " + this.id);

    };

    /**
     * Return Tree internal status
     * return {Object} status
     */
    Input.prototype.getStatus = function () {

        return this._getStatus();
    };

    /**
     * Print print selection
     * return {Object} status
     */
    Input.prototype.printDefaultSelection = function () {

        return this._printDefaultSelection();
    };

    /**
     * Unset the given value.
     * return {null}
     */
    Input.prototype.unsetValue = function (v) {
        log.info("Unset input value: " + v);

        if (this.status.disabled !== true) {
            log.warn("Value will not be unset because of the selector configuration");
        } else {
            log.warn("Selector is disabled. Impossible to unset input value: " + v);
        }

    };

    /**
     * Resets the selected items to the given value.
     * return {null}
     */
    Input.prototype.setValue = function (v, silent) {
        log.info("Set input value: " + v);

        var $input;

        if(this.type === 'checkbox' || this.type === 'radio') {
            $input = this.$inputs.filter("[value='" + v + "']").prop('checked', true);
        } else {
            $input = this.$inputs.val(v);
        }

        if (silent !== true) {
            $input.trigger("change");
        }

    };

    Input.prototype._checkConfiguration = function () {

        if (!this.selector.type) {
            log.trace("Set input type to 'radio'");

            this.type = "radio";

        } else {
            this.type = this.selector.type;
        }
    };

    Input.prototype._getStatus = function () {

        return this.status;
    };

    Input.prototype._renderTemplate = function () {

    };

    Input.prototype._initVariables = function () {

        var self = this;

        //Init status
        this.status = {};
        this.status.disabled = this.selector.disabled;

        this.$inputs = this.$el.find(s.TEMPLATE_LIST).find("input[type='" + this.type + "']");

        this.$inputs.attr("name", this.id + '-' + this.controller.id);

        this.values = [];

        this.$inputs.each(function () {
            self.values.push($(this).attr("value"));
        });

    };

    Input.prototype._renderInput = function () {

        this._createInputs();
    };

    Input.prototype._createInputs = function () {

        var data = this.selector.source || [],
            config = this.selector.config || {},
            $list = this.$el.find(s.TEMPLATE_LIST),
            item = $(templates).find(s.TEMPLATE_ITEM)[0].outerHTML,
            list;

        if ($list.length === 0) {
            log.info("Injecting input list");
            var ulContainers =  $(templates).find(s.TEMPLATE_LIST_CONTAINER)[0].outerHTML,
                tmpl = Handlebars.compile(ulContainers),
                $list = $(tmpl({
                    isCheckboxOrRadio: (this.type === 'radio' || this.type === 'checkbox')
                }));

            this.$el.append($list);

            $list = $list.find('ul');
        }

        if (this.type !== "radio" && this.type !== 'checkbox' && data.length == 0) {
            data.push({"value": "", "label": ""});
            log.info("Add dummy model for input");
        }
        _.each(data, _.bind(function (model) {

            window.fx_filter_input_id >= 0 ? window.fx_filter_input_id++ : window.fx_filter_input_id = 0;

            var tmpl = Handlebars.compile(item),
                m = $.extend(true, model, config, {
                    name: this.id + window.fx_filter_input_id,
                    id: "fx_input_" + window.fx_filter_input_id,
                    type: this.type,
                    isCheckboxOrRadio: (this.type === 'radio' || this.type === 'checkbox')
                }),
                $input = $(tmpl(m));

            initValidation($input, config);

            $list.append($input);

            log.info("Create input item: " + JSON.stringify(m));
        }, this));

        function initValidation($input, config) {

            if (!isNaN(config.min)) {

                $input.on('change', function () {
                    var val = parseInt($(this).find('input').val(), 10);
                    if (val < parseInt(config.min)) {
                        $(this).find('input').val(config.min)
                    }
                });

            }

            if (!isNaN(config.max)) {

                $input.on('change', function () {
                    var val = parseInt($(this).find('input').val(), 10);
                    if (val > parseInt(config.max)) {
                        $(this).find('input').val(config.max)
                    }
                });

            }

        }

    };

    Input.prototype._printDefaultSelection = function () {

        var config = this.selector,
            defaultValue = config.default || [];

        this.setValue(defaultValue);

    };

    Input.prototype._getEventName = function (evt) {

        return this.controller.id + evt;
    };

    Input.prototype._destroyInput = function () {

        log.info("Destroyed input: " + this.id);
    };

    Input.prototype._bindEventListeners = function () {

        var self = this;

        this.$inputs.on('change input', function () {

            if (self.status.ready === true) {

                var r = self.getValues(),
                    value = r.values[0] || "",
                    label = r.labels[value];

                amplify.publish(self._getEventName(EVT.SELECTORS_ITEM_SELECT + self.id), {
                    value: value,
                    label: label,
                    parent: null
                });

                amplify.publish(self._getEventName(EVT.SELECTORS_ITEM_SELECT));
            }

        });

    };

    Input.prototype._unbindEventListeners = function () {
        this.$inputs.off();
    };

    Input.prototype._dispose = function () {

        this._unbindEventListeners();

        this._destroyInput();

    };

    // dependency handler

    Input.prototype._dep_ensure_unset = function (opts) {

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

    return Input;

});