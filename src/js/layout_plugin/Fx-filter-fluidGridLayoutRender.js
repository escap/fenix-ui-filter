define([
    'jquery',
    "fx-common/structures/fx-fluid-grid",
    'fx-filter/filtermodule',
    'fx-filter/containerfactory',
], function ($, FluidForm, FilterModule, ContainerFactory) {

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
                    columnWidth: "."+options.ITEM_COMPONENT_CLASS_ID,
                    percentPosition: true,
                    transitionDuration: 0
                }
            });

            this.options.grid.render();
    };

    FluidGridLayoutRender.prototype.add = function (element, adapter_map, options, index, componentCreator) {

        var module = '';
        //Add in the DOM
        element.grid = this.options.grid;
        if((element!=null)&&(element!= "undefined"))
        {
            //Creation of the Module
            var moduleObj = new FilterModule({
                id: "fenix_filter_module_"+options.mainContent+"_"+options.module_id,
                grid: this.options.grid, container_plugin_dir: options.container_plugin_dir, component_plugin_dir: options.component_plugin_dir});

            //Creation of the Container
            var containerFactory = new ContainerFactory();
//        var containerFactoryInstance = containerFactory.createContainer( {
//            vehicleType: "car",
//            color: "yellow",
//            doors: 6 } );
            var containerFactoryInstance = '';
            //Active Tab could be undefined ... if the container contains only one component
            if((element.title!=null)&&(typeof element.title!="undefined")){
                containerFactoryInstance = containerFactory.createContainer({containerType : element.containerType, title : element.title, grid : element.grid, activeTab : element.activeTab});
            }
            else{
                containerFactoryInstance = containerFactory.createContainer({containerType : element.containerType, grid : element.grid, activeTab : element.activeTab});
            }

            moduleObj.options.container = containerFactoryInstance;
            //Get html code for module render
            if((element.components!=null)&&(typeof element.components!="undefined")){
                for(var j =0; j<element.components.length; j++){
                    var component_name = element.components[j].name;
                    if((adapter_map!=null)&&(typeof adapter_map!= "undefined")&&(adapter_map[component_name]!=-null)&&(typeof adapter_map[component_name]!="undefined")){
                        element.components[j].adapter = adapter_map[component_name];
                    }
                }
            }
            var blank = moduleObj.options.container.getBlankContainer(moduleObj, element.components);
            this.options.grid.addItem(blank.get(0));
            componentCreator.render(moduleObj, element);

            module = moduleObj;
        }

        return module;
    }

    FluidGridLayoutRender.prototype.getGrid = function () {
        return this.options.grid;
    };

    return FluidGridLayoutRender;
});
