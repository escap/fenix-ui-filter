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
        adapter : null,

        events: {
            REMOVE_MODULE: "fx.catalog.module.remove",
            READY : "fx.filter.component.ready",
            DESELECT: 'fx.filter.module.deselect.'
        }
    };

    function Fx_ui_w_enumeration(optionsDefault) {
        alert("In enumeration ")
        if (this.options === undefined) {this.options = {}; }

        $.extend(true, this.options, o, optionsDefault);
        console.log(this)
    }

    Fx_ui_w_enumeration.prototype.render = function (e, container) {

        var self = this;

        self.options.module = e;

        this.$treeContainer = $('<div class="jstree-holder"></div>');

        this.$searchForm = $('<form onSubmit="return false"><input type="search" data-role="search" class="form-control"  /></form>');

        this.$container = $(container);

        this.$container.append(this.$searchForm);

        this.$container.append(this.$treeContainer);

        this.$treeContainer.jstree({

            'core': {
                'data': function (node, cb) {
                    if (node.id === "#") {
                        self.getFirstCall(e, cb);
                    }
                },
                "multiple": false,
                "animation": 0,
                "themes": {"stripes": true}
            },
            "plugins": ["checkbox", "wholerow", "search"],
            "search": {
                show_only_matches: true
            }
        });

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

            alert("In enumeration "+self.options.module.name )
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

    Fx_ui_w_enumeration.prototype.validate = function (e) {

        if (!e.hasOwnProperty("source")) {

            throw new Error("ELEM_NOT_SOURCE");
        }

        return true;
    };

    Fx_ui_w_enumeration.prototype.processData = function (data) {

        var r = [],
            keys = Object.keys(data);

        $(keys).each(function (index, item) {
            r.push({"text": data[item].EN, "id": item, "children": false});
        });

        return r;
    };

    Fx_ui_w_enumeration.prototype.getFirstCall = function (o, cb) {

        var self = this;

        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: (C.SERVICE_BASE_ADDRESS || DC.SERVICE_BASE_ADDRESS) + "/choices/" +  o.component.source.uid,
            dataType: "json",
            success: function (data) {

                if (data) {
                    cb(self.processData(data));
                }

            },
            error: function () {
                alert("Fx_ui_w_enumeration error: impossible to load codelist");
            }
        });
    };

    Fx_ui_w_enumeration.prototype.bindEventListeners = function () {

        var that = this;

        amplify.subscribe(E.MODULE_DESELECT + '.' + that.options.module.name, function (e) {

            that.deselectValue(e);
        });

    };

    //For filter logic .... start
    Fx_ui_w_enumeration.prototype.getName = function() {
        return this.options.name;
    };

    Fx_ui_w_enumeration.prototype.getAdapter = function() {
        return this.options.adapter;
    };
    //For filter logic .... end

    Fx_ui_w_enumeration.prototype.deselectValue = function (obj) {

        this.$treeContainer.jstree('deselect_node', [obj.value]);

        this.$treeContainer.jstree(true).deselect_node([obj.value]);
    };

    Fx_ui_w_enumeration.prototype.getValues = function (e) {

        console.log("ENUMERATION .... getValues")
        var codes = $("#" + this.options.componentid).find('.jstree-holder').jstree(true).get_selected();

        return {enumeration : codes};


    };

    return Fx_ui_w_enumeration;
});