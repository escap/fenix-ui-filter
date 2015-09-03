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
        radioButtonClickedId : '',
        radioButtonsId : [],
        id_firstPart : "Fx-filter-radioButtons-",
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
    function ComponentRadioButton( o ) {
    if (this.options === undefined) {this.options = {}; }

    $.extend(true, this.options, optionsDefault, o);
    }

    ComponentRadioButton.prototype.validate = function (e) {
        //if (!e.hasOwnProperty("source")) {
        //    throw new Error("ELEM_NOT_SOURCE");
        //} else {
        //    if (!e.source.hasOwnProperty("datafields")) {
        //        throw new Error("ELEM_NOT_DATAFIELDS");
        //    }
        //}

        return true;
    };

    ComponentRadioButton.prototype.getName = function() {
        return this.options.name;
    };

    ComponentRadioButton.prototype.getAdapter = function() {
        return this.options.adapter;
    };

    ComponentRadioButton.prototype.render = function (e, component) {

        var self = this;
        var componentId = $(component).attr("id");
        var main_component = document.getElementById(component);
        var defaultSource = false;
        if ((e.config.defaultsource != null)&&(typeof e.config.defaultsource != "undefined")) {
            defaultSource = true;
        }

        if((e.config.elementsNum!=null)&&(typeof e.config.elementsNum!="undefined")){
            for(var i=0; i<e.config.elementsNum; i++){
                //Create a new div
                var div = document.createElement('DIV');
                var id = componentId+"-"+this.options.id_firstPart+i;
                div.id = id;
                if(defaultSource){
                    div.innerHTML = e.config.defaultsource[i].label;
                }
                this.options.radioButtonsId.push(id);
                component.appendChild(div);

                $("#"+id).jqxRadioButton({ width: 250, height: 25});

                $("#"+id).on('checked', function (event) {
                    self.options.radioButtonClickedId = event.target.id;
                });
            }
        }

        if ((e.config.defaultsource != null) && (typeof e.config.defaultsource != "undefined")) {
            for(var i=0; i< e.config.defaultsource.length; i++){
                if(e.config.defaultsource[i].selected){
                    $("#"+this.options.radioButtonsId[i]).jqxRadioButton({checked: true});
                }
            }
            this.options.source = e.config.defaultsource;
        }
        else{
            $("#"+this.options.radioButtonsId[0]).jqxRadioButton({checked: true});
        }

        if((e.adapter!=null)&&(typeof e.adapter!="undefined")){
            this.options.adapter = e.adapter;
        }

        this.options.name = e.name;
        //Contains the id of the
        this.options.componentid = $(component).attr("id");
        //Raise an event to show that the component has been rendered
       $(component).trigger(this.options.events.READY, {name: e.name});
    }

    ComponentRadioButton.prototype.setDomain = function (source) {
        this.options.source = source;

        for(var i=0; i< source.length; i++){
            var radioButton = document.getElementById(this.options.radioButtonsId[i]);
            //TO DO!!! To set the label
            //radioButton.innerHTML = source[i].label;
            //Before has to refreshed
            $("#"+this.options.radioButtonsId[i]).jqxRadioButton({checked: false});
        }

        for(var i=0; i< source.length; i++){
            if(source[i].selected){
                $("#"+this.options.radioButtonsId[i]).jqxRadioButton({checked: true});
            }
        }
    }

    ComponentRadioButton.prototype.getValues = function () {
        var results = [];
        var id = this.options.radioButtonClickedId;
        var last_ = id.lastIndexOf("-")+1;
        var lastInteger = parseInt(id.substring(last_), 10);

        if((id!= null)&&(typeof id!= "undefined")){
            if((this.options.source[lastInteger]!= null)&&(typeof this.options.source[lastInteger]!= "undefined")){
                results.push({componentName : this.options.name, code : this.options.source[lastInteger].value, label: this.options.source[lastInteger].label});
            }
        }
        else{
            results = null;
        }
        return results;
    };
    //
    //ComponentRadioButton.prototype.bindEventListeners = function () {
    //
    //    var that = this;
    //
    //    document.body.addEventListener(this.options.events.DESELECT+this.options.componentType, function (e) {
    //        console.log(e)
    //        that.deselectValue(e.detail);
    //    }, false);
    //};

    //ComponentRadioButton.prototype.deselectValue = function (obj) {
    //    var item = $(this.options.container).jqxListBox('getItemByValue', obj.value);
    //    $(this.options.container).jqxListBox('unselectItem', item );
    //    $('#jqxRadioButton').jqxRadioButton('uncheck');
    //};

    ComponentRadioButton.prototype.refreshDomainByAdapter = function(filterModule){
        if((this.options.adapter!=null)&&(typeof this.options.adapter!="undefined")){
            var field;
            this.options.adapter(filterModule, $.proxy(this.setDomain, this), 3);
        }
    }
    //
    //ComponentRadioButton.prototype.bindEventListeners = function () {
    //
    //    var that = this;
    //
    //    document.body.addEventListener(this.options.events.DESELECT+this.options.module.type, function (e) {
    //        that.deselectValue(e.detail);
    //    }, false);
    //};
    //
    //ComponentRadioButton.prototype.deselectValue = function (obj) {
    //    var item = $(this.options.container).jqxListBox('getItemByValue', obj.value);
    //    $(this.options.container).jqxListBox('unselectItem', item );
    //};

    ComponentRadioButton.prototype.error = function (e) {
        console.log("Component error: "+ error);
    };

    return ComponentRadioButton;
});
