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

    function FX_ui_population_component(optionsDefault) {

        if (this.options === undefined) {
            this.options = {};
        }

        $.extend(true, this.options, o, optionsDefault);
    };

    FX_ui_population_component.prototype._initialize = function(e) {

        // gender
        this.$populationGenderName = e.template.descriptions.POPULATION.GENDERS_RADIO_NAME
        this.$populationGenderSelector = $('input[name="' + this.$populationGenderName + '"]:radio')

        // agerange Type
        this.$populationAgeRangeTypeName = e.template.descriptions.POPULATION.AGERANGE_TYPE_RADIO_NAME
        this.$populationAgeRangeTypeSelector = $('input[name="' + this.$populationAgeRangeTypeName + '"]:radio')


        // agerange
        this.$populationAgerange = $(e.template.descriptions.POPULATION.AGERANGE)

        // characteristics
        this.$populationCharsName = e.template.descriptions.POPULATION.CHARACTERISTICS_RADIO_NAME;
        this.$populationCharsSelector = $('input[name="' + this.$populationCharsName + '"]:radio')


        // initialization data timerange
       this.$dataTimeRange = {
           yearsRange : e.component.ageRange.defaultsource.YEARS,
           monthsRange: e.component.ageRange.defaultsource.MONTHS
           };
    };

    FX_ui_population_component.prototype.render = function (e, container) {

        var self = this;

        self.options.container = container;

        self.options.module = e;

        $.extend(self.options.events, e.events); // extend events passed from the host

        this.$componentStructure = e.template.overallStructure;

        this.$container = $(container);

        this.$container.append(this.$componentStructure);

        this.$isYearTypeSelected  =true;

        this._initialize(e);

        // ageRange selector
        this.$populationAgerange.rangeSlider({
            bounds: {min:  this.$dataTimeRange.yearsRange.from, max: this.$dataTimeRange.yearsRange.to},
            step: 1, defaultValues: {min: this.$dataTimeRange.yearsRange.from + 5, max: this.$dataTimeRange.yearsRange.to - 5}
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

    FX_ui_population_component.prototype.validate = function (e) {

        //TODO

        if ((e.component.hasOwnProperty("sourceType")) && (e.component.hasOwnProperty("defaultsource"))) {
            return true;
        }
        else {
            throw new Error("ELEM_NOT_SOURCE");
        }

        return true;
    };

    FX_ui_population_component.prototype.processData = function (dataType, data) {
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

    FX_ui_population_component.prototype.bindEventListeners = function () {

        var self = this;


        // on change gender
        this.$populationGenderSelector.on('change', function (e, data) {
            e.preventDefault();

            console.log(self.options.events.MODIFY)
            amplify.publish(self.options.events.MODIFY)
        });


        // on change kind of age range
        this.$populationAgeRangeTypeSelector.on('change', function (e, data) {
            e.preventDefault();
            var kindOfAgeRange =$(e.target).val();
            // change in months
            if(self.$isYearTypeSelected=== true && kindOfAgeRange === 'MONTHS'){
                self.$isYearTypeSelected = false;
                self.$populationAgerange.rangeSlider('bounds', self.$dataTimeRange.monthsRange.from, self.$dataTimeRange.monthsRange.to);
                self.$populationAgerange.rangeSlider('values', self.$dataTimeRange.monthsRange.from+48, self.$dataTimeRange.monthsRange.to-240)

            }else if(self.$isYearTypeSelected=== false && kindOfAgeRange === 'YEARS'){
                self.$isYearTypeSelected = true;
                self.$populationAgerange.rangeSlider('bounds', self.$dataTimeRange.yearsRange.from, self.$dataTimeRange.yearsRange.to);
                self.$populationAgerange.rangeSlider('values', self.$dataTimeRange.yearsRange.from+5, self.$dataTimeRange.yearsRange.to-5)
            }

            amplify.publish(self.options.events.MODIFY)
        });


        this.$populationAgerange.bind("valuesChanged", function(e, data){
            e.preventDefault;
            amplify.publish(self.options.events.MODIFY)
        });


        // oresize jqallrange slider
        $( this.options.css_classes.RESIZE).on('click', function () {
            self.$populationAgerange.rangeSlider('resize');
        })


        amplify.subscribe(E.MODULE_DESELECT + '.' + self.options.module.name, function (e) {
            self.deselectValue(e);
        });
    };

    FX_ui_population_component.prototype.deselectValue = function (obj) {

        this.$treeContainer.jstree('deselect_node', [obj.value]);

        this.$treeContainer.jstree(true).deselect_node([obj.value]);
    };

    //For filter logic .... start
    FX_ui_population_component.prototype.getName = function () {
        return this.options.name;
    };

    FX_ui_population_component.prototype.getAdapter = function () {
        return this.options.adapter;
    };
    //For filter logic .... end

    FX_ui_population_component.prototype.getValues = function (e) {

        var ageRangeSelected = this.$populationAgerange.rangeSlider('values');

        return {

            ageRangeType : $('input[name="' + this.$populationAgeRangeTypeName + '"]:radio:checked').val(),

            ageRange: {
                "period": {
                    from: ageRangeSelected.min,
                    to: ageRangeSelected.max
                }
            },

            gender: $('input[name="' + this.$populationGenderName + '"]:radio:checked').val(),

            characteristics: $('input[name="' + this.$populationCharsName + '"]:radio:checked').val()

        };
    };

    return FX_ui_population_component;
});