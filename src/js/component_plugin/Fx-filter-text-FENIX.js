/*global define, amplify*/
define([
    "jquery",
    "fx-filter/config/events",
    "amplify"
], function ($, E) {

    'use strict';

    var o = {
        lang : 'EN',
        //For filter logic .... start
        componentType : '',
        componentid : '',
        name : '',
        title : '',
        grid : '',
        source :'',
        adapter : null,

        events: {
            REMOVE_MODULE: "fx.catalog.module.remove",
            READY : "fx.filter.component.ready",
            DESELECT: 'fx.filter.module.deselect.'
        }
    };

    function Fx_ui_w_text(optionsDefault) {
        if (this.options === undefined) {this.options = {}; }

        $.extend(true, this.options, o, optionsDefault);
    }

    Fx_ui_w_text.prototype.validate = function () {
        return true;
    };

    Fx_ui_w_text.prototype.render = function (e, container) {

        var self = this;
        self.options.container = container;

        self.options.module = e;

        var text = document.createElement('INPUT');

        text.setAttribute("type", "TEXT");

        if (e.component.hasOwnProperty("rendering")) {

            if (e.component.rendering.hasOwnProperty("placeholder")) {

                if (e.component.rendering.placeholder.hasOwnProperty(o.lang)) {
                    text.setAttribute("placeholder", e.component.rendering.placeholder[o.lang]);
                } else {
                    text.setAttribute("placeholder", e.component.rendering.placeholder['EN']);
                }
            }
        }

        if (e.component.rendering.hasOwnProperty("htmlattributes")) {

            Object.keys(e.component.rendering.htmlattributes).forEach(function (entry) {
                text[entry] = e.component.rendering.htmlattributes[entry];
            });

        }

        $(text).on('keyup', function(){

            amplify.publish(E.MODULE_READY,
                { value : [{label: $(self.options.container).find("input").val()}],
                    id: self.options.module.name,
                    label :  self.options.module.title.EN
                });


        });

        $(container).append(text);

        this.bindEventListeners();

        if((e.adapter!=null)&&(typeof e.adapter!="undefined")){
            self.options.adapter = e.adapter;
        }

        self.options.name = e.name;
        self.options.componentid = $(container).attr("id");
        //Raise an event to show that the component has been rendered
        $(container).trigger(self.options.events.READY, {name: e.name});

    };

    Fx_ui_w_text.prototype.bindEventListeners = function () {

        var that = this;

        amplify.subscribe(E.MODULE_DESELECT+ '.' +that.options.module.name, function (e) {

            that.deselectValue(e.detail);

        }, false);
    };

    //For filter logic .... start
    Fx_ui_w_text.prototype.getName = function() {
        return this.options.name;
    };

    Fx_ui_w_text.prototype.getAdapter = function() {
        return this.options.adapter;
    };
    //For filter logic .... end

    Fx_ui_w_text.prototype.deselectValue = function () {
        $(this.options.container).find('input').val('');
    };

    Fx_ui_w_text.prototype.getValues = function (e) {
        var c = { enumeration :  [$("#" + this.options.componentid + "  input").val()]};
        return c;
    };

    return Fx_ui_w_text;
});