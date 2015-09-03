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
            MODULE: 'fx-filter-form-module',
            RESIZE: "fx-catalog-modular-form-resize-btn",
            LABEL: "fx-catalog-modular-form-label"
        },
        events: {
            REMOVE_MODULE: "fx.filter.module.remove",
            READY : "fx.filter.component.ready",
            DESELECT: 'fx.filter.module.deselect.'
        }
    };

    // A constructor for defining new component
    function ComponentDropDownList( o ) {
        if (this.options === undefined) {this.options = {}; }

        $.extend(true, this.options, optionsDefault, o);}

    ComponentDropDownList.prototype.validate = function (e) {
        //if (!e.hasOwnProperty("source")) {
        //    throw new Error("ELEM_NOT_SOURCE");
        //} else {
        //    if (!e.source.hasOwnProperty("datafields")) {
        //        throw new Error("ELEM_NOT_DATAFIELDS");
        //    }
        //}

        return true;
    };

    ComponentDropDownList.prototype.getName = function() {
        return this.options.name;
    };

    ComponentDropDownList.prototype.getAdapter = function() {
        return this.options.adapter;
    };

    ComponentDropDownList.prototype.render = function (e, component) {

        if ((e.config.defaultsource != null) && (typeof e.config.defaultsource != "undefined")) {
            $(component).jqxDropDownList({source: e.config.defaultsource, width:"99%"});

            for(var i=0; i< e.config.defaultsource.length; i++){
                if(e.config.defaultsource[i].selected){
                    $(component).jqxDropDownList('selectIndex', i);
                }
            }
            this.options.source = e.config.defaultsource;

        } else {
            $(component).jqxDropDownList({source: e.config.defaultsource, width:"99%"});
        }

        if((e.adapter!=null)&&(typeof e.adapter!="undefined")){
            this.options.adapter = e.adapter;
        }

        this.options.name = e.name;
        this.options.componentid = $(component).attr("id");
        //Raise an event to show that the component has been rendered
        $(component).trigger(this.options.events.READY, {name: e.name});
    }

    ComponentDropDownList.prototype.setDomain = function (source) {
        this.options.source = source;
        $('#'+this.options.componentid).jqxDropDownList({source: source});

        for(var i=0; i< source.length; i++){
            if(source[i].selected){
                $('#'+this.options.componentid).jqxDropDownList('selectIndex', i);
            }
        }
    }

    ComponentDropDownList.prototype.getValues = function () {
        var results = [];
        //One object
        var items = $('#'+this.options.componentid).jqxDropDownList('getSelectedItem');
        if((items!=null)&&(typeof items!= "undefined")){
            results.push({componentName : this.options.name, code : items.value, label: items.label});
        }
        return results;
    };

    ComponentDropDownList.prototype.bindEventListeners = function () {

        var that = this;

        document.body.addEventListener(this.options.events.DESELECT+this.options.module.type, function (e) {
            that.deselectValue(e.detail);
        }, false);
    };

    ComponentDropDownList.prototype.deselectValue = function (obj) {
        var item = $(this.options.container).jqxDropDownList('getItemByValue', obj.value);
        $(this.options.container).jqxDropDownList('unselectItem', item );
    };

    ComponentDropDownList.prototype.refreshDomainByAdapter = function(filterModule){
        if((this.options.adapter!=null)&&(typeof this.options.adapter!="undefined")){
            var field;
            this.options.adapter(filterModule, $.proxy(this.setDomain, this), 3);
        }
    }

    ComponentDropDownList.prototype.bindEventListeners = function () {

        var that = this;

        document.body.addEventListener(this.options.events.DESELECT+this.options.module.type, function (e) {
            that.deselectValue(e.detail);
        }, false);
    };

    ComponentDropDownList.prototype.deselectValue = function (obj) {
        var item = $(this.options.container).jqxDropDownList('getItemByValue', obj.value);
        $(this.options.container).jqxDropDownList('unselectItem', item );
    };

    ComponentDropDownList.prototype.error = function (e) {
        console.log("Component drop down error: "+ error);
    };

    return ComponentDropDownList;
});
