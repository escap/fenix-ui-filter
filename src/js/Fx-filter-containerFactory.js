define([
    'jquery',
    'fx-filter/fluidGridBaseContainer',
    'bootstrap'
], function ($, FluidGridBaseContainer) {

// Define a skeleton container factory
function ContainerFactory() {}

// Define the prototypes and utilities for this factory

// Our default containerClass is Car
ContainerFactory.prototype.containerClass = '';

// Our Factory method for creating new Container instances
ContainerFactory.prototype.createContainer = function ( options ) {

    switch(options.containerType){
        case "fluidGridBaseContainer":
            this.containerClass = FluidGridBaseContainer;
            break;
        default :
            this.containerClass = FluidGridBaseContainer;
    }

    return new this.containerClass( options );
};
    return ContainerFactory;
});
