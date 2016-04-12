define([
    'loglevel',
    'jquery',
    'underscore',
    'fx-filter/start',
    'test/models/uneca-domain',
    'test/models/uneca-profile',
    'i18n!test/nls/labels',
    'handlebars'
], function (log, $, _, Filter, ModelDomain, ModelProfile, i18nLabels, Handlebars) {

    'use strict';

    var s = {
            UNECA_DOMAIN: "#uneca-domain",
            UNECA_PROFILE: "#uneca-profile",
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

        this._renderDomain();

        this._renderProfile();

    };

    Test.prototype._renderDomain = function () {

        var filter = this.createFilter({
            items: ModelDomain,
            $el: s.UNECA_DOMAIN
        });
    };

    Test.prototype._renderProfile = function () {

        var filter = this.createFilter({
            items: ModelProfile,
            $el: s.UNECA_PROFILE
        });
    };

    //Utils

    Test.prototype.createFilter = function (params) {

        var instance = new Filter(params);

        filters.push(instance);

        return instance;
    };

    Test.prototype._createFilterConfiguration = function (Base) {

        var self = this,
            c = $.extend(true, {}, Base);

        _.each(c, function (obj, name) {

            self._createSelectorConfiguration(name, obj);
        });

        return c;
    };

    Test.prototype._createSelectorConfiguration = function (name, obj) {

        if (!obj.template) {
            obj.template = {};
        }

        if (!obj.template.title) {
            obj.template.title = i18nLabels["sel_heading_" + name.replace("-", "_")];
        }

        //Add custom class to each selector
        //obj.className = "col-xs-3";

        _.each(obj.selectors, function (tab, n) {

            tab.label = i18nLabels["sel_tab_" + n.replace("-", "_")];

        });
    };

    Test.prototype._pickRandomProperty = function (obj) {
        var result;
        var count = 0;
        for (var prop in obj)
            if (Math.random() < 1 / ++count)
                result = prop;
        return result;
    };

    return new Test();

});