define([
    'jquery',
    'fx-filter/fluidGridLayoutRender',
    'fx-filter/fluidGridSystemLayoutRender',
    'bootstrap'
], function ($, FluidGridLayoutRender, FluidGridSystemLayoutRender) {

// Define a skeleton container factory
function LayoutFactory() {}

// Define the prototypes and utilities for this factory

// Our default containerClass is FluidGridLayoutRender
LayoutFactory.prototype.layoutClass = '';

// Our Factory method for creating new Container instances
LayoutFactory.prototype.createLayoutRender = function ( options ) {

    switch(options.layoutType){
        case "fluidGrid":
            this.layoutClass = FluidGridLayoutRender;
            break;
        case "bootstrapfluidGridSystem":
            this.layoutClass = FluidGridSystemLayoutRender;
            break;
        //case "template":
        default :
            this.layoutClass = FluidGridLayoutRender;
    }

    return new this.layoutClass( options );
};
    return LayoutFactory;
});
