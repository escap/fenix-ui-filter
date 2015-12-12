define([
    'jquery',
    'underscore',
    'jqwidgets',
    'select2'
], function ($, _) {

    'use strict';

    var optionsDefault = {
        componentType: '',
        componentid: '',
        name: '',
        title: '',
        grid: '',
        toSource: '',
        fromSource: '',
        //var fn = eval("var "+field+" = function(){ return "+fieldObj.validators.callback.callback+";}; "+field+"() ;") ;
        adapter: null,
        widget: {
            lang: 'EN'
        },
        css_classes: {
            HOLDER: "fx-catalog-modular-form-holder",
            HEADER: "fx-catalog-modular-form-header",
            HANDLER: "fx-catalog-modular-form-handler",
            CLOSE_BTN: "fx-catalog-modular-form-close-btn",
            MODULE: 'fx-filter-form-module',
            RESIZE: "fx-catalog-modular-form-resize-btn",
            LABEL: "fx-catalog-modular-form-label",
            DROPDOWN_SELECT: 'fx-filter-dropdown-menu',
            RANGE_HOLDER: 'fx-filter-range-holder',
            RANGE_LABEL_HOLDER: 'fx-filter-range-label-holder'
        },
        events: {
            REMOVE_MODULE: "fx.filter.module.remove",
            READY: "fx.filter.component.ready",
            DESELECT: 'fx.filter.module.deselect.',
            CHANGE: 'fx.filter.module.change.'
        },
        enableMultiselection: false
    };

    // A constructor for defining new component
    function ComponentTimeRangeLists(o) {

        if (this.options === undefined) {
            this.options = {};
        }

        $.extend(true, this.options, optionsDefault, o);
    }

    ComponentTimeRangeLists.prototype.validate = function (e) {
        return true;
    };

    ComponentTimeRangeLists.prototype.getName = function () {
        return this.options.name;
    };

    ComponentTimeRangeLists.prototype.getAdapter = function () {
        return this.options.adapter;
    };

    ComponentTimeRangeLists.prototype.render = function (e, component) {
        var self = this;


        this.$rangeHolder = $(component);


        //this.$rangeHolder.prop('class', this.options.css_classes.RANGE_HOLDER);

        this.$toHolder = $("<div></div>");
        this.$toLabelHolder = $("<div class='fx-filter-header'></div>");
        this.$toContentHolder = $("<div class='fx-filter-content'></div>");

        this.$fromHolder = $("<div></div>");
        this.$fromLabelHolder = $("<div class='fx-filter-header'></div>");
        this.$fromContentHolder = $("<div class='fx-filter-content'></div>");


        this.$fromDropdownSelector = $("<div></div>");
        this.$toDropdownSelector = $("<div></div>");

        $.extend(true, this.options, e);

        this.$fromTitle = $("<div>"+this.options.config.from.title[this.options.lang]+"</div>");
        this.$toTitle = $("<div>"+this.options.config.to.title[this.options.lang]+"</div>");


        this.$toLabelHolder.append(this.$toTitle);
        this.$fromLabelHolder.append(this.$fromTitle);

        this.$fromContentHolder.append(this.$fromDropdownSelector);
        this.$toContentHolder.append(this.$toDropdownSelector);

        this.$toHolder.append(this.$toLabelHolder).append(this.$toContentHolder);
        this.$fromHolder.append(this.$fromLabelHolder).append(this.$fromContentHolder);

        this.$rangeHolder.append(this.$fromHolder).append(this.$toHolder);


        if (e.config.enableMultiselection && e.config.enableMultiselection === true) {
            this.options.enableMultiselection = e.config.enableMultiselection;

            // TODO : render multiselection
        }
        // render single selection
        if ((e.config.to.defaultsource != null) && (typeof e.config.to.defaultsource != "undefined")
           && (e.config.from.defaultsource != null) && (typeof e.config.from.defaultsource != "undefined")
        ) {

            var fromSelect2Data = [];
            var toSelect2Data = [];
            var fromSelectedItems = {};
            var toSelectedItems = {};

            this._createDropdownList(this.$fromDropdownSelector, e.config.from,fromSelect2Data,fromSelectedItems, this.options);
            this._createDropdownList(this.$toDropdownSelector, e.config.to,toSelect2Data,toSelectedItems, this.options);


            for (var index in fromSelectedItems) {
                this.$fromDropdownSelector.select2('data', fromSelect2Data[index]);
            }

            for (var index in toSelectedItems) {
                this.$toDropdownSelector.select2('data', toSelect2Data[index]);
            }

            this.options.toSource = e.config.to.source;
            this.options.fromSource = e.config.from.source;

        }
       /** else {
            for (var i = 0, length = e.config.to.defaultsource.length; i < length; i++) {
                var select2Data = [];
                var selectedItems = {};

                this._fillDropdownList(e.config,select2Data,selectedItems);

                this.$dropdownSelector.select2({
                    data: select2Data,
                    width: '99%',
                    multiple: self.options.enableMultiselection
                });
            }


            if ((e.adapter != null) && (typeof e.adapter != "undefined")) {
                this.options.adapter = e.adapter;
            }
        } **/

        this.options.name = e.name;
        this.options.componentid = $(component).attr("id");

        this.bindEventListeners(fromSelect2Data, toSelect2Data, this.options);
        //Raise an event to show that the component has been rendered
        $(component).trigger(this.options.events.READY, {name: e.name});
    };


    ComponentTimeRangeLists.prototype._initDropdownList = function(selector, select2Data, options) {

        selector.select2({
            data: select2Data,
            width: '40%',
            multiple: options.enableMultiselection
        });
    }

    ComponentTimeRangeLists.prototype._createDropdownList = function(selector, config, select2Data, selectedItems, options) {

        for (var i = 0, length = config.defaultsource.length; i < length; i++) {
            var code = config.defaultsource[i].label === config.defaultsource[i].value ? "" : " [" +   config.defaultsource[i].value+ "]"

            select2Data.push({
                id: config.defaultsource[i].value,
                text: (config.onlyValueText && config.onlyValueText == true)? config.defaultsource[i].label: config.defaultsource[i].label + code
            });

            if (config.defaultsource[i].selected) {
                selectedItems[i] = true;
            }
        }

        this._initDropdownList(selector, select2Data, options);
    }

    ComponentTimeRangeLists.prototype.setDomain = function (source) {
        // TODO: setDOMAIN mutliseleciton
        this.options.source = source;
        $(component).select2({
            data: this.options.source,
            width: '99%'
        });

    };

    ComponentTimeRangeLists.prototype.getValues = function () {
        // TODO getValues mutliselection
        var type = this.options.type || "codes",
            id = this.options.id || null,
            uid = this.options.uid || null,
            version = this.options.version || null,
            valueTo = this.$toDropdownSelector.select2('val'),
            valueFrom = this.$fromDropdownSelector.select2('val'),
            results = [];

        //TODO: check value selection
        if (valueFrom === null || valueFrom === "" || valueFrom.length <= 0
        || valueTo === null || valueTo === "" || valueTo.length <= 0) {
            return {"removeFilter": true};
        }
        switch (type) {
            case "range":
                return this.getYears(valueFrom, valueTo);
                break;
            default:
                console.error("Add default behaviour");
        }

        return results;
    };

    ComponentTimeRangeLists.prototype.getYears = function (valueFrom, valueTo) {
        var result = {"time": []};
        //if (Object.prototype.toString.call(value) === '[object Array]') {
           // for (var i = 0; i < value.length; i++) {
            //    result.time.push({from: parseInt(value[i], 10), to: parseInt(value[i], 10)})
           // }
       // } else {
            result.time.push({from: parseInt(valueFrom, 10), to: parseInt(valueTo, 10)})
        //}

        return result
    };

    ComponentTimeRangeLists.prototype.bindEventListeners = function (fromData, toData, options) {
        var that = this;

      //  document.body.addEventListener(this.options.events.DESELECT + this.options.module.type, function (e) {
       //     that.deselectValue(e.detail);
       // }, false);


        this.$fromDropdownSelector.change(function () {
            var selectedValue = parseInt($(this).val(),10);

            for(var i = 0; i < toData.length; i++) {
                var obj = toData[i];
                var value1 = parseInt(obj.text, 10) > selectedValue ? obj.disabled = false : obj.disabled = true;
            }

            that.$toDropdownSelector.select2("destroy");
            that._initDropdownList(that.$toDropdownSelector, toData, options);

        }).change();


        this.$toDropdownSelector.change(function () {
            var selectedValue = parseInt($(this).val(),10);

            for(var i = 0; i < fromData.length; i++) {
                var obj = fromData[i];
                var value1 = parseInt(obj.text, 10) < selectedValue ? obj.disabled = false : obj.disabled = true;
            }

            that.$fromDropdownSelector.select2("destroy");
            that._initDropdownList(that.$fromDropdownSelector, fromData, options);

        }).change();

        };

    ComponentTimeRangeLists.prototype.deselectValue = function (obj) {
        //TODO deselect all values for multiselection
        var item = $(this.options.container).select2('getItemByValue', obj.value);
        $(this.options.container).select2('unselectItem', item);
    };

    ComponentTimeRangeLists.prototype.refreshDomainByAdapter = function (filterModule) {
        if ((this.options.adapter != null) && (typeof this.options.adapter != "undefined")) {
            var field;
            this.options.adapter(filterModule, $.proxy(this.setDomain, this), 3);
        }
    };

    ComponentTimeRangeLists.prototype.error = function (e) {
        console.log("Component drop down error: " + error);
    };


    return ComponentTimeRangeLists;
});
