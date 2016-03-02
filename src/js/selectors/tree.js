/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    'underscore',
    'fx-filter/config/errors',
    'fx-filter/config/events',
    'fx-filter/config/config',
    'fx-filter/config/config-default',
    'handlebars',
    'i18n!fx-filter/nls/filter',
    'text!fx-filter/html/selectors/tree.hbs',
    "amplify",
    'jstree'
], function ($, log, _, ERR, EVT, C, CD, Handlebars, i18n, template) {

    'use strict';

    var defaultOptions = {}, s = {
        SELECTORS_CLASS: ".fx-selector",
        TREE_CONTAINER: "[data-role='tree']",
        FILTER_CONTAINER: "[data-role='filter']",
        CLEAR_ALL_CONTAINER: "[data-role='clear']",
        SELECT_ALL_CONTAINER: "[data-role='select']",
        SUMMARY_CONTAINER: "[data-role='summary']",
        AMOUNT_CONTAINER: "[data-role='amount']",
        TEMPLATE_TREE: "[data-tree-template]",
        TEMPLATE_SUMMARY_ITEM: "[data-tree-summary-item]"
    };

    function Tree(o) {

        $.extend(true, this, defaultOptions, o);

        this.status = {};

        this._renderTemplate();

        this._initVariables();

        this._renderTree();

        return this;
    }

    /**
     * getValues method
     * Mandatory method
     */
    Tree.prototype.getValues = function () {

        var result = { values: [], labels: {}};

        var instance = this.tree.jstree(true),
            selection = instance.get_selected();

        //remove empty selection
        if (Array.isArray(selection) && selection.length > 0) {

            result.values = selection;

            _.each(result.values, function (c) {
                result.labels[c] = instance.get_node(c).text;
            });

        }

        return result;

    };

    /**
     * Reset method
     * Mandatory method
     */
    Tree.prototype.reset = function () {

        this.printDefaultSelection();

        log.info("Selector reset successfully");
    };

    /**
     * Disposition method
     * Mandatory method
     */
    Tree.prototype.dispose = function () {

        this._dispose();

        log.info("Selector disposed successfully");

    };

    /**
     * Enable selector
     * Mandatory method
     */
    Tree.prototype.enable = function () {

        var nodes,
            $container = this.$el;

        nodes = $container.find(s.TREE_CONTAINER).jstree(true).get_json(null, {flat: true});

        _.each(nodes, function (n) {
            $container.find(s.TREE_CONTAINER).jstree(true).enable_node(n);
        });

        //enable filter
        $container.find(s.CLEAR_ALL_CONTAINER).removeAttr("disabled");
        $container.find(s.SELECT_ALL_CONTAINER).removeAttr("disabled");

        //enable filter
        $container.find(s.FILTER_CONTAINER).removeAttr("disabled");

        this.status.disabled = false;

        log.info("Selector enabled : " + this.id);

    };

    /**
     * Disable selector
     * Mandatory method
     */
    Tree.prototype.disable = function () {

        var nodes,
            $container = this.$el;

        nodes = $container.find(s.TREE_CONTAINER).jstree(true).get_json(null, {flat: true});

        _.each(nodes, function (n) {
            $container.find(s.TREE_CONTAINER).jstree(true).disable_node(n);
        });

        //disable clear all btn
        $container.find(s.CLEAR_ALL_CONTAINER).attr("disabled", true);
        $container.find(s.SELECT_ALL_CONTAINER).attr("disabled", true);

        //disable filter
        $container.find(s.FILTER_CONTAINER).attr("disabled", true);

        this.status.disabled = true;

        log.info("Selector disabled : " + this.id);

    };

    /**
     * Return Tree internal status
     * return {Object} status
     */
    Tree.prototype.getStatus = function () {

        return this._getStatus();

    };

    /**
     * Set tree domain
     * return {Object} status
     */
    Tree.prototype.setDomain = function (data) {

        return this._setDomain(data);

    };

    Tree.prototype._renderTemplate = function () {

        var $el = this.$el.find(s.TREE_CONTAINER);

        if ($el.length === 0) {

            log.info("Injecting template for: " + this.id);
            var tmpl = Handlebars.compile($(template).find(s.TEMPLATE_TREE)[0].outerHTML);
            this.$el.append(tmpl($.extend(true, {}, i18n, this, this.selector)));
        }

    };

    Tree.prototype._initVariables = function () {

        this.$summaryItems = $();

    };

    Tree.prototype.printDefaultSelection = function () {

        return this._printDefaultSelection();

    };

    Tree.prototype._getStatus = function () {

       return this.status;

    };

    Tree.prototype._buildTreeModel = function (fxResource, parent, cl) {

        var data = [],
            selector = this,
            selectorConfig = selector.selector || {},
            blacklist = selectorConfig.blacklist || [],
            bl = blacklist.map(function (item) {
                return item.toString()
            });

        _.each(fxResource, _.bind(function (item) {

            if (!_.contains(bl, item.code.toString())) {

                data.push({
                    id: item.code,
                    text: item.title["EN"],
                    parent: parent || '#'
                });

                if (Array.isArray(item.children) && item.children.length > 0) {
                    data = _.union(data, this._buildTreeModel(item.children, item.code, cl));
                }

            } else {

                log.warn("code [" + item.code + "] excluded from " + this.id);
            }

        }, this));

        //order alphabetically
        data = data.sort(function (a, b) {
            if (a.text < b.text) return -1;
            if (a.text > b.text) return 1;
            return 0;
        });

        return data;
    };

    Tree.prototype._destroyTree = function () {

        this.dropdown.select2('destroy');

        log.info("Destroyed dropdown: " + this.id);
    };

    Tree.prototype._bindEventListeners = function () {

        this.tree

            //Default selection
            .on('ready.jstree', _.bind(function (e, data) {

                this.printDefaultSelection();

                amplify.publish(this._getEventName(EVT.SELECTOR_READY), this);

            }, this))

            .on("select_node.jstree ", _.bind(function (e, data) {

                if (!isNaN(this.selector.max) && data.selected.length > this.selector.max) {
                    data.instance.deselect_node(data.node);
                    log.warn("Max number of selectable item reached. Change 'selector.selector.max' config.");
                    return;
                }

                if (!data.instance.is_leaf(data.node)) {
                    data.instance.toggle_node(data.node);
                    data.instance.deselect_node(data.node, true);
                    return;
                }

                this._notifyTreeSelectionChange({
                    instance: data.instance,
                    id: this.id
                })

            }, this))

            .on("deselect_node.jstree ", _.bind(function (e, data) {

                this._notifyTreeSelectionChange({
                    instance: data.instance,
                    id: this.id
                })

            }, this));
    };

    Tree.prototype._unbindEventListeners = function () {

        this.tree.off();
    };

    Tree.prototype._dispose = function () {

        this._unbindEventListeners();

        this._destroyTree();

    };

    Tree.prototype._renderTree = function () {

        var config = this.selector,
            $container = this.$el,
            tree,
            self = this,
            data = this._buildTreeModel(this.data);

        tree = $container.find(s.TREE_CONTAINER).jstree($.extend(true, {}, {
            core: {
                multiple: true,
                data: data,
                themes: {
                    icons: false,
                    stripes: true
                }
            },
            plugins: ['search', 'wholerow', 'checkbox'],
            search: {
                show_only_matches: true
            }
        }, config.config));

        this.tree = tree;

        this._bindEventListeners();

        initBtns($container, this.id);

        initFilter($container);

        function initFilter($container) {

            var to = false;
            $container.find(s.FILTER_CONTAINER).on("keyup", function () {
                if (to) {
                    clearTimeout(to);
                }
                to = setTimeout(function () {
                    var v = $container.find(s.FILTER_CONTAINER).val();
                    $container.find(s.TREE_CONTAINER).jstree(true).search(v);
                }, 250);
            });

        }

        function initBtns($container, id) {

            $container.find(s.CLEAR_ALL_CONTAINER).on('click', function () {
                $container.find(s.TREE_CONTAINER).jstree("deselect_all", true);
                self._notifyTreeSelectionChange({
                    instance: self.tree.jstree(true),
                    id: id
                })
            });

            $container.find(s.SELECT_ALL_CONTAINER).on('click', function () {
                $container.find(s.TREE_CONTAINER).jstree("select_all", true);
                self._notifyTreeSelectionChange({
                    instance: self.tree.jstree(true),
                    id: id
                })
            });
        }

    };

    Tree.prototype._notifyTreeSelectionChange = function (o) {

        var payload = [],
            selected = o.instance.get_selected();

        _.each(selected, function (sel) {
            var node = o.instance.get_node(sel),
                label = {};

            label["EN"] = node.text;

            payload.push({code: node.id, label: label, parent: node.parent})
        });

        this._updateSummary();

        amplify.publish(this._getEventName(EVT.SELECTORS_ITEM_SELECT + "." + this.id), payload);
        amplify.publish(this._getEventName(EVT.SELECTORS_ITEM_SELECT));
    };

    Tree.prototype._updateSummary = function () {

        var values = this.getValues(),
            model = [],
            instance = this.tree.jstree(true);

        _.each(values.labels, function (val, key) {
            model.push({code: key, label: val});
        });

        //unbind click listener
        this.$summaryItems.each(function () {
            $(this).off();
        });

        var tmpl = Handlebars.compile($(template).find(s.TEMPLATE_SUMMARY_ITEM)[0].outerHTML);

        this.$summaryItems = $(tmpl({values: model}));

        //bind click listener
        this.$summaryItems.each(function () {
            var $this = $(this);
            $this.on("click", function () {
                instance.deselect_node($this.find("[data-code]").data("code"));
                $this.remove();
            });
        });

        this.$el.find(s.SUMMARY_CONTAINER).empty().append(this.$summaryItems);

    };

    Tree.prototype._setDomain = function (opts) {
        log.info("set tree domain");
        log.info(opts);

        var data = opts.data,
            model = [],
            $container = this.$el,
            tree;

        _.each(data, function (item) {
            model = _.unique(model.concat(item.children));
        });

        if ($container.length > 0 && Array.isArray(model)) {

            tree = $container.find(s.TREE_CONTAINER).jstree(true);
            tree.settings.core.data = this._buildTreeModel(model, null);
            tree.refresh(true);
            tree.redraw(true);

        } else {
            log.warn("Impossible to find container for: " + this.id);
        }
    };

    Tree.prototype._getEventName = function (evt) {

        return this.controller.id + evt;
    };

    Tree.prototype._printDefaultSelection = function () {

        var config = this.selector,
            tree = this.tree.jstree(true);

        if (config.default && Array.isArray(config.default) && $.isFunction(tree.select_node) && $.isFunction(tree.deselect_all)) {

            //clear current selection
            tree.deselect_all(true);

            _.each(config.default, function (k) {
                tree.select_node(k)
            });
        }

    };

    Tree.prototype._destroyTree = function () {

        var $container = this.$el;

        $container.find(s.TREE_CONTAINER).jstree("destroy");

        $container.find(s.FILTER_CONTAINER).off();

        $container.find(s.CLEAR_ALL_CONTAINER).off();

        log.info("Destroyed tree: " + this.id);
    };

    // dependency handler

    Tree.prototype._dep_parent = function (opts) {

        this.setDomain(opts);

    };

    return Tree;

});