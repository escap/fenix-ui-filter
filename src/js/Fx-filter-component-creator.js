/*
 * TODO:
 * Set lang dynamically
 *
 * Review the validation method. Every ComponentType should have an array of validation fns in order
 * to do not duplicate the same validation fns
 * */

define([
    "require",
    "jquery"
], function (require, $) {

    var errors = {
            UNKNOWN_TYPE: {EN: "FENIX UI Creator: Unknown widget type"},
            CONTAINER_NOT_FOUND: { EN: "FENIX UI Creator: Impossible to find container"},
            ELEMENTS_NOT_JSON: { EN: "FENIX UI Creator: Elements JSON file not valid"},
            ELEMENTS_NOT_ARRAY: { EN: "FENIX UI Creator: Elements JSON file not an array"},
            ELEM_NOT_ID: { EN: "FENIX UI Creator: Specify Id for each UI element"},
            ELEM_NOT_COMP: { EN: "FENIX UI Creator: Specify Component for each UI element"},
            ELEM_COMP_TYPE: { EN: "FENIX UI Creator: Component Type not valid"},
            ELEM_NOT_SOURCE: { EN: "FENIX UI Creator: Specify source for each Component"},
            ELEM_NOT_DATAFIELDS: { EN: "FENIX UI Creator: Specify Datafields for each Component"},
            VALUES_NOT_READY: { EN: "FENIX UI Creator: Values Not Ready"},
            VALIDATORS_NOT_VALID: { EN: "FENIX UI Creator: Validators not valid"},
            DATE_FORMAT_ERROR: { EN: "FENIX UI Creator: Date format not valid"},
            CONNECTION_FAIL: { EN: "FENIX UI Creator: Connection problems"}
        },
        lang = 'EN',
        valid;
    /*
     langs: allowed languages for rendering
     o: component internal options
     v: used to get validation result
     */
    var langs = ["EN", "FR", "ES"], elems, v;

    //helper functions
    function handleError(e) {
        throw new Error(errors[e][lang]);
        valid = false;
    }

    //Validation fns
    function inputValidation(o) {

        //Existing container
        if (!document.querySelector(o.container)) {
            handleError("CONTAINER_NOT_FOUND");
        }

        //valid JSON Source
        try {
            JSON.parse(o.elements);
        } catch (e) {
            handleError("ELEMENTS_NOT_JSON");
        }

        //Source as Array
        if (JSON.parse(o.elements).length === undefined) {
            handleError("ELEMENTS_NOT_ARRAY");
        }

        //UI valid lang
        if (o.lang && langs.indexOf(o.lang.toUpperCase()) > 0) {
            lang = o.lang.toUpperCase();
        }

        return valid;
    }

    function validateElement(e, widget) {

        //Valid component
        if (!e.hasOwnProperty("id")) {
            handleError("ELEM_NOT_ID");
        }

        //Valid component
        if (!e.hasOwnProperty("component")) {
            handleError("ELEM_NOT_COMP");
        }
        //Component Type
        if (widget.validate) {
            valid = widget.validate(e.component);
        }

        return valid;
    }

    //Rendering fns
    function createElement(o, module, e, widget, index, componentslen) {

        var div, label, c;
        var id_container = module.options.id+"_comp_"+index;

        c = document.getElementById(id_container);

        if (!c) {
            c = document.createElement("DIV");
            c.setAttribute("id", id_container);
            //It's not used now... if there is a class for the component element in the configuration file
            if (e.cssclass) {
                c.setAttribute("class", e.cssclass);
            }
        }

        var id_component_content = id_container + "_content";
        if ((e.subtitle!=null) && (e.subtitle!="undefined") && (e.subtitle[e.lang])) {

            label = document.createElement("DIV");
            label.innerHTML = e.subtitle[e.lang];
            c.appendChild(label);

            div = document.createElement("DIV");
            div.setAttribute("id", id_component_content);
            c.appendChild(div);
        } else {

            div = document.createElement("DIV");
            div.setAttribute("id", id_component_content);
            if (e.cssclass) {
                div.setAttribute("class", e.cssclass);
            }
            c.appendChild(div);
        }

        widget.render(e, div);
    }

    //Public Component
    function Fenix_ui_creator(o) {
        this.o = {};
        $.extend(this.o, o);
    }

    Fenix_ui_creator.prototype.getValidation = function (o, values) {

        var result = {}, propertyErrors, property, validatorName, e;

        if (o.validators) {
            if (typeof o.validators !== "object") {
                handleError("VALIDATORS_NOT_VALID");
            }
            else {

                //Loop over validations
                for (property in o.validators) {

                    propertyErrors = { errors: {} };

                    if (o.validators.hasOwnProperty(property)) {

                        for (validatorName in o.validators[property]) {

                            if (o.validators[property].hasOwnProperty(validatorName)) {

                                e = o.validators[property][validatorName](values[property]);

                                if (e !== true) {
                                    propertyErrors.errors[validatorName] = e;
                                }

                            }
                        }
                    }

                    if (Object.keys(propertyErrors.errors).length > 0) {

                        propertyErrors.value = values[property];
                        result[property] = propertyErrors;
                    }
                }
            }
        }

        return Object.keys(result).length === 0 ? null : result;
    };

    //Get Values
    Fenix_ui_creator.prototype.getValues = function (validate, externalElements) {

        var result = {}, self = this;

        if (externalElements) {

            $(externalElements).each(function (index, element) {

                //Synch call of require
                try {

                    var module = require( self.o.plugin_folder + "Fx-ui-w-" + element.type),
                        widget = new module();
                    result[element[self.o.result_key]] = widget.getValue(element);

                } catch (e) {
                    console.log(e)
                }
            });

        } else {
            //Looping on initial elements
            if (elems === undefined) {
                handleError("VALUES_NOT_READY");
            }

            $(elems).each(function (index, element) {

                //Synch call of require
                try {
                    var module = require( self.o.plugin_folder + "Fx-ui-w-" + element.type),
                        widget = new module();

                    result[element.id] = widget.getValue(element);
                } catch (e) {
                    console.log(e)
                }
            });
        }

        v = validate === undefined || validate === false ? null : self.getValidation({}, result);
        if (v) {
            throw new Error(v);
        }

        return result;
    };

    Fenix_ui_creator.prototype.validate = function () {
        return this.getValidation(this.getValues());
    };

    Fenix_ui_creator.prototype.render = function (module, config_element) {

        var self = this;
        valid = true;

        //if (inputValidation(o)) {

           // elems = JSON.parse(config_element.components);
            elems = config_element.components;
            var componentslen = elems.length;

            $(elems).each(function (index, element) {

                var widgetCreator = self.o.plugin_folder + "Fx-filter-" + element.componentType;
                console.log(self.o.plugin_folder)
//                widgetCreator = "http://168.202.28.26:8080/filter/src/js/component_plugin/Fx-filter-component1.js";
//                widgetCreator = "http://168.202.28.26:10400/uae/submodules/fenix-ui-filter/src/js/component_plugin/Fx-filter-component1.js";

                require([widgetCreator], function (Widget) {
                    valid = true;
                    var widget = new Widget({componentType : element.componentType});
//                    module.options.component = widget;
                   module.options.container.options.components.push(widget);
//                    $.extend(true, this.options, optionsDefault, o);
//                    $.extend(true, this.options, optionsDefault, o);

                    //if (validateElement(element, widget)) {

                    createElement(self.o, module, element, widget, index, componentslen);
                    //}

                }, function (err) {
                    handleError("UNKNOWN_TYPE");
                });
            });
        //}
    };

    Fenix_ui_creator.prototype.init = function (o) {
        $.extend(this.o, o);
    };

    //Public API
    return Fenix_ui_creator;

});