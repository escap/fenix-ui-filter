if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {

    'use strict';

    var prefix = "fx.filter.";

    return {

        SELECTORS_READY: prefix + "selectors.ready",
        SELECTORS_ITEM_SELECT: prefix + "selectors.select.",
        SELECTOR_READY: prefix + "selector.ready",
        SELECTOR_DISABLED: prefix + "selector.disabled.",
        SELECTOR_ENABLED: prefix + "selector.enabled.",
        ITEM_REMOVED: prefix + "selector.removed."

    };
});
