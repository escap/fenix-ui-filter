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
            mainContent: document.querySelector(o.container),
            prefix_plugin_dir: o.plugin_prefix
        });

        this.controller.render();

    };

    Start.prototype.getValues = function () {
        return this.controller.getValues();
    };

    Start.prototype.add = function (modules) {

        this.controller.add(modules);
    };

    return Start;
});

