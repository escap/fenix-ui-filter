define([
    'jquery',
    'fx-filter/containerfactory',
    'fx-filter/filtermodule',
    'fx-filter/componentcreator',
    'fx-filter/layoutfactory',
    'bootstrap'
//], function ($, FluidForm, ContainerFactory, ComponentFactory, FilterModule, Container1, Component1, ComponentCreator) {
], function ($, ContainerFactory, FilterModule, ComponentCreator, LayoutFactory) {

    'use strict';

    var optionsDefault = {
        mainContent : '',
        //Grid that contains the filter
        grid : '',
        components_map : {},

        current_layout :'',
        //Object of the current layout
        layout_render : '',

        html_ids : {
            MAIN_CONTAINER: "fx-filter_container"
        },

        class_ids : {
            ITEM_COMPONENT: "fx-catalog-form-module"
        },

        //The list of the filter event
        events: {
            REMOVE_MODULE: "fx.catalog.module.remove"
        },

        //The list of the components event
        component_event: {
            //This is raise after the render of the component
            READY :"fx.filter.component.ready"
        },

        //Events for host
        host_event: {
            COMPONENT_READY : "fx.host.component.ready"
        },

        module_id : 31,
        filter_module_array :[],

        prefix_plugin_dir : '',
        plugin_subdir : '',

        container_plugin_dir : 'src/js/container_plugin/',
        component_plugin_dir : 'src/js/component_plugin/'
    },  componentCreator;

    function FC( o ){

        if (this.options === undefined) {this.options = {}; }

        $.extend(true, this.options, optionsDefault, o);

        //Creation of the filter container
        //to put inside the filter content located in the
        //host application

        var main_content = document.getElementById(this.options.mainContent);
        if(main_content!=null && typeof main_content!="undefined"){
            while (main_content.firstChild) {
                main_content.removeChild(main_content.firstChild);
            }
        }

        var c = document.createElement('DIV');
        //The Main Container is main container filter + host container id
        this.options.html_ids.MAIN_CONTAINER = this.options.html_ids.MAIN_CONTAINER +"_"+this.options.mainContent;
        c.id = this.options.html_ids.MAIN_CONTAINER;
        main_content.appendChild(c);

        componentCreator = new ComponentCreator();
        componentCreator.init({plugin_folder: this.options.prefix_plugin_dir + this.options.component_plugin_dir});

    }

    FC.prototype.initEventListeners = function () {

        var self = this;

        $('body').on(self.options.events.REMOVE_MODULE, function(event, properties){
            //Removing module
            for(var i=0; i<self.options.filter_module_array.length; i++){
                if(self.options.filter_module_array[i].options.id==properties.moduleObj.options.id){
                    self.options.filter_module_array.splice(i, 1);
                }
            }
        });
    }

    FC.prototype.initComponentsEventListener = function () {
        var self = this;
        //This happen when the component has been rendered
        $('body').on(self.options.component_event.READY, function(event, properties){

            if((properties!=null)&&(typeof properties!="undefined")&&(properties.name !=null)&&(typeof properties.name !="undefined")){
                self.setDomainByAdapter(properties.name);
            }
            //The host can set now the domain
            $('body').trigger(self.options.host_event.COMPONENT_READY, properties);
        });
    };

    FC.prototype.renderComponents = function () {
    };

    //FC.prototype.add = function (modules_array, adapter_map) {
    //    if((modules_array!=null)&&(typeof modules_array!="undefined")&&(modules_array.length>0)){
    //
    //    }
    //}

    FC.prototype.add = function (modules_array, adapter_map) {
        if((modules_array!=null)&&(typeof modules_array!="undefined")&&(modules_array.length>0)){
            for(var i=0; i<modules_array.length; i++){

                //Add in the DOM
                var element = modules_array[i];
                element.grid = this.options.grid;
                if((element!=null)&&(element!= "undefined"))
                {
                    //Creation of the Module
                    var moduleObj = new FilterModule({id: "fenix_filter_module_"+this.options.mainContent+"_"+this.options.module_id, grid: this.options.grid, container_plugin_dir: this.options.container_plugin_dir, component_plugin_dir: this.options.component_plugin_dir});
                    this.options.module_id++;

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
                    this.options.filter_module_array.push(moduleObj);
                }
            }
        }
    }

    //After the component render the host can decide to set the domain
    FC.prototype.setDomain = function (component_name, source) {
        if((this.options.filter_module_array!=null)&&(typeof this.options.filter_module_array!="undefined")){
            for(var i=0; i<this.options.filter_module_array.length; i++){
//                var component = this.options.filter_module_array[i].options.component;
                var components = this.options.filter_module_array[i].options.container.options.components;
                for(var iComp = 0; iComp<components.length; iComp++){
                    var modulename = components[iComp].options.name;
                    if(modulename==component_name){
                        components[iComp].setDomain(source);
                    }
                }
            }
        }
    }

    //After the component render the host can decide to set the domain
    FC.prototype.setDomainByAdapter = function (component_name) {
        if((this.options.filter_module_array!=null)&&(typeof this.options.filter_module_array!="undefined")){
            for(var i=0; i<this.options.filter_module_array.length; i++){
//                var component = this.options.filter_module_array[i].options.component;
                var components = this.options.filter_module_array[i].options.container.options.components;
                for(var iComp = 0; iComp<components.length; iComp++){
                    var modulename = components[iComp].getName();
                    if(modulename==component_name){
                        //var source = [{"value":"1234","label":"S3","selected":false},
                        //    {"value":"12345","label":"S4","selected":false}];
                        //components[iComp].setDomain(source);
                        var adapter = components[iComp].getAdapter();
                        if((adapter!=null)&&(typeof adapter!="undefined")){
                            //Update the domain passing the filter module
                            var filterModule = this.getValues();
                            components[iComp].refreshDomainByAdapter(filterModule);
                        }
                    }
                }
            }
        }
    }

    //Each element in the results array is {componentName : this.options.name, code : items[i].value, label: items[i].label};
    //By default getValues considers only the active tabs
    FC.prototype.getValues = function (components){
        var results = {};
        var resultsCount = 0;
        if((components!=null)&&(typeof components!= "undefined")&&(components.length>0)){
            if((this.options.filter_module_array!=null)&&(typeof this.options.filter_module_array!="undefined")){
                for(var iComp=0; iComp<components.length; iComp++){
                    var componenName = components[iComp].name;

                    for(var i=0; i<this.options.filter_module_array.length; i++){
                        var activeTab = this.options.filter_module_array[i].options.container.options.activeTab;
                        var components = this.options.filter_module_array[i].options.container.options.components;
                        for(var jComp = 0; jComp<components.length; jComp++){
                            var component = components[jComp];
                            var modulename = component.getName();
                            // activeTab=="undefined" if there is one component for the container
                            if((componenName==modulename)&&((activeTab==null)||(typeof activeTab=="undefined")||(activeTab.length==0)||(activeTab==modulename))){
                                results[component.getName()] = component.getValues();
                                resultsCount++;
                            }
                        }
                    }
                }
            }
        }
        else{
            //Return the values for all the components
            if((this.options.filter_module_array!=null)&&(typeof this.options.filter_module_array!="undefined")){
                    for(var i=0; i<this.options.filter_module_array.length; i++){
                        var activeTab = this.options.filter_module_array[i].options.container.options.activeTab;
                        var components = this.options.filter_module_array[i].options.container.options.components;
                        for(var jComp = 0; jComp<components.length; jComp++){
//                            var component = this.options.filter_module_array[i].options.component;
                            var component = components[jComp];
                            if((activeTab==null)||(typeof activeTab=="undefined")||(activeTab.length==0)||(activeTab==component.getName())) {
                                results[component.getName()] = component.getValues();
                                resultsCount++;
                            }
                        }
                    }
            }
        }
        return results;
    }

    //Each element in the results array is {componentName : this.options.name, code : items[i].value, label: items[i].label};
    //getAllValues considers ALL tabs, not only the active tab
    FC.prototype.getAllValues = function (components){
        var results = {};
        var resultsCount = 0;
        if((components!=null)&&(typeof components!= "undefined")&&(components.length>0)){
            if((this.options.filter_module_array!=null)&&(typeof this.options.filter_module_array!="undefined")){
                for(var iComp=0; iComp<components.length; iComp++){
                    var componenName = components[iComp].name;

                    for(var i=0; i<this.options.filter_module_array.length; i++){
                        var components = this.options.filter_module_array[i].options.container.options.components;
                        for(var jComp = 0; jComp<components.length; jComp++){
                            var component = components[jComp];
                            var modulename = component.getName();
                            if(componenName==modulename){
                                results[component.getName()] = component.getValues();
                                resultsCount++;
                            }
                        }
                    }
                }
            }
        }
        else{
            //Return the values for all the components
            if((this.options.filter_module_array!=null)&&(typeof this.options.filter_module_array!="undefined")){
                for(var i=0; i<this.options.filter_module_array.length; i++){
                    var components = this.options.filter_module_array[i].options.container.options.components;
                    for(var jComp = 0; jComp<components.length; jComp++){
//                            var component = this.options.filter_module_array[i].options.component;
                        var component = components[jComp];
                        results[component.getName()] = component.getValues();
                        resultsCount++;
                    }
                }
            }
        }
        return results;
    }

//    FC.prototype.gridRender = function (components_array) {
//
//        var c = document.createElement('DIV');
//        c.className = 'fx-filter-container';
//        this.options.html_ids.GRID_CONTAINER = this.options.html_ids.GRID_CONTAINER + "_" +this.options.mainContent;
//        c.id = this.options.html_ids.GRID_CONTAINER;
////        c.text = 'PROVA';
//
//        var main_container = document.getElementById(this.options.html_ids.MAIN_CONTAINER);
//        if((main_container!=null)&&(typeof main_container != "undefined")){
//            while (main_container.firstChild) {
//                main_container.removeChild(main_container.firstChild);
//            }
//            main_container.appendChild(c);
//        }
//
//        this.options.grid = new FluidForm();
//
//        this.options.grid.init({
//            container: document.querySelector("#"+this.options.html_ids.GRID_CONTAINER),
//            drag: {
//                handle: '.fx-catalog-modular-form-handler',
//                containment: "#"+this.options.html_ids.GRID_CONTAINER
//            },
//            config: {
//                itemSelector: "."+this.options.class_ids.ITEM_COMPONENT,
//                columnWidth: "."+this.options.class_ids.ITEM_COMPONENT
//            }
//        });
//
//        this.options.grid.render();
//    }

    FC.prototype.layoutRender = function () {

        this.options.layout_render = new LayoutFactory().createLayoutRender({"layoutType" :this.options.current_layout});

        this.options.layout_render.render({"mainContent":this.options.mainContent, "MAIN_CONTAINER": this.options.html_ids.MAIN_CONTAINER, "ITEM_COMPONENT_CLASS_ID": this.options.class_ids.ITEM_COMPONENT});
        this.options.grid = this.options.layout_render.getGrid();
    }

    FC.prototype.render = function () {

        //Event lister of the filter
        this.initEventListeners();
        //Event Listener of each components
        this.initComponentsEventListener();
        this.layoutRender();
        //if(this.options.current_layout==this.options.layout_type.FLUID_GRID){
        //    this.gridRender();
        //}

        this.renderComponents();
    }

    return FC;

});