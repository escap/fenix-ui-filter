define([
    'jquery',
    'fx-filter/component1',
    'bootstrap'
], function ($, Component1) {

// Define a skeleton vehicle factory
    function ComponentFactory() {
    }

// Define the prototypes and utilities for this factory

// Our default componentClass
    ComponentFactory.prototype.componentClass = '';

// Our Factory method for creating new Vehicle instances
    ComponentFactory.prototype.createComponent = function (options) {

        switch (options.componentType) {
            case "Component1":
                this.componentClass = Component1;
                break;
            default :
                this.componentClass = '';
            //defaults to VehicleFactory.prototype.vehicleClass (Car)
        }

        return new this.componentClass(options);
    };

    return ComponentFactory;
});