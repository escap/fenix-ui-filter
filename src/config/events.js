/*global define*/
define(function () {

    'use strict';

    var prefix = "fx.filter.";

    return {

        SELECTORS_READY: prefix + "selectors.ready",
        SELECTORS_ITEM_SELECT: prefix + "selectors.select.",
        SELECTORS_ITEM_CLICK: prefix + "selectors.click.",
        SELECTOR_READY: prefix + "selector.ready",
        SELECTOR_DISABLED: prefix + "selector.disabled.",
        SELECTOR_ENABLED: prefix + "selector.enabled.",
        ITEM_REMOVED: prefix + "selector.removed.",

    };
});
