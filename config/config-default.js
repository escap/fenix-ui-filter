/*global define*/

define(function () {

    'use strict';

    var selectorPath = "fx-filter/js/selectors/";

    return {
        
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

        DIRECTION : "append",
        ENSURE_AT_LEAST : -1,


    }

});