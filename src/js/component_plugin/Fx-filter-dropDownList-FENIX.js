define([
    'jquery',
    'underscore',
    'jqwidgets'
], function ($, _) {

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
        return true;
    };

    ComponentDropDownList.prototype.getName = function() {
        return this.options.name;
    };

    ComponentDropDownList.prototype.getAdapter = function() {
        return this.options.adapter;
    };

    ComponentDropDownList.prototype.render = function (e, component) {

        $.extend(true, this.options, e);

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
        var type = this.options.type || "codes",
            id = this.options.id || null,
            uid = this.options.uid || null,
            value = $('#' + this.options.componentid).val(),
            results = [];

        //TODO: check value selection
        if (value === null || value === "" || value.length <= 0) {
            return { "removeFilter": true};
        }


        switch(type) {
            case "time":
                return this.getYears(value);
                break;
            case "codelist":
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

    ComponentDropDownList.prototype.getYears = function(value) {
        var results = [];
        return {
            "time" : [{from : parseInt(value, 10), to : parseInt(value, 10)}]
        };
    };

    ComponentDropDownList.prototype.getCodelist = function(id, uid, value) {
        var result = {};

        return result[id] = {
            "codes":[{
                uid: uid,
                codes: [value]
            }]
        };
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
