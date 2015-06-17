/*global define */

define([
    'jquery',
    'fx-filter/filtercontroller'
], function ($, FC) {

    var o = {};

    function Start(options) {
        $.extend(true, o, options);
    }

    Start.prototype.init = function (options) {

        $.extend(true, o, options);

        this.controller = new FC({
            //mainContent: document.querySelector(o.container),
            mainContent: o.container,
            prefix_plugin_dir: o.plugin_prefix,
            current_layout: o.layout
        });

        this.controller.render();
    };

    Start.prototype.getValues = function () {
        return this.controller.getValues();
    };

    Start.prototype.add = function (modules, adapterMap) {

        this.controller.add(modules, adapterMap);
    };

    return Start;
});

