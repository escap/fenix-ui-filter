/*global define*/

define(function () {

    'use strict';

    var selectorPath = "fx-filter/js/selectors/",
        SERVER = 'http://fenix.fao.org/';

    return {

        SERVER: SERVER,
        CODELIST_SERVICE: "d3s_dev/msd",
        CODES_POSTFIX : '/codes/filter',

        selector_registry: {
            'dropdown': {
                path: selectorPath + 'dropdown'
            },
            'tree': {
                path: selectorPath + 'tree'
            },
            'radio': {
                path: selectorPath + 'radio'
            }
        },

        "maxCombinations": 20, //Max number of requests to d3p

        "selectorFocusedClass": "selector-focused", //class to highlight a selector

        "mandatorySelectorClass": "selector-mandatory", // class for mandatory selectors

        "advancedOptionsSelector": ".advanced-option",

        "showAdvancedOptions": true,

        "outputFormat" : "plain"

    }

});