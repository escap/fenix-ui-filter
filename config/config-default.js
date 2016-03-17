/*global define*/

define(function () {

    'use strict';

    var selectorPath = "fx-filter/js/selectors/",
        SERVER = 'http://fenix.fao.org/';

    return {

        SERVER: SERVER,
        CODELIST_SERVICE: "d3s_dev/msd",
        CODES_POSTFIX: '/codes/filter',
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
            }
        },

        "FOCUSED_SELECTOR_CLASS_NAME": "selector-focused", //class to highlight a selector

        "MANDATORY_SELECTOR_CLASS_NAME": "selector-mandatory", // class for mandatory selectors

        "OUTPUT_FORMAT": "plain", // "plain | "fenix"

        DEFAULT_TEMPLATE_OPTIONS : {
            "hideRemoveButton" : false
        }

    }

});