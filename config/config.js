/*global define*/

define(function () {

    'use strict';

    var selectorPath = "fx-filter/js/selectors/";

    return {

        validityTimeout: 10000, //10 secs

        selectorRegistry: {
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

        focusedSelectorClassName: "focused", //class to highlight a selector
        mandatorySelectorClassName: "mandatory", // class for mandatory selectors
        disabledSelectorClassName: "disabled", // class for mandatory selectors

        outputFormat: "plain", // plain || fenix || catalog

        template: {
            hideRemoveButton: true,
            hideSwitch: true,
            hideHeaderIcon: true
        },

        direction : "append",
        ensureAtLeast : -1,
        cache : false

    }

});