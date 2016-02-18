define([
    'jquery',
    'underscore',
    'amplify',
    'select2'

], function ($, _) {

    'use strict';

    var optionsDefault = {
        componentType: '',
        componentid: '',
        name: '',
        title: '',
        grid: '',
        source: '',
        //var fn = eval("var "+field+" = function(){ return "+fieldObj.validators.callback.callback+";}; "+field+"() ;") ;
        adapter: null,
        widget: {
            lang: 'EN'
        },
        css_classes: {
            HOLDER: "fx-catalog-modular-form-holder",
            HEADER: "fx-catalog-modular-form-header",
            HANDLER: "fx-catalog-modular-form-handler",
            CLOSE_BTN: "fx-catalog-modular-form-close-btn",
            MODULE: 'fx-filter-form-module',
            RESIZE: "fx-catalog-modular-form-resize-btn",
            LABEL: "fx-catalog-modular-form-label",
            DROPDOWN_SELECT: 'fx-filter-dropdown-menu'
        },
        events: {
            REMOVE_MODULE: "fx.filter.module.remove",
            READY: "fx.filter.component.ready",
            DESELECT: 'fx.filter.module.deselect.',
            LIST_CHANGE: 'fx.filter.list.change.',
            LIST_RESET: 'fx.filter.list.reset.'
        },
        enableMultiselection: false,
        removeFilter: false
    };

    // A constructor for defining new component
    function ComponentDropDownList(o) {

        if (this.options === undefined) {
            this.options = {};
        }

        $.extend(true, this.options, optionsDefault, o);
    }

    ComponentDropDownList.prototype.validate = function (e) {
        return true;
    };

    ComponentDropDownList.prototype.getName = function () {
        return this.options.name;
    };

    ComponentDropDownList.prototype.getAdapter = function () {
        return this.options.adapter;
    };

    ComponentDropDownList.prototype.render = function (e, component) {
        var self = this;
        this.$dropdownSelector = $(component);
        $.extend(true, this.options, e);

        // allow for select2 config to be set in configuration file
        this.select2Config = $.extend(true, { width: '99%', multiple: self.options.enableMultiselection}, e.creator);
        this.select2Config.matcher = this._matchStart;

        if (e.config.enableMultiselection && e.config.enableMultiselection === true) {
            this.options.enableMultiselection = e.config.enableMultiselection;
        }

        if (e.config.removeFilter && e.config.removeFilter === true) {
            this.options.removeFilter = e.config.removeFilter;
        }

        // render single selection
        if ((e.config.defaultsource != null) && (typeof e.config.defaultsource != "undefined")) {

            var select2Data = [];
            var selectedItems = [];

            this._fillDropdownList(e.config,select2Data,selectedItems);

            this.select2Config.data = select2Data;
            this.$dropdownSelector.select2(this.select2Config);

            /**this.$dropdownSelector.select2({
                data: select2Data,
                width: '99%',
                multiple: self.options.enableMultiselection
            }
            );  **/

            //for (var index in selectedItems) {
                //this.$dropdownSelector.select2('data', select2Data[index]);
                this.$dropdownSelector.select2('val', selectedItems);
            //}

            this.options.source = e.config.defaultsource;

        }
        else {
            for (var i = 0, length = e.config.defaultsource.length; i < length; i++) {
                var select2Data = [];
                var selectedItems = {};

                this._fillDropdownList(e.config,select2Data,selectedItems);

                this.select2Config.data = select2Data;

                this.$dropdownSelector.select2(this.select2Config);
               /** this.$dropdownSelector.select2({
                    data: select2Data,
                    width: '99%',
                    multiple: self.options.enableMultiselection
                });  **/
            }


            if ((e.adapter != null) && (typeof e.adapter != "undefined")) {
                this.options.adapter = e.adapter;
            }
        }

        this.options.name = e.name;
        this.options.componentid = $(component).attr("id");

        this.bindEventListeners();

        //Raise an event to show that the component has been rendered
        $(component).trigger(this.options.events.READY, {name: e.name});
    };

    ComponentDropDownList.prototype._matchStart = function(term, text) {

       if(text.toUpperCase().indexOf(term.toUpperCase()) == 0){
           return true;
       }

        return false;
    };

    ComponentDropDownList.prototype._fillDropdownList = function(config, select2Data, selectedItems) {

        for (var i = 0, length = config.defaultsource.length; i < length; i++) {
            var code = config.defaultsource[i].label === config.defaultsource[i].value ? "" : " [" +   config.defaultsource[i].value+ "]"


            select2Data.push({
                id: config.defaultsource[i].value,
                text: (config.onlyValueText && config.onlyValueText == true)? config.defaultsource[i].label: config.defaultsource[i].label + code
            });

            if (config.defaultsource[i].selected) {
                selectedItems.push(config.defaultsource[i].value);
            }
        }
    };

    ComponentDropDownList.prototype.setDomain = function (source) {
        var that = this;

       // this.$dropdownSelector.select2("destroy");

        // TODO: setDOMAIN mutliseleciton
        this.options.source = source;
        this.select2Config.data =  this.options.source;
        this.$dropdownSelector.select2(this.select2Config);

       /** this.$dropdownSelector.select2({
            data: that.options.source,
            width: '99%'
        });  **/
    };


    ComponentDropDownList.prototype.getValues = function () {
        //console.log("========================= GET VALUES");

        // TODO getValues mutliselection
        var type = this.options.type || "codes",
            id = this.options.id || null,
            removeFilter = this.options.removeFilter || false,
            uid = this.options.uid || null,
            version = this.options.version || null,
            levels = this.options.levels || null,
            level = this.options.level || null,
            value = this.$dropdownSelector.select2('val'),
            results = [];


        //TODO: check value selection
        if (value === null || value === "" || value.length <= 0) {
            return {"removeFilter": true};
        }
        if (removeFilter) {
            return {"removeFilter": true};
        }
        switch (type) {
            case "time":
                return this.getYears(value);
                break;
            case "codelist":
                return this.getCodelist(id, uid, value, version);
                break;
            case "codelist-codes":
                return this.getCodelist(id, uid, value, version);
                break;
            case "codelist-hierarchy":
                return this.getHierarchyCodelist(id, uid, value, version, levels, level);
                break;
            // same as codelist
            case "distinct":
                return this.getCodelist(id, uid, value, version);
                break;

            default:
                console.error("Add default behaviour");
        }

       // console.log(results);

        return results;
    };

    ComponentDropDownList.prototype.getYears = function (value) {
        var result = {"time": []};
        if (Object.prototype.toString.call(value) === '[object Array]') {
            for (var i = 0; i < value.length; i++) {
                result.time.push({from: parseInt(value[i], 10), to: parseInt(value[i], 10)})
            }
        } else {
            result.time.push({from: parseInt(value, 10), to: parseInt(value, 10)})
        }

        return result;
    };

    ComponentDropDownList.prototype.getCodelist = function (id, uid, value, version) {
        var result = {};
        result = {
            "codes": [
                {
                    uid: uid, codes: []
                }]
        };

        if (version) {
            result.codes[0].version = version;
        }

        if (Object.prototype.toString.call(value) === '[object Array]') {
            for (var i = 0; i < value.length; i++) {
                result.codes[0].codes.push(value[i])
            }
        } else {
            result.codes[0].codes.push(value);
        }

        return result
    };


    ComponentDropDownList.prototype.getHierarchyCodelist = function (id, uid, value, version, levels, level) {
        var result = {};
        result = {
            "codes": [
                {
                    uid: uid, codes: []
                }]
        };

        if (version) {
            result.codes[0].version = version;
        }

        if (levels) {
            result.codes[0].levels = levels;
        }

        if (level) {
            result.codes[0].level = level;
        }


        if (Object.prototype.toString.call(value) === '[object Array]') {
            for (var i = 0; i < value.length; i++) {
                result.codes[0].codes.push(value[i])
            }
        } else {
            result.codes[0].codes.push(value);
        }

        return result
    };

    ComponentDropDownList.prototype.deselectValue = function (obj) {
        //TODO deselect all values for multiselection
        var item = $(this.options.container).select2('getItemByValue', obj.value);
        $(this.options.container).select2('unselectItem', item);
    };

    ComponentDropDownList.prototype.refreshDomainByAdapter = function (filterModule) {
        if ((this.options.adapter != null) && (typeof this.options.adapter != "undefined")) {
            this.options.adapter(filterModule, $.proxy(this.setDomain, this), 3);
        }
    };

    ComponentDropDownList.prototype.bindEventListeners = function () {

        var that = this;

      //  document.body.addEventListener(this.options.events.DESELECT + this.options.module.type, function (e) {
      //      that.deselectValue(e.detail);
      //  }, false);

        this.$dropdownSelector.on("change", function (e) {
            var selectedItem = $(this).select2('data');

             if(selectedItem)
                amplify.publish(that.options.events.LIST_CHANGE + that.options.name, {value: $(this).val(), text: selectedItem.text,  name: that.options.name});

         }).change();



        this.$dropdownSelector.on("select2-removed", function (e) {
            console.log(that.options.events.LIST_RESET + that.options.name);
            amplify.publish(that.options.events.LIST_RESET + that.options.name);
        });
    };

    ComponentDropDownList.prototype.error = function (e) {
        console.log("Component drop down error: " + error);
    };

    return ComponentDropDownList;
});
