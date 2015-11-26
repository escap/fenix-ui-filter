/*global define*/
define([
    "jquery",
    "underscore",
    "fx-filter/config/config",
    "fx-filter/config/config-default",
    "q"
], function ($, _, C, DC, Q) {

    'use strict';

    var defaultConfig = {
        D3S_CODELIST_URL:( C.SERVICE_BASE_ADDRESS || DC.SERVICE_BASE_ADDRESS) + "/resources/uid/" ,
        D3S_METADATA_URL: ( C.SERVICE_BASE_ADDRESS || DC.SERVICE_BASE_ADDRESS) + "/resources/uid/" ,
        D3S_FILTER_CODES : ( C.SERVICE_BASE_ADDRESS || DC.SERVICE_BASE_ADDRESS) + "/codes/filter",
        lang: "EN"
    };

    function Fx_filter_utils(o) {

        this.o = $.extend(true, {}, defaultConfig, o);

        this.current = {};

        this.cl = {};

        this.clCodes = {};

        this.distinct = {};
    }

    Fx_filter_utils.prototype.getConfiguration = function (conf) {

        if (!Array.isArray(conf)) {
            console.error("filter configuration is not an array");
            return;
        }

        this.current.old = $.extend(true, {}, conf);

        this.current.result = [];

        return this._preloadResources();

    };

    Fx_filter_utils.prototype._preloadResources = function () {

        return this._preloadCodelists()
            .then(_.bind(this._preloadMetadata, this))
            .then(_.bind(this._createConfiguration, this));
    };

    Fx_filter_utils.prototype._preloadCodelists = function () {

        var cd = [];

        _.each(this.current.old, _.bind(function (c) {

            if (c.type === "codelist") {
                cd.push(this._createCodelistPromise(c));
            }

            if (c.type === "codelist-codes") {
                cd.push(this._createCodelistCodesPromise(c));
            }

        }, this));

        return Q.all(cd);
    };

    Fx_filter_utils.prototype._createCodelistPromise = function (c) {

        var self = this,
            cd_uid = c.components[0].uid;

        return Q($.ajax({
            url: this.o.D3S_CODELIST_URL + cd_uid
        })).then(function (result) {
            self.cl[cd_uid] = result;
        }, function (r) {
            console.error(r);
        });
    };

    Fx_filter_utils.prototype._createCodelistCodesPromise = function (c) {

        var self = this,
            cd_uid = c.components[0].uid;

        console.log(this.o.D3S_FILTER_CODES)

        return Q($.ajax({
            url: this.o.D3S_FILTER_CODES,
            type: "POST",
            contentType: "application/json",
            data : JSON.stringify( c.components[0].config.filter),
            dataType: 'json'
        })).then(function (result) {

            if (typeof result === 'undefined') {
                console.log("No Code List loaded for: " + cd_uid);
            }

            self.clCodes[cd_uid] = result[0].children;

        }, function (r) {

            console.error(r);
        });
    };

    Fx_filter_utils.prototype._preloadMetadata = function () {

        var cd = [];

        _.each(this.current.old, _.bind(function (c) {

            if (c.type === "distinct") {
                cd.push(this._createDistinctPromise(c));
            }

        }, this));

        return Q.all(cd);
    };

    Fx_filter_utils.prototype._createDistinctPromise = function (c) {

        var self = this,
            cd_uid = c.uid,
            name = c.components[0].name;

        return Q($.ajax({
            url: this.o.D3S_METADATA_URL + cd_uid + "?language=" + this.o.lang + "&dsd=true"
        })).then(function (result) {
            self.distinct[name] = result;
        }, function (r) {
            console.error(r);
        });
    };

    Fx_filter_utils.prototype._processSingleConfiguration = function (c) {

        switch (c.type) {
            case 'static' :
                this._processStaticConfiguration(c);
                break;
            case 'codelist' :
                this._processCodelistConfiguration(c);
                break;
            case 'distinct' :
                this._processDistinctConfiguration(c);
                break;
            case 'codelist-codes' :
                this._processCodelistCodesConfiguration(c);
                break;
            default :
                console.warn("configuration type [" + c.type + "] not found for: (static is applied)");
                console.warn(c);
                this._processStaticConfiguration(c);
                break;
        }
    };

    Fx_filter_utils.prototype._processStaticConfiguration = function (c) {

        this.current.result.push(c);

    };

    Fx_filter_utils.prototype._processCodelistConfiguration = function (conf) {

        var uid = conf.components[0].uid,
            codelist = this.cl[uid],
            data = codelist.data,
            result = [],
            self = this;

        _.each(data, function (d) {
            result.push({"value": d.code, "label": d.title[self.o.lang], "selected": self._checkDefaultCodes(conf, d.code)});
        });

        function compare(a, b) {
            if (a.label < b.label)
                return -1;
            if (a.label > b.label)
                return 1;
            return 0;
        }

        result.sort(compare);

        conf.components[0].config.defaultsource = conf.components[0].config.defaultsource.concat(result);
        conf.components[0].config.id = codelist.id;

        this.current.result.push(conf);

    };

    Fx_filter_utils.prototype._processCodelistCodesConfiguration = function (conf) {

        var uid = conf.components[0].uid,
            data = this.clCodes[uid],
            result = [],
            self = this;

        _.each(data, function (d) {
            result.push({"value": d.code, "label": d.title[self.o.lang], "selected": self._checkDefaultCodes(conf, d.code)});
        });

        function compare(a, b) {
            if (a.label < b.label)
                return -1;
            if (a.label > b.label)
                return 1;
            return 0;
        }

        result.sort(compare);

        conf.components[0].config.defaultsource = conf.components[0].config.defaultsource.concat(result);

        this.current.result.push(conf);

    };

    Fx_filter_utils.prototype._checkDefaultCodes = function(conf, code) {
        if (conf.hasOwnProperty("defaultCodes") && conf.defaultCodes.length > 0) {
            return (conf.defaultCodes.indexOf(code) > -1)
        }
        return false;
    };

    Fx_filter_utils.prototype._processDistinctConfiguration = function (conf) {

        var name = conf.components[0].name,
            columnCodeId = conf.column,
            columnLabelId = conf.column + "_" + this.o.lang.toUpperCase(),
            distinct = this.distinct[name],
            columns = distinct.metadata.dsd.columns,
            data = distinct.data,
            result = [],
            columnCodeIndex = null,
            columnLabelIndex = null,
            self = this;

        _.each(columns, function (d, index) {
            if (d.id === columnCodeId) {
                columnCodeIndex = index;
            }
            if (d.id === columnLabelId) {
                columnLabelIndex = index;
            }
        });

        // this is used by the getValues to return a readable FENIX result
        conf.components[0].config.id = columns[columnCodeIndex].id;
        conf.components[0].config.uid = columns[columnCodeIndex].domain.codes[0].idCodeList;

        var code2Label = {};
        _.each(data, function (d) {
            if (d[columnCodeIndex] && d[columnLabelIndex]) {
                code2Label[d[columnCodeIndex]] = d[columnLabelIndex];
            } else {
                //console.warn("Maybe there are some problem with the data, please check [" + d[columnCodeIndex] + "] [" + d[columnLabelIndex] + "]")
            }
        });

        _.each(code2Label, function (label, code) {
            result.push({"value": code, "label": label, "selected": self._checkDefaultCodes(conf, code)});
        });

        function compare(a, b) {
            if (a.label < b.label)
                return -1;
            if (a.label > b.label)
                return 1;
            return 0;
        }

        result.sort(compare);

        conf.components[0].config.defaultsource = conf.components[0].config.defaultsource.concat(result);

        this.current.result.push(conf);
    };

    Fx_filter_utils.prototype._createConfiguration = function () {

        _.each(this.current.old, _.bind(this._processSingleConfiguration, this));

        return this.current.result;

    };

    return Fx_filter_utils;

});