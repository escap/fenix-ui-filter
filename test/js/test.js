define([
    'loglevel',
    'jquery',
    'underscore',
    'fx-filter/start',
    'test/models/model-1',
    'text!test/html/model-1-base.hbs',
    'i18n!test/nls/labels',
    'handlebars'
], function (log, $, _, Filter, Model1, model1baseTemplate, i18nLabels, Handlebars) {

    'use strict';

    var s = {
            MODEL_1_BASE: "#model-1-base",
            MODEL_1_BASE_SUMMARY: "#model-1-base-summary",
            MODEL_1_NO_BASE: "#model-1-no-base",
            MODEL_1_BTN :"#model-1-btn"
        },
        empty_model = {data: []},
        error_model = {},
        valid_model = {},
        filters = [];

    function Test() {
    }

    Test.prototype.start = function () {

        log.trace("Test started");

        this._render();

    };

    Test.prototype._render = function () {

        this._renderModel1BaseTemplate();

    };

    Test.prototype._renderModel1BaseTemplate = function () {

        log.trace("Rendering Model 1 base: start");

        var templ = Handlebars.compile(model1baseTemplate);

        var filter = this.createFilter({
            id: s.MODEL_1_BASE,
            config: this._createFilterConfiguration(Model1),
            $el: s.MODEL_1_BASE,
            template: templ(i18nLabels),
            summary$el : s.MODEL_1_BASE_SUMMARY
        });

        $(s.MODEL_1_BTN).on('click', function () {
            log.warn(filter.getValues())
        });

        log.trace("Rendering Model 1 base: end");

    };

    Test.prototype.createFilter = function (params) {

        var instance = new Filter(params);

        filters.push(instance);

        return instance;
    };

    //Utils
    Test.prototype._createFilterConfiguration = function (Base) {

        var c = $.extend(true, {}, Base);

        _.each(c.selectors, function (obj, name) {

            if (!obj.template) {
                obj.template = {};
            }

            if (!obj.template.title) {
                obj.template.title = i18nLabels["sel_heading_" + name.replace("-", "_")];
            }

            //Add custom class to each selector
            //obj.className = "col-xs-6";

            _.each(obj.selectors, function (tab, n) {

                tab.label = i18nLabels["sel_tab_" + n.replace("-", "_")];

            });

        });

        return c;
    };

    return new Test();

});