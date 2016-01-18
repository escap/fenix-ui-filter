define([
    'jquery',
    "fx-common/structures/fx-fluid-grid",
    'fx-filter/filtermodule',
    'fx-filter/containerfactory'
], function ($, FluidForm, FilterModule, ContainerFactory) {

    'use strict';

    var optionsDefault = {

        html_ids: {
            MAIN_CONTAINER: "fx-filter_container",
            GRID_CONTAINER: "fx-filter-grid",
            GRID_ROW: "fx-filter-grid-row"
        },
        grid: ''
    };

    // A constructor for defining new container
    function FluidGridSystemLayoutRender(o) {

        if (this.options === undefined) {
            this.options = {};
        }

        $.extend(true, this.options, optionsDefault, o);
    }

    FluidGridSystemLayoutRender.prototype.render = function (options) {

        var c = document.createElement('DIV');
        c.className = 'container-fluid';
        this.options.html_ids.GRID_CONTAINER = this.options.html_ids.GRID_CONTAINER + "_" + options.mainContent;
        c.id = this.options.html_ids.GRID_CONTAINER;

        var r = document.createElement('DIV');
        r.className = 'row';
        this.options.html_ids.GRID_ROW = this.options.html_ids.GRID_ROW + "_" + options.mainContent;
        r.id = this.options.html_ids.GRID_ROW;

        c.appendChild(r);

        var main_container = document.getElementById(options.MAIN_CONTAINER);
        if ((main_container != null) && (typeof main_container != "undefined")) {
            while (main_container.firstChild) {
                main_container.removeChild(main_container.firstChild);
            }
            main_container.appendChild(c);
        }

        this.options.grid = {};
        this.options.grid.o = {};
        this.options.grid.o.container =  document.querySelector("#" + this.options.html_ids.GRID_ROW);
       // this.options.grid = $('#'+r.id);

    };

    FluidGridSystemLayoutRender.prototype.add = function (element, adapter_map, options, index, componentCreator) {

        var module = '';
        //Add in the DOM
        element.grid = this.options.grid;

        if ((element != null) && (element != "undefined")) {

            //Creation of the Module
            var moduleObj = new FilterModule({
                id: "fenix_filter_module_" + options.mainContent + "_" + options.module_id,
                grid: this.options.grid,
                container_plugin_dir: options.container_plugin_dir,
                component_plugin_dir: options.component_plugin_dir,
                element : element
            });


            //Creation of the Container
            var containerFactory = new ContainerFactory();

            var containerFactoryInstance = '';

            var containerConfiguration = {
                containerType: element.containerType,
                grid: element.grid,
                activeTab: element.activeTab,
                daniele: true
            };

            //Active Tab could be undefined ... if the container contains only one component
            if ((element.title != null) && (typeof element.title != "undefined")) {

                containerFactoryInstance =
                    containerFactory.createContainer($.extend(containerConfiguration, {title: element.title}));

            } else {
                containerFactoryInstance = containerFactory.createContainer(containerConfiguration);
            }

            moduleObj.options.container = containerFactoryInstance;

            //Get html code for module render
            if ((element.components != null) && (typeof element.components != "undefined")) {

                for (var j = 0; j < element.components.length; j++) {
                    var component_name = element.components[j].name;

                    if ((adapter_map != null) && (typeof adapter_map != "undefined") && (adapter_map[component_name] != -null) && (typeof adapter_map[component_name] != "undefined")) {
                        element.components[j].adapter = adapter_map[component_name];

                    }
                }
            }

            var blank = moduleObj.options.container.getBlankContainer(moduleObj, element.components);

            componentCreator.render(moduleObj, element);

            module = moduleObj;
        }

        return module;
    }

    FluidGridSystemLayoutRender.prototype.getGrid = function () {
        return this.options.grid;
    };

    return FluidGridSystemLayoutRender;
});
