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
        source: '',
        //var fn = eval("var "+field+" = function(){ return "+fieldObj.validators.callback.callback+";}; "+field+"() ;") ;
        adapter: null,
        widget: {
            lang: 'EN'
        },
        css_classes: {
            HOLDER: "fx-catalog-modular-form-holder",
            HEADER: "fx-catalog-modular-form-header",
            HANDLER: "fx-catalog-modular-form-handler",
            CONTENT: "fx-catalog-modular-form-content",
            CLOSE_BTN: "fx-catalog-modular-form-close-btn",
            MODULE: 'fx-filter-form-module',
            RESIZE: "fx-catalog-modular-form-resize-btn",
            LABEL: "fx-catalog-modular-form-label",
            DROPDOWN_SELECT: 'fx-filter-dropdown-menu'
        },
        events: {
            REMOVE_MODULE: "fx.filter.module.remove",
            READY: "fx.filter.component.ready",
            DESELECT: 'fx.filter.module.deselect.'
        },
        enableMultiselection: false
    };

    // A constructor for defining new component
    function ComponentDropDownList(o) {

        if (this.options === undefined) {
            this.options = {};
        }

        $.extend(true, this.options, optionsDefault, o);
    }

    ComponentDropDownList.prototype.validate = function (e) {
        return true;
    };

    ComponentDropDownList.prototype.getName = function () {
        return this.options.name;
    };

    ComponentDropDownList.prototype.getAdapter = function () {
        return this.options.adapter;
    };

    ComponentDropDownList.prototype.render = function (e, component) {
        var self = this;
        this.$dropdownSelector = $(component);
        $.extend(true, this.options, e);

        if (e.config.enableMultiselection && e.config.enableMultiselection === true) {
            this.options.enableMultiselection = e.config.enableMultiselection;

            // TODO : render multiselection
        }
        // render single selection
        if ((e.config.defaultsource != null) && (typeof e.config.defaultsource != "undefined")) {

            var select2Data = [];
            var selectedItems = {};

            for (var i = 0, length = e.config.defaultsource.length; i < length; i++) {
                var code = e.config.defaultsource[i].label === e.config.defaultsource[i].value ? "" : " [" +   e.config.defaultsource[i].value+ "]"
                select2Data.push({
                    id: e.config.defaultsource[i].value,
                    text: e.config.defaultsource[i].label + code

                });

                if (e.config.defaultsource[i].selected) {
                    selectedItems[i] = true;
                }
            }

            this.$dropdownSelector.select2({
                data: select2Data,
                width: '99%',
                multiple: self.options.enableMultiselection
            });


            for (var index in selectedItems) {
                this.$dropdownSelector.select2('data', select2Data[index]);
            }
            this.options.source = e.config.defaultsource;

        }
        else {
            for (var i = 0, length = e.config.defaultsource.length; i < length; i++) {
                var select2Data = [];
                var selectedItems = {};

                for (var i = 0, length = e.config.defaultsource.length; i < length; i++) {
                    select2Data.push({
                        id: e.config.defaultsource[i].value,
                        text: e.config.defaultsource[i].label
                    });

                    if (e.config.defaultsource[i].selected) {
                        selectedItems[i] = true;
                    }
                }

                this.$dropdownSelector.select2({
                    data: select2Data,
                    width: '99%',
                    multiple: self.options.enableMultiselection
                });
            }


            if ((e.adapter != null) && (typeof e.adapter != "undefined")) {
                this.options.adapter = e.adapter;
            }
        }

        this.options.name = e.name;
        this.options.componentid = $(component).attr("id");

        //Raise an event to show that the component has been rendered
        $(component).trigger(this.options.events.READY, {name: e.name});
    };

    ComponentDropDownList.prototype.setDomain = function (source) {
        // TODO: setDOMAIN mutliseleciton
        this.options.source = source;
        $(component).select2({
            data: this.options.source,
            width: '99%'
        });

    };

    ComponentDropDownList.prototype.getValues = function () {
        // TODO getValues mutliselection
        var type = this.options.type || "codes",
            id = this.options.id || null,
            uid = this.options.uid || null,
            value = this.$dropdownSelector.select2('val'),
            results = [];

        //TODO: check value selection
        if (value === null || value === "" || value.length <= 0) {
            return {"removeFilter": true};
        }


        switch (type) {
            case "time":
                return this.getYears(value);
                break;
            case "codelist":
                return this.getCodelist(id, uid, value);
                break;
            case "codelist-codes":
                return this.getCodelist(id, uid, value);
                break;
            // same as codelist
            case "distinct":
                return this.getCodelist(id, uid, value);
                break;

            default:
                console.error("Add default behaviour");
        }

        return results;
    };

    ComponentDropDownList.prototype.getYears = function (value) {
        var result = {"time": []};
        if (Object.prototype.toString.call(value) === '[object Array]') {
            for (var i = 0; i < value.length; i++) {
                result.time.push({from: parseInt(value[i], 10), to: parseInt(value[i], 10)})
            }
        } else {
            result.time.push({from: parseInt(value, 10), to: parseInt(value, 10)})
        }

        return result
    };

    ComponentDropDownList.prototype.getCodelist = function (id, uid, value) {
        var result = {};
        result = {"codes": [{uid: uid, codes: []}]};
        if (Object.prototype.toString.call(value) === '[object Array]') {
            for (var i = 0; i < value.length; i++) {
                result.codes[0].codes.push(value[i])
            }
        } else {
            result.codes[0].codes.push(value);
        }

        return result
    };

    ComponentDropDownList.prototype.bindEventListeners = function () {

        var that = this;

        document.body.addEventListener(this.options.events.DESELECT + this.options.module.type, function (e) {
            that.deselectValue(e.detail);
        }, false);
    };

    ComponentDropDownList.prototype.deselectValue = function (obj) {
        //TODO deselect all values for multiselection
        var item = $(this.options.container).select2('getItemByValue', obj.value);
        $(this.options.container).select2('unselectItem', item);
    };

    ComponentDropDownList.prototype.refreshDomainByAdapter = function (filterModule) {
        if ((this.options.adapter != null) && (typeof this.options.adapter != "undefined")) {
            var field;
            this.options.adapter(filterModule, $.proxy(this.setDomain, this), 3);
        }
    };

    ComponentDropDownList.prototype.bindEventListeners = function () {

        var that = this;

        document.body.addEventListener(this.options.events.DESELECT + this.options.module.type, function (e) {
            that.deselectValue(e.detail);
        }, false);
    };

    ComponentDropDownList.prototype.error = function (e) {
        console.log("Component drop down error: " + error);
    };

    return ComponentDropDownList;
});
