define([
    'jquery',
    'container1',
    'bootstrap'
], function ($, Container1) {

// Define a skeleton container factory
function ContainerFactory() {}

// Define the prototypes and utilities for this factory

// Our default containerClass is Car
ContainerFactory.prototype.containerClass = '';

// Our Factory method for creating new Container instances
ContainerFactory.prototype.createContainer = function ( options ) {

    switch(options.containerType){
        case "Container1":
            this.containerClass = Container1;
            break;
        default :
            this.containerClass = Container1;
    }

    return new this.containerClass( options );
};
    return ContainerFactory;
});
