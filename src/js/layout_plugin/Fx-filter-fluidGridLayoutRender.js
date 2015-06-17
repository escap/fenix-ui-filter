define([
    'jquery',
    'fx-filter/fluidgrid',
], function ($, FluidForm) {

    'use strict';

    var optionsDefault = {

        html_ids : {
            MAIN_CONTAINER: "fx-filter_container",
            GRID_CONTAINER: "fx-filter-grid"
        },
        grid : ''
    }

    // A constructor for defining new container
    function FluidGridLayoutRender( o ) {

        if (this.options === undefined) {this.options = {}; }

        $.extend(true, this.options, optionsDefault, o);
    }

    FluidGridLayoutRender.prototype.render = function (options) {

            var c = document.createElement('DIV');
            c.className = 'fx-filter-container';
            this.options.html_ids.GRID_CONTAINER = this.options.html_ids.GRID_CONTAINER + "_" +options.mainContent;
            c.id = this.options.html_ids.GRID_CONTAINER;
//        c.text = 'PROVA';

            var main_container = document.getElementById(options.MAIN_CONTAINER);
            if((main_container!=null)&&(typeof main_container != "undefined")){
                while (main_container.firstChild) {
                    main_container.removeChild(main_container.firstChild);
                }
                main_container.appendChild(c);
            }

            this.options.grid = new FluidForm();

            this.options.grid.init({
                container: document.querySelector("#"+this.options.html_ids.GRID_CONTAINER),
                drag: {
                    handle: '.fx-catalog-modular-form-handler',
                    containment: "#"+this.options.html_ids.GRID_CONTAINER
                },
                config: {
                    itemSelector: "."+options.ITEM_COMPONENT_CLASS_ID,
                    columnWidth: "."+options.ITEM_COMPONENT_CLASS_ID
                }
            });

            this.options.grid.render();
    };

    FluidGridLayoutRender.prototype.getGrid = function () {
        return this.options.grid;
    };

    return FluidGridLayoutRender;
});
