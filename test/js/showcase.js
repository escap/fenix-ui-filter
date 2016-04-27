define([
    'loglevel',
    'jquery',
    'underscore',
    'fx-filter/start',
    'fx-filter/js/utils',
    'test/models/all'
], function (log, $, _, Filter, Utils, AllModel) {

    'use strict';

    var s = {
            ALL: "#all",
            ALL_SUMMARY: "#all-summary"
        };

    function Test() {
    }

    Test.prototype.start = function () {

        log.trace("Test started");

        this._render();
    };

    Test.prototype._render = function () {

        this._renderAll();

    };

    Test.prototype._renderAll = function () {

        var filter = new Filter({
            items: AllModel,
            $el: s.ALL,
            summary$el: s.ALL_SUMMARY
        });
    };

    return new Test();

});