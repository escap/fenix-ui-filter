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
        source :'',
        //var fn = eval("var "+field+" = function(){ return "+fieldObj.validators.callback.callback+";}; "+field+"() ;") ;
        adapter : null,
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

    $.extend(true, this.options, optionsDefault, o);}

    Component1.prototype.validate = function (e) {
        //if (!e.hasOwnProperty("source")) {
        //    throw new Error("ELEM_NOT_SOURCE");
        //} else {
        //    if (!e.source.hasOwnProperty("datafields")) {
        //        throw new Error("ELEM_NOT_DATAFIELDS");
        //    }
        //}

        return true;
    };

    Component1.prototype.getName = function() {
        return this.options.name;
    };

    Component1.prototype.getAdapter = function() {
        return this.options.adapter;
    };

    Component1.prototype.render = function (e, component) {

        if ((e.config.defaultsource != null) && (typeof e.config.defaultsource != "undefined")) {
            if(e.config.multipleselection){
                $(component).jqxListBox({source: e.config.defaultsource, width:"99%", multipleextended:true, multiple: true});
            }
            else{
                $(component).jqxListBox({source: e.config.defaultsource, width:"99%", multiple: true});
            }
            for(var i=0; i< e.config.defaultsource.length; i++){
                if(e.config.defaultsource[i].selected){
                    $(component).jqxListBox('selectIndex', i);
                }
            }
            this.options.source = e.config.defaultsource;

        } else {
            if(e.config.multipleselection){
                $(component).jqxListBox({width:"99%", multipleextended:true, multiple: true});
            }
            else{
                $(component).jqxListBox({width:"99%", multiple: true});
            }
        }

        if((e.adapter!=null)&&(typeof e.adapter!="undefined")){
            this.options.adapter = e.adapter;
        }

        this.options.name = e.name;
        this.options.componentid = $(component).attr("id");
        //Raise an event to show that the component has been rendered
       $(component).trigger(this.options.events.READY, {name: e.name});
    }

    Component1.prototype.setDomain = function (source) {
        this.options.source = source;
        $('#'+this.options.componentid).jqxListBox({source: source});

        for(var i=0; i< source.length; i++){
            if(source[i].selected){
                $('#'+this.options.componentid).jqxListBox('selectIndex', i);
            }
        }
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

    Component1.prototype.refreshDomainByAdapter = function(filterModule){
        if((this.options.adapter!=null)&&(typeof this.options.adapter!="undefined")){
            var field;
            this.options.adapter(filterModule, $.proxy(this.setDomain, this), 3);
        }
    }

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

    Component1.prototype.error = function (e) {
        console.log("Component error: "+ error);
    };

    return Component1;
});
