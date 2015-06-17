define([
    'jquery',
   // 'fx-filter/component1',
    'bootstrap'
], function ($) {

    function ComponentFactory() {
    }

// Define the prototypes and utilities for this factory
    ComponentFactory.prototype.componentClass = '';

//    ComponentFactory.prototype.createComponent = function (options) {
//
//        switch (options.componentType) {
//            case "Component1":
//                this.componentClass = Component1;
//                break;
//            default :
//                this.componentClass = '';
//        }
//
//        return new this.componentClass(options);
//    };

    return ComponentFactory;
});