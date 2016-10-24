define([
    'loglevel',
    'jquery',
    'underscore',
    '../../config/errors',
    '../../config/events',
    '../../config/config'
], function (log, $, _, ERR, EVT, C) {

    'use strict';

    function Standard(obj) {

        $.extend(true, this, C, {initial: obj || {}, $el: $(obj.el)});

        this._initVariables();

        this._render();

        return this;
    }

    /**
     * disposition
     * @return {Object}
     */
    Standard.prototype.callPluginMethod = function (method, param1, param2) {

        return this.filter[method](param1, param2)
    };

    Standard.prototype._initVariables = function () {


        this.channels = {};
    };

    Standard.prototype._render = function () {

        this.filter = new this.initial.plugin({
            id: this.initial.id,
            data: this.initial.data,
            controller: this.initial.controller,
            lang: this.initial.lang,
            el : this.$el,
            template: this.initial.template,
            selector : this.initial.selector
        });
    };

    return Standard;

});