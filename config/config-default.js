/*global define*/

define(function () {

    'use strict';

    var selectorPath = "fx-filter/js/selectors/",
        SERVER = 'http://fenix.fao.org/';

    return {

        SERVER: SERVER,
        CODES_SERVICE: "d3s_dev/msd",
        CODESLIST_POSTFIX: '/codes/filter',
        ENUMERATION_POSTFIX: '/choices/',
        VALID_TIMEOUT: 10000, //10 secs

        selector_registry: {
            'dropdown': {
                path: selectorPath + 'dropdown'
            },
            'tree': {
                path: selectorPath + 'tree'
            },
            'input': {
                path: selectorPath + 'input'
            },
            'range': {
                path: selectorPath + 'range'
            },
            'time': {
                path: selectorPath + 'time'
            },
            'sortable': {
                path: selectorPath + 'sortable'
            }
        },

        "FOCUSED_SELECTOR_CLASS_NAME": "selector-focused", //class to highlight a selector

        "MANDATORY_SELECTOR_CLASS_NAME": "selector-mandatory", // class for mandatory selectors

        "OUTPUT_FORMAT": "plain", // "plain | "fenix"

        DEFAULT_TEMPLATE_OPTIONS: {
            "hideRemoveButton": true,
            "hideSwitch": true
        },

        //Utils
        DEFAULT_PERIOD_FROM: 1960,
        DEFAULT_PERIOD_TO: 2016

    }

});