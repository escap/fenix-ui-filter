/*global define, amplify, alert*/
define([
    "jquery",
    "fx-filter/config/config",
    "fx-filter/config/config-default",
    "fx-filter/config/events",
    "jQAllRangeSliders",
    "amplify"
], function ($, C, DC, E) {

    'use strict';

    var o = {
        lang: 'EN',
        //For filter logic .... start
        componentType: '',
        componentid: '',
        name: '',
        title: '',
        grid: '',
        source: '',
        defaultsource: '',
        adapter: null,
        css_classes: {
            HOLDER: "fx-catalog-modular-form-holder",
            HEADER: "fx-catalog-modular-form-header",
            HANDLER: "fx-catalog-modular-form-handler",
            CONTENT: "fx-catalog-modular-form-content",
            CLOSE_BTN: "fx-catalog-modular-form-close-btn",
            MODULE: 'fx-filter-form-module',
            RESIZE: ".fx-catalog-modular-form-resize-btn",
            LABEL: "fx-catalog-modular-form-label"
        },

        sourceType: {
            timelist: 'timeList',
            period: 'period'
        },

        events: {
            REMOVE_MODULE: "fx.filter.module.remove",
            READY: "fx.filter.component.ready",
            DESELECT: 'fx.filter.module.deselect.'
        }
        //For filter logic .... end
    };

    function Fx_ui_survey_component(optionsDefault) {

        if (this.options === undefined) {
            this.options = {};
        }

        $.extend(true, this.options, o, optionsDefault);
    };

    Fx_ui_survey_component.prototype._initialize = function(e) {

        this.$surveyTimerange = $(e.template.descriptions.SURVEY.YEARS)

        this.$surveyaddCharsName = e.template.descriptions.SURVEY.ADD_CHARS_RADIO_NAME

        this.$surveyAddCharsSelector = $('input[name="' + this.$surveyaddCharsName + '"]:radio');

        this.$sourceTimerange = e.component.years.defaultsource;

    };

    Fx_ui_survey_component.prototype.render = function (e, container) {

        var self = this;

        self.options.container = container;

        self.options.module = e;

        this.$componentStructure = e.template.overallStructure;

        this.$container = $(container);

        this.$container.append(this.$componentStructure);

        this._initialize(e);

        this.$surveyTimerange.rangeSlider({
            bounds: {min: this.$sourceTimerange.from, max: this.$sourceTimerange.to},
            step: 1, defaultValues: {min: this.$sourceTimerange.from + 5, max: this.$sourceTimerange.to - 5}
        });

        this.bindEventListeners();

        if ((e.adapter != null) && (typeof e.adapter != "undefined")) {
            self.options.adapter = e.adapter;
        }

        self.options.name = e.name;
        self.options.componentid = $(container).attr("id");
        //Raise an event to show that the component has been rendered
        $(container).trigger(self.options.events.READY, {name: e.name});

    };

    Fx_ui_survey_component.prototype.validate = function (e) {

        //TODO

        if ((e.component.hasOwnProperty("sourceType")) && (e.component.hasOwnProperty("defaultsource"))) {
            return true;
        }
        else {
            throw new Error("ELEM_NOT_SOURCE");
        }

        return true;
    };

    Fx_ui_survey_component.prototype.processData = function (dataType, data) {
        // TODO

        var r = [];
        if (dataType == o.sourceType.timelist) {
            //Array of years
            data.sort(function (a, b) {
                if (a < b)
                    return -1;
                if (a > b)
                    return 1;
                return 0;
            });

            $(data).each(function (index, item) {
                r.push({"text": "" + item, "id": item, "children": false});
            });
        }
        else if (dataType == o.sourceType.period) {
            //Array of json object {from: to}
            $(data).each(function (index, item) {
                var start_year = item.from;
                var end_year = item.to;
                var iYear = 0;
                if (start_year <= end_year) {
                    for (iYear = start_year; iYear <= end_year; iYear++) {
                        r.push({"text": "" + iYear, "id": iYear, "children": false});
                    }
                }
            });
        }

        return r;
    };

    Fx_ui_survey_component.prototype.bindEventListeners = function () {


        var self = this;

        this.$surveyAddCharsSelector.on('change', function (e, data) {
            e.preventDefault();
            console.log($(e.target).val());

        });

        $( this.options.css_classes.RESIZE).on('click', function () {
            self.$surveyTimerange.rangeSlider('resize');
        })

        amplify.subscribe(E.MODULE_DESELECT + '.' + self.options.module.name, function (e) {

            self.deselectValue(e);
        });

    };

    Fx_ui_survey_component.prototype.deselectValue = function (obj) {

        this.$treeContainer.jstree('deselect_node', [obj.value]);

        this.$treeContainer.jstree(true).deselect_node([obj.value]);

    };

    //For filter logic .... start
    Fx_ui_survey_component.prototype.getName = function () {
        return this.options.name;
    };


    Fx_ui_survey_component.prototype.getAdapter = function () {
        return this.options.adapter;
    };
    //For filter logic .... end

    Fx_ui_survey_component.prototype.getValues = function (e) {

        var timeData = this.$surveyTimerange.rangeSlider('values');

        return {
            years: {
                "period": {
                    from: timeData.min,
                    to: timeData.max
                }
            },
            addChars: $('input[name="' + this.$surveyaddCharsName + '"]:radio:checked').val()
        };
    };

    return Fx_ui_survey_component;
});