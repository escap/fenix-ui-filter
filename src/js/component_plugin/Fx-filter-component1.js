define([
    'jquery',
    'jqwidgets'
], function ($) {

    'use strict';

    var optionsDefault = {
        componentType : '',
        componentid : '',
        name : '',
        title : '',
        grid : '',
        widget: {
            lang: 'EN'
        },
        css_classes: {
            HOLDER: "fx-catalog-modular-form-holder",
            HEADER: "fx-catalog-modular-form-header",
            HANDLER: "fx-catalog-modular-form-handler",
            CONTENT: "fx-catalog-modular-form-content",
            CLOSE_BTN: "fx-catalog-modular-form-close-btn",
            MODULE: 'fx-catalog-form-module',
            RESIZE: "fx-catalog-modular-form-resize-btn",
            LABEL: "fx-catalog-modular-form-label"
        },
        events: {
            REMOVE_MODULE: "fx.catalog.module.remove",
            READY : "fx.filter.component.ready",
            DESELECT: 'fx.filter.module.deselect.'
        }
    };

// A constructor for defining new component
function Component1( o ) {

    if (this.options === undefined) {this.options = {}; }

    $.extend(true, this.options, optionsDefault, o);
}

    Component1.prototype.validate = function (e) {
        if (!e.hasOwnProperty("source")) {
            throw new Error("ELEM_NOT_SOURCE");
        } else {
            if (!e.source.hasOwnProperty("datafields")) {
                throw new Error("ELEM_NOT_DATAFIELDS");
            }
        }

        return true;
    };

    Component1.prototype.getName = function() {
        return this.options.name;
    };

    Component1.prototype.render = function (e, component) {

        if ((e.source != null) && (typeof e.source != "undefined")) {
            if(e.multipleselection){
                $(component).jqxListBox({source: e.source, width:"99%", multipleextended:true});
            }
            else{
                $(component).jqxListBox({source: e.source, width:"99%"});
            }
            this.options.source = e.source;

        } else {
            if(e.multipleselection){
                $(component).jqxListBox({width:"99%", multipleextended:true});
            }
            else{
                $(component).jqxListBox({width:"99%"});
            }
        }

        this.options.name = e.name;
        this.options.componentid = $(component).attr("id");
        //Raise an event to show that the component has been rendered
       $(component).trigger(this.options.events.READY, {name: e.name});
    }

    Component1.prototype.setDomain = function (source) {
        this.options.source = source;
        $('#'+this.options.componentid).jqxListBox({source: source});
    }

    Component1.prototype.getValues = function () {
        var results = [];
        var items = $('#'+this.options.componentid).jqxListBox('getSelectedItems');
        if (items.length > 0) {
            for (var i = 0; i < items.length; i++) {
                results.push({componentName : this.options.name, code : items[i].value, label: items[i].label});
            }
        }
        return results;
    };

    Component1.prototype.bindEventListeners = function () {

        var that = this;

        document.body.addEventListener(this.options.events.DESELECT+this.options.module.type, function (e) {
            that.deselectValue(e.detail);
        }, false);
    };

    Component1.prototype.deselectValue = function (obj) {
        var item = $(this.options.container).jqxListBox('getItemByValue', obj.value);
        $(this.options.container).jqxListBox('unselectItem', item );
    };

    Component1.prototype.getValue = function (e) {
        var system = e.details.cl.system,
            version = e.details.cl.version,
            results = [];
        var items = $("#" + e.id).jqxListBox('getSelectedItems');
        if (items.length > 0) {
            for (var i = 0; i < items.length; i++) {
                results.push({code: {code : items[i].value, label: items[i].label, systemKey : system, systemVersion:version}});
            }
        }
        return results;
    };

    Component1.prototype.bindEventListeners = function () {

        var that = this;

        document.body.addEventListener(this.options.events.DESELECT+this.options.module.type, function (e) {
            that.deselectValue(e.detail);
        }, false);
    };

    Component1.prototype.deselectValue = function (obj) {
        var item = $(this.options.container).jqxListBox('getItemByValue', obj.value);
        $(this.options.container).jqxListBox('unselectItem', item );
    };

    Component1.prototype.getValue = function (e) {
        var system = e.details.cl.system,
            version = e.details.cl.version,
            results = [];
        var items = $("#" + e.id).jqxListBox('getSelectedItems');
        if (items.length > 0) {
            for (var i = 0; i < items.length; i++) {
                results.push({code: {code : items[i].value, label: items[i].label, systemKey : system, systemVersion:version}});
            }
        }
        return results;
    };

    return Component1;
});
