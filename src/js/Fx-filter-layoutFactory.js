define([
    'jquery',
    'fx-filter/fluidGridLayoutRender',
    'bootstrap'
], function ($, FluidGridLayoutRender) {

// Define a skeleton container factory
function LayoutFactory() {}

// Define the prototypes and utilities for this factory

// Our default containerClass is Car
LayoutFactory.prototype.layoutClass = '';

// Our Factory method for creating new Container instances
LayoutFactory.prototype.createLayoutRender = function ( options ) {

    switch(options.layoutType){
        case "fluidGrid":
            this.layoutClass = FluidGridLayoutRender;
            break;
        //case "template":
        default :
            this.layoutClass = FluidGridLayoutRender;
    }

    return new this.layoutClass( options );
};
    return LayoutFactory;
});
