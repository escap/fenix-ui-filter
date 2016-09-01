define([
    'loglevel',
    'jquery',
    'underscore',
    '../../../src/js/index',
    /*'fx-common/utils',*/
    'dev/src/models/model-1',
    'dev/src/models/all',
    'dev/src/models/semantic',
    'dev/src/models/fx-resource',
    'dev/src/models/to-sync',
    'dev/src/models/tab-table-toolbar-config',
    'dev/src/models/fx-process',
    'dev/src/models/aggregation',
    'dev/src/models/model-2',
    'dev/src/models/dependencies',
    'dev/src/models/countrystat',
    'dev/src/models/setSources',
    'dev/src/models/amis',
    'dev/src/html/model-1-base.hbs',
    'dev/src/nls/labels',
    'handlebars'
], function (log, $, _, Filter, /* Utils, */Model1, AllModel, SemanticModel, FxResource, ModelToSync, TableTabModel, Process, AggregationModel, Model2, ModelDependencies, CountryStatModel, SetSourcesModel, AmisModel, model1baseTemplate, i18nLabels, Handlebars) {

    'use strict';

    var s = {
            MODEL_1_BASE: "#model-1-base",
            MODEL_1_BASE_SUMMARY: "#model-1-base-summary",
            MODEL_1_BTN: "#model-1-btn",
            DYNAMIC_MODEL_1_BASE: "#model-1-dynamic",
            DYNAMIC_MODEL_1_ADD_BTN: "#model-1-dynamic-add-btn",
            DYNAMIC_MODEL_1_VALUES_BTN: "#model-1-dynamic-values-btn",
            DYNAMIC_MODEL_1_CLEAR_BTN: "#model-1-dynamic-clear-btn",
            DYNAMIC_MODEL_1_SUMMARY: "#model-1-dynamic-summary",
            FENIX_RESOURCE: "#fenix-resource",
            FENIX_RESOURCE_SUMMARY: "#fenix-resource-summary",
            SYNC_SRC: "#sync-src",
            SYNC_SRC_SUMMARY: "#sync-src-summary",
            SYNC_TARGET: "#sync-target",
            SYNC_BTN: "#sync-btn",
            TABLE_TAB: "#table-tab",
            TABLE_BTN: "#table-btn",
            EVENT_COUNTERS: "#event-counters",
            EVENT_VALUES_BTN: "#event-values-btn",
            EVENT_DISPOSE: "#event-dispose",
            MODEL_2: "#model2",
            DEPENDENCIES: "#dependencies",
            COUNTRYSTAT: "#countrystat",
            SOURCES: "#sources",
            SOURCES_BTN: "#sources-btn",
            AMIS: "#amis"
        },
        empty_model = {data: []},
        error_model = {},
        valid_model = {},
        filters = [],
        environment = 'production';

    function Dev() {

        console.clear();

        //trace, debug, info, warn, error, silent
        log.setLevel('trace');

        this.start();

    }

    Dev.prototype.start = function () {

        log.trace("Dev started");

        this._render();

        //this._createConfiguration();

    };

    Dev.prototype._renderDependencies = function () {

        var filter = this.createFilter({
            items: ModelDependencies,
            el: s.DEPENDENCIES
        });
    };

    Dev.prototype._renderAll = function () {

        var filter = this.createFilter({
            items: AllModel,
            el: s.AMIS
        });
    };

    Dev.prototype._renderAmis = function () {

        var filter = this.createFilter({
            items: AmisModel,
            el: s.AMIS
        });

    };

    Dev.prototype._renderCountrystat = function () {

        var filter = this.createFilter({
            items: CountryStatModel,
            el: s.COUNTRYSTAT
        });

    };

    Dev.prototype._renderModel2 = function () {

        var filter = this.createFilter({
            items: Model2,
            el: s.MODEL_2
        });
    };

    Dev.prototype._createConfiguration = function () {

        var configuration = Utils.createConfiguration({
            model: FxResource
        });

        log.warn(configuration);

        //return;

        var filter = this.createFilter({
            id: s.FENIX_RESOURCE,
            items: this._createFilterConfiguration(configuration),
            el: s.FENIX_RESOURCE,
            summaryEl: s.FENIX_RESOURCE_SUMMARY
        });
    };

    Dev.prototype._render = function () {

        this._renderAll();

        return;

        this._renderDependencies();

        this._renderSetSources();

        this._renderCountrystat();

        this._renderEvents();

        this._renderModel2();

        this._renderSynch();

        this._renderDynamicModel1();

        this._renderModel1BaseTemplate();

        this._renderSynch();

    };

    Dev.prototype._renderSetSources = function () {

        var filter = this.createFilter({
            items: this._createFilterConfiguration(SetSourcesModel),
            el: s.SOURCES
        });

        $(s.SOURCES_BTN).on('click', function () {

            filter.setSources({
                tree: [{value: "item_01", label: "Item 1"}, {value: "item_02", label: "Item 2"}],
                dropdown: [{value: "item_03", label: "Item 3"}, {value: "item_04", label: "Item 4"}],
                range: [{value: "10", label: "10", parent: 'from'}, {value: "99", label: "99", parent: 'to'}],

            })
        });

    };

    Dev.prototype._renderEvents = function () {

        var filterIsReady = false;

        var filter = this.createFilter({
            items: this._createFilterConfiguration(AggregationModel),
            el: s.TABLE_TAB
        })
            .on("ready", function () {
                filterIsReady = true;

                incrementCount("ready");
            })
            .on("change", function (payload) {

                if (filterIsReady !== true) {
                    alert("'change' event should be triggered after 'ready' event!");
                }

                log.info(payload);

                incrementCount("change");
            });

        $(s.EVENT_VALUES_BTN).on('click', function () {
            log.warn(filter.getValues(null, ["tree"]));
        });

        $(s.EVENT_DISPOSE).on('click', function () {
            filter.dispose();
            log.warn("Filter disposed successfully")
        });

        function incrementCount(event) {

            var $badge = $(s.EVENT_COUNTERS)
                    .find("[data-event='" + event + "']").find(".badge"),
                current = parseInt($badge.html()) || 0;

            $badge.html(current + 1);
        }
    };

    Dev.prototype._renderModel1BaseTemplate = function () {

        log.trace("Rendering Model 1 base: start");

        var templ = Handlebars.compile(model1baseTemplate);

        var filter = this.createFilter({
            id: s.MODEL_1_BASE,
            items: this._createFilterConfiguration(Model1),
            el: s.MODEL_1_BASE,
            template: templ(i18nLabels),
            summaryEl: s.MODEL_1_BASE_SUMMARY
        });

        $(s.MODEL_1_BTN).on('click', function () {
            log.warn(filter.getValues())
        });

        log.trace("Rendering Model 1 base: end");

    };

    Dev.prototype._renderDynamicModel1 = function () {

        log.trace("Rendering Dynamic Model 1 base: start");

        var self = this,
            filter = this.createFilter({
                id: s.DYNAMIC_MODEL_1_BASE,
                el: s.DYNAMIC_MODEL_1_BASE,
                summaryEl: s.DYNAMIC_MODEL_1_SUMMARY
            });

        $(s.DYNAMIC_MODEL_1_ADD_BTN).on("click", function () {

            var name = self._pickRandomProperty(Model1),
                conf = {};

            conf[name] = Model1[name];

            filter.add(self._createFilterConfiguration(conf));

        });

        $(s.DYNAMIC_MODEL_1_VALUES_BTN).on("click", function () {
            log.warn(filter.getValues());
        });

        $(s.DYNAMIC_MODEL_1_CLEAR_BTN).on("click", function () {
            filter.clear();
        });

        log.trace("Rendering Dynamic Model 1 base: end");

    };

    Dev.prototype._renderSynch = function () {

        log.trace("Rendering sync: start");

        var Model = ModelToSync,
            templ = Handlebars.compile(model1baseTemplate);

        var source = this.createFilter({
                id: s.SYNC_SRC,
                items: this._createFilterConfiguration(Model),
                el: s.SYNC_SRC,
                //template: templ(i18nLabels),
                summaryEl: s.SYNC_SRC_SUMMARY
            }),
            target = this.createFilter({
                id: s.SYNC_TARGET,
                items: this._createFilterConfiguration(Model),
                el: s.SYNC_TARGET,
                //template: templ(i18nLabels)
            });

        $(s.SYNC_BTN).on('click', function () {
            var v = source.getValues();
            log.info(v);
            target.setValues(v, true);
        });

        log.trace("Rendering sync: end");

    };

    //Utils

    Dev.prototype.createFilter = function (params) {

        var instance = new Filter(
            $.extend(true, params, {
                environment: environment
            }));

        filters.push(instance);

        return instance;
    };

    Dev.prototype._createFilterConfiguration = function (Base) {

        var self = this,
            c = $.extend(true, {}, Base);

        _.each(c, function (obj, name) {

            self._createSelectorConfiguration(name, obj);
        });

        return c;
    };

    Dev.prototype._createSelectorConfiguration = function (name, obj) {

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

    Dev.prototype._pickRandomProperty = function (obj) {
        var result;
        var count = 0;
        for (var prop in obj)
            if (Math.random() < 1 / ++count)
                result = prop;
        return result;
    };

    return new Dev();

});