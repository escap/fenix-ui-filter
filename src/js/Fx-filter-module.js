define([
    'jquery',
    'bootstrap',
    'componentcreator'
], function ($) {

    'use strict';

    var optionsDefault = {
        container : '',
        component : '',
        grid : '',
        id : ''
    }

    function FilterModule( o ){

        if (this.options === undefined) {this.options = {}; }

        $.extend(true, this.options, optionsDefault, o);
    }

//    FilterModule.prototype.renderModule = function ($blank, module, module_with_container, container_with_component, containerCreator, componentCreator) {
//
//        if(module_with_container){
//            //Creation of the container
//            containerCreator.render({
//                cssClass: "filter-elements",
//                container: "#" + module.options.id,
//                elements: JSON.stringify([module]),
//                withcomponent : container_with_component
//            });
//        }else{
//
//            //Component without container
//            componentCreator.render({
//                cssClass: "filter-elements",
//                container: "#" + module.options.id,
//                elements: JSON.stringify([module])
//            });
//        }
//
////        uiCreator.render({
////            cssClass: "form-elements",
////            container: "#" + id,
////            elements: JSON.stringify([cache.json[module.module]])
////        });
//    };

    return FilterModule;
});
