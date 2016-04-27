/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    'underscore',
    'text!fx-filter/html/selectors/sortable.hbs',
    'fx-filter/config/errors',
    'fx-filter/config/events',
    'fx-filter/config/config',
    'fx-filter/config/config-default',
    'handlebars',
    'sortable',
    "amplify"
], function ($, log, _, templates, ERR, EVT, C, CD, Handlebars, SortableJS) {

    'use strict';

    var defaultOptions = {
            checkableInputs: ["radio", "checkbox"],
            itemRender : function ( params ) {
                return this._itemRender(params);
            }
        },
        s = {
            TEMPLATE_LIST: "[data-sortable-list]",
            TEMPLATE_ITEM: "[data-sortable-item]"
        };

    function Sortable(o) {

        var self = this;

        $.extend(true, this, defaultOptions, o);

        this._initVariables();

        this.printDefaultSelection();

        //force async execution
        window.setTimeout(function () {

            self.status.ready = true;

            amplify.publish(self._getEventName(EVT.SELECTOR_READY), self);
        }, 0);

        return this;
    }

    /**
     * getValues method
     * Mandatory method
     */
    Sortable.prototype.getValues = function () {

        var result = {
            values: [],
            labels: {}
        };

        _.each(this.groups, _.bind(function (obj, name) {

            var instance = obj.instance,
                values = instance.toArray();

            _.each(values, _.bind(function (item) {

                var label =  this.$el.find(s.TEMPLATE_LIST).filter('[data-group="' + name + '"]')
                    .find(s.TEMPLATE_ITEM).filter('[data-id="' + item + '"]').text().trim();

                result.values.push({
                    value: item,
                    parent: name,
                    label : label
                });

                result.labels[item] = label;

            }, this));

        }, this));

        return result;

    };

    /**
     * Reset method
     * Mandatory method
     */
    Sortable.prototype.reset = function () {

        this.dispose();

        this.printDefaultSelection();

        log.info("Selector reset successfully");

    };

    /**
     * Disposition method
     * Mandatory method
     */
    Sortable.prototype.dispose = function () {

        this._dispose();

        log.info("Selector disposed successfully");

    };

    /**
     * Enable selector
     * Mandatory method
     */
    Sortable.prototype.enable = function () {

        this.status.disabled = false;

        _.each(this.groups, _.bind(function (obj) {

            var instance = obj.instance;
            instance.option('disabled', this.status.disabled);

        }, this));

        log.info("Selector enabled : " + this.id);

    };

    /**
     * Disable selector
     * Mandatory method
     */
    Sortable.prototype.disable = function () {

        this.status.disabled = true;

        _.each(this.groups, _.bind(function (obj) {

            var instance = obj.instance;
            instance.option('disabled', this.status.disabled);

        }, this));

        log.info("Selector disabled : " + this.id);

    };

    /**
     * Return internal status
     * return {Object} status
     */
    Sortable.prototype.getStatus = function () {

        return this._getStatus();
    };

    /**
     * Print print selection
     * return {Object} status
     */
    Sortable.prototype.printDefaultSelection = function () {

        return this._printDefaultSelection();
    };

    /**
     * Unset the given value.
     * return {null}
     */
    Sortable.prototype.unsetValue = function (v, silent) {
        log.info("Unset input value: " + v);

        if (this.status.disabled !== true) {
            this._setValue(v, silent);
        } else {
            log.warn("Selector is disabled. Impossible to unset input value: " + v);
        }

    };

    /**
     * Resets the selected items to the given value.
     * return {null}
     */
    Sortable.prototype.setValue = function (v) {
        log.info("Set input value: " + JSON.stringify(v));

        if (this.status.disabled !== true) {
            this._setValue(v);
        } else {
            log.warn("Selector is disabled. Impossible to unset input value: " + v);
        }

    };

    Sortable.prototype._setValue = function (v, silent) {

        this.silentMode = silent;

        this._destroyInstances();

        this.$el.find('li').remove();

        this._parseInput(v);

        this._renderGroups();

    };

    Sortable.prototype._parseInput = function (source) {

        this.groups = {};

        //Add predefined groups

        if (this.selector && this.selector.hasOwnProperty('config') && this.selector.config.hasOwnProperty('groups')) {
            _.each(this.selector.config.groups, _.bind(function (label, g) {

                this.groups[g] = {
                    items: [],
                    label: label
                };

            }, this));
        }

        _.each(source || this.selector.source, _.bind(function (obj) {

            window.fx_filter_sortable_id >= 0 ? window.fx_filter_sortable_id++ : window.fx_filter_sortable_id = 0;

            var g = obj.parent || 'default-group',
                label = obj.parentLabel || 'Group ' + window.fx_filter_sortable_id;

            if (!this.groups.hasOwnProperty(g)) {
                this.groups[g] = {
                    items: [],
                    label: label
                };
            }

            this.groups[g].items.push(obj);

        }, this));

    };

    Sortable.prototype._renderGroups = function (v) {

        var self = this,
            groupsObjs = v || this.groups,
            groups = Object.keys(this.groups),
            group,
            $list,
            item = $(templates).find(s.TEMPLATE_ITEM)[0].outerHTML,
            list = $(templates).find(s.TEMPLATE_LIST)[0].outerHTML;

        //loop over groups
        _.each(groups, _.bind(function (name) {

            $list = this.$el.find(s.TEMPLATE_LIST).filter('[data-group="' + name + '"]');

            if ($list.length === 0) {
                log.info("Injecting sortable list");

                var tmplGroup = Handlebars.compile(list),
                    m = {
                        group: name,
                        label: groupsObjs[name].label
                    },
                    $group = $(tmplGroup(m));

                this.$el.append($group);

                $list = $group;
            }

            group = groupsObjs[name];

            //Render items
            //loop over groups' items
            _.each(group.items, _.bind(function (i) {

                var tmpl = Handlebars.compile(item),
                    $content = this.itemRender.call(this, i),
                    $li = $(tmpl(i));

                $li.html($content);

                $list = $list.find('ul').length > 0 ? $list.find('ul') : $list;
                $list.append($li);

                //log.info("Create input item: " + JSON.stringify(i));

            }, this));

            $list = $list.find('ul').length > 0 ? $list.find('ul') : $list;

            //cache instance
            group.instance = SortableJS.create($list[0],
                $.extend(true, {
                    group: {name: name, pull: true, put: groups},
                    sort: true,  // sorting inside list
                    delay: 0, // time in milliseconds to define when the sorting should start
                    disabled: this.status.disabled, // Disables the sortable if set to true.
                    animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
                    //handle: ".fx-sort-handle",  // Drag handle selector within list items
                    //filter: ".fx-sort-elements",  // Selectors that do not lead to dragging (String or Function)
                    //draggable: ".fx-sort-item",  // Specifies which items inside the element should be sortable
                    //ghostClass: "fx-sort-sortable-ghost",  // Class name for the drop placeholder
                    //chosenClass: "fx-sort-sortable-chosen" // Class name for the chosen item
                    // Called by any change to the list (add / update / remove)
                    onSort: _.bind(function (evt) {

                        var $itemEl = $(evt.item); // dragged HTMLElement

                        if (this.status.ready === true) {

                            //workaround for silent change
                            if (this.silentMode !== true) {

                                amplify.publish(self._getEventName(EVT.SELECTORS_ITEM_SELECT + self.id), {
                                    value: $itemEl.data('id'),
                                    label: $itemEl.text(),
                                    parent: name
                                });

                                amplify.publish(self._getEventName(EVT.SELECTORS_ITEM_SELECT));
                            }
                            delete this.silentMode;

                        }

                    }, this)
                }, this.selector.config));

        }, this));

    };

    Sortable.prototype._itemRender = function ( model ) {

        return model.label || "Missing label";

    };

    Sortable.prototype._getStatus = function () {

        return this.status;
    };

    Sortable.prototype._initVariables = function () {

        //Init status
        this.status = {};
        this.status.disabled = this.selector.disabled;

        if (this.selector.hasOwnProperty("config") && $.isFunction(this.selector.config.itemRender)) {
            this.itemRender = this.selector.config.itemRender;
        }

    };

    Sortable.prototype._printDefaultSelection = function () {

        this._parseInput(this.selector.default || this.selector.source);

        this._renderGroups();

    };

    Sortable.prototype._getEventName = function (evt) {

        return this.controller.id + evt;
    };

    Sortable.prototype._destroyInstances = function () {

        _.each(this.groups, _.bind(function (obj) {

            var instance = obj.instance;
            instance.destroy();

        }));

    };

    Sortable.prototype._unbindEventListeners = function () {

    };

    Sortable.prototype._dispose = function () {

        this._unbindEventListeners();

        this._destroyInstances();

        //Empty lists
        var $list;

        _.each(this.groups, _.bind(function (obj, name) {

            $list = this.$el.find(s.TEMPLATE_LIST).filter('[data-group="' + name + '"]');
            $list.empty();

        }, this));

    };

    // dependency handler

    Sortable.prototype._dep_ensure_unset = function (opts) {

        log.warn('TODO implement: Sortable selector from FENIX filter');
    };

    return Sortable;

});