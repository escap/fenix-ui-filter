/*global define, amplify, alert*/

define([
    "jquery",
    "fx-filter/config/config",
    "fx-filter/config/config-default",
    "fx-filter/config/events",
    "jstree",
    "amplify"
], function ($, C, DC, E) {

    'use strict';

    var o = {
        lang: 'EN',
        //For filter logic .... start
        componentType : '',
        componentid : '',
        name : '',
        title : '',
        grid : '',
        source :'',
        defaultsource : '',
        adapter : null,

        sourceType : {
            timelist : 'timeList',
            period : 'period'
        },

        events: {
            REMOVE_MODULE: "fx.filter.module.remove",
            READY : "fx.filter.component.ready",
            DESELECT: 'fx.filter.module.deselect.'
        }
        //For filter logic .... end
    };

    function Fx_ui_w_list(optionsDefault) {

        if (this.options === undefined) {this.options = {}; }

        $.extend(true, this.options, o, optionsDefault);
    }

    Fx_ui_w_list.prototype.render = function (e, container) {

        var self = this;

        self.options.container = container;

        self.options.module = e;

        this.$treeContainer = $('<div class="jstree-holder"></div>');

        this.$searchForm = $('<form onSubmit="return false"><input type="search" data-role="search" class="form-control"  /></form>');

        this.$container = $(container);

        this.$container.append(this.$searchForm).append(this.$treeContainer);

        if ((e.component.hasOwnProperty("defaultsource"))) {

            this.$treeContainer.jstree({

                'core': {
                    'data': function (node, cb) {
                        cb(self.processData(e.component.sourceType, e.component.defaultsource))
                    },
                    "multiple": true,
                    "animation": 0,
                    "themes": {"stripes": true}
                },
                "plugins": ["checkbox", "wholerow", "search"],
                "search": {
                    show_only_matches: true
                }
            });
        }

        var to = false;

        this.$searchForm.find('[data-role="search"]').keyup(function () {

            if (to) {
                clearTimeout(to);
            }

            to = setTimeout(function () {
                var v = self.$searchForm.find('[data-role="search"]').val();
                self.$treeContainer.jstree(true).search(v);
            }, 250);
        });

        this.$treeContainer.on("changed.jstree", function (e, data) {

            var i, j, r = [];

            for (i = 0, j = data.selected.length; i < j; i++) {

                r.push({
                    label: data.instance.get_node(data.selected[i]).text,
                    value: data.instance.get_node(data.selected[i])
                });
            }

            amplify.publish(E.MODULE_READY,
                {
                    value: r,
                    id: self.options.module.name,
                    label :  self.options.module.title.EN
                });
        });

        this.$searchForm.find('.sel_all').on('click', function () {
            self.$treeContainer.jstree(true).select_all();
        });

        this.$searchForm.find('.desel_all').on('click', function () {
            self.$treeContainer.jstree(true).deselect_all();
        });

        this.bindEventListeners();

        if((e.adapter!=null)&&(typeof e.adapter!="undefined")){
            self.options.adapter = e.adapter;
        }

        self.options.name = e.name;
        self.options.componentid = $(container).attr("id");
        //Raise an event to show that the component has been rendered
        $(container).trigger(self.options.events.READY, {name: e.name});

    };

    Fx_ui_w_list.prototype.validate = function (e) {

        if ((e.component.hasOwnProperty("sourceType"))&&(e.component.hasOwnProperty("defaultsource"))) {
            return true;
        }
        else{
            throw new Error("ELEM_NOT_SOURCE");
        }

        return true;
    };

    Fx_ui_w_list.prototype.processData = function (dataType, data) {

        var r = [];
        if(dataType == o.sourceType.timelist){
            //Array of years
            data.sort(function (a, b) {
                if (a < b)
                    return -1;
                if (a> b)
                    return 1;
                return 0;
            });

            $(data).each(function (index, item) {
                r.push({"text": ""+item, "id": item, "children": false});
            });
        }
        else if(dataType == o.sourceType.period){
            //Array of json object {from: to}
            $(data).each(function (index, item) {
                var start_year = item.from;
                var end_year = item.to;
                var iYear=0;
                if(start_year<=end_year){
                    for(iYear=start_year; iYear<=end_year; iYear++){
                        r.push({"text": ""+iYear, "id": iYear, "children": false});
                    }
                }
            });
        }

        return r;
    };

    Fx_ui_w_list.prototype.bindEventListeners = function () {

        var that = this;

        amplify.subscribe(E.MODULE_DESELECT + '.' + that.options.module.name, function (e) {

            that.deselectValue(e);
        });

    };

    Fx_ui_w_list.prototype.deselectValue = function (obj) {

        this.$treeContainer.jstree('deselect_node', [obj.value]);

        this.$treeContainer.jstree(true).deselect_node([obj.value]);

    };

    //For filter logic .... start
    Fx_ui_w_list.prototype.getName = function() {
        return this.options.name;
    };

    Fx_ui_w_list.prototype.getAdapter = function() {
        return this.options.adapter;
    };
    //For filter logic .... end

    Fx_ui_w_list.prototype.getValues = function (e) {

        var results = [];
        var codes = $("#" + this.options.componentid).find('.jstree-holder').jstree(true).get_selected()
        $(codes).each(function (index, item) {
            var from_year = item;
            var to_year = item;
            var year=parseInt(item,10);
            results.push({from : year, to : year});
        });

        if(results.length<=0){
            return null;
        }
        return {
            "time" : results
        };
    };

    return Fx_ui_w_list;
});