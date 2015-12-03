define([
    'jquery',
    'bootstrap'
], function ($) {

    'use strict';

    var optionsDefault = {
        container : '',
        component : '',
        grid : '',
        id : ''
    };

    function FilterModule( o ){

        if (this.options === undefined) {this.options = {}; }

        $.extend(true, this.options, optionsDefault, o);
    }

    return FilterModule;
});
