/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'loglevel',
    'fx-filter/config/errors',
    'fx-filter/config/events',
    'fx-filter/config/config',
    'fx-filter/config/config-default',
    'moment',
    'amplify'
], function ($, _, log, ERR, EVT, C, CD, Moment) {

    'use strict';

    var opts = {
        forbiddenSubjects: ["value"],
        exclude: [], //exclude id
        common: {},
        lang: 'EN',
        //timeLabelFormat : "L" //MomentJS format
    };

    function Utils() {
        log.info("FENIX filter utils");

        $.extend(true, this, opts, CD, C);

        return this;
    }

    /**
     * Creates a FENIX filter configuration from a
     * FENIX resource
     * @param {Object} o
     * @return {Object} filter configuration
     */
    Utils.prototype.createConfiguration = function (o) {
        log.info("Create filter configuration from:");
        log.info(o);

        $.extend(true, this, o);

        var configuration = {};

        if (this._isFenixResource(o.model) === true) {
            log.info("Valid resource");

            _.each(o.model.metadata.dsd.columns, _.bind(function (c) {

                if (!_.contains(this.forbiddenSubjects, c.subject) && !_.contains(this.exclude, c.id) && !c.id.endsWith("_" + this.lang.toUpperCase())) {
                    configuration[c.id] = $.extend(true, {}, this._processFxColumn(c), this.common);
                } else {
                    log.warn(c.id + " was excluded. [id: " + c.id + ", subject: " + c.subject + "]");
                }

            }, this));

        } else {
            log.error(ERR.INVALID_FENIX_RESOURCE);
        }

        return configuration;
    };

    /**
     * Merges a FENIX filter configuration with
     * default values
     * @param {Object} config
     * @param {Object} sync
     * @return {Object} filter configuration
     */
    Utils.prototype.mergeConfigurations = function (config, sync) {

        if (sync.toolbar) {

            var values = sync.toolbar.values;

            _.each(values, _.bind(function (obj, key) {
                if (config.hasOwnProperty(key)) {
                    config[key].selector.default = values[key];
                }

            }, this));
        }

        return config;

    };

    // private fns

    Utils.prototype._processFxColumn = function (c) {

        var conf = {};

        if (this._isFenixColumn(c) === true) {
            log.info("Valid column with dataType: " + c.dataType.toLowerCase() + " [column.id = " + c.id + " ]");

            switch (c.dataType.toLowerCase()) {
                case "customcode" :
                    conf = this._processCustomCodeColumn(c);
                    break;
                case "enumeration" :
                    conf = this._processEnumerationColumn(c);
                    break;
                case "code" :
                    conf = this._processCodeColumn(c);
                    break;
                case "date" :
                    conf = this._processDateColumn(c);
                    break;
                case "month" :
                    conf = this._processMonthColumn(c);
                    break;
                case "year" :
                    conf = this._processYearColumn(c);
                    break;
                case "time" :
                    conf = this._processTimeColumn(c);
                    break;
                case "text" :
                    conf = this._processTextColumn(c);
                    break;
                case "label" :
                    conf = this._processLabelColumn(c);
                    break;
                case "number" :
                    conf = this._processNumberColumn(c);
                    break;
                case "percentage" :
                    conf = this._processPercentageColumn(c);
                    break;
                case "bool" :
                    conf = this._processBooleanColumn(c);
                    break;
                default:
                    log.error(ERR.UNKNOWN_FENIX_COLUMN_DATATYPE, c.dataType.toLowerCase());

            }
        } else {
            log.error(ERR.INVALID_FENIX_COLUMN);
        }

        return $.extend(true, {}, conf, this._commonProcessColumn(c));
    };

    /* processes for CODE FX column */

    Utils.prototype._processCustomCodeColumn = function (c) {
        //return this._configTreeFromSource(c);
        return this._configDropdownFromSource(c);
    };

    Utils.prototype._processEnumerationColumn = function (c) {

        var config = {},
            domain = c.domain || {},
            enumeration = domain.enumeration || [];

        //configure selector
        //html selector configuration
        config.selector = {};
        config.selector.id = "dropdown";
        config.selector.source = _.map(enumeration, function (obj) {
            return {
                value: obj,
                label: obj
            }
        });

        return config;
    };

    Utils.prototype._processCodeColumn = function (c) {

        //return this._configTreeFromCodelist(c);
        return this._configDropdownFromCodelist(c);

    };

    /* processes for TIME FX column */

    Utils.prototype._processDateColumn = function (c) {

        var domain = c.domain || {},
            period = domain.period,
            timelist = domain.timeList;

        if (period && period.from && period.to) {
            //return this._configRangeFromPeriod(c);
            return this._configTimeFromPeriod(c);
            //return this._configDropdownFromPeriod(c);
        }

        if (timelist) {
            return this._configDropdownFromTimelist(c);
        }

        log.warn("Impossible to find process for column " + c.id);

        return {};

    };

    Utils.prototype._processMonthColumn = function (c) {

        return this._configTemporalColumn(c);
    };

    Utils.prototype._processYearColumn = function (c) {

        return this._configTemporalColumn(c);
    };

    Utils.prototype._processTimeColumn = function (c) {

        return this._configTemporalColumn(c);

    };

    /* processes for TEXT FX column */

    Utils.prototype._processTextColumn = function (c) {

        return this._configInput(c, {type: "text"});
    };

    Utils.prototype._processLabelColumn = function (c) {

        return this._configInput(c, {type: "text"});
    };

    /* processes for OTHER FX column */

    Utils.prototype._processNumberColumn = function (c) {
        log.warn("TODO process");
    };

    Utils.prototype._processPercentageColumn = function (c) {
        log.warn("TODO process");
    };

    Utils.prototype._processBooleanColumn = function (c) {
        log.warn("TODO process");
    };

    /* Common processes */

    Utils.prototype._commonProcessColumn = function (c) {

        var config = {
            template: {},
            format : {
                dimension : c.id
            }
        };

        if (c.title && c.title[this.lang.toUpperCase()]) {
            config.template.title = c.title[this.lang.toUpperCase()];
        }

        return config;
    };

    Utils.prototype._configTreeFromCodelist = function (c) {

        var config = {},
            domain = c.domain || {},
            codes = domain.codes,
            cl;

        if (!Array.isArray(codes) || codes.length > 1) {
            log.warn("Invalid domain.codes attributes");
        }

        cl = codes[0];

        if (!cl.idCodeList) {
            log.error("Impossible to find idCodeList");
        }

        //configure code list
        config.cl = {};
        config.cl.uid = cl.idCodeList;
        config.cl.version = cl.version;

        //configure selector
        //html selector configuration
        config.selector = {};
        config.selector.id = "tree";

        return config;

    };

    Utils.prototype._configTreeFromSource = function (c) {

        var config = {},
            domain = c.domain || {},
            codes = domain.codes,
            cl;

        if (!Array.isArray(codes) || codes.length > 1) {
            log.warn("Invalid domain.codes attributes");
        }

        cl = codes[0];

        if (!cl.codes) {
            log.error("Impossible to find codes");
        }

        //configure selector
        //html selector configuration
        config.selector = {};
        config.selector.id = "tree";
        config.selector.source = _.map(cl.codes, _.bind(function (obj) {
            return {
                value: obj.code,
                label: obj.label[this.lang.toUpperCase()]
            }
        }, this));

        return config;

    };

    Utils.prototype._configDropdownFromPeriod = function (c) {

        var config = {},
            domain = c.domain || {},
            period = domain.period;

        //configure selector
        //html selector configuration
        config.selector = {};
        config.selector.id = "dropdown";
        config.selector.from = period.from;
        config.selector.to = period.to;

        return config;

    };

    Utils.prototype._configDropdownFromTimelist = function (c) {

        var config = {},
            domain = c.domain || {},
            timelist = domain.timeList || [],
            format = this._getTimeFormat(timelist[0]);

        //configure selector
        config.selector = {};
        config.selector.id = "dropdown";
        config.selector.source = _.map(timelist, _.bind(function (obj) {
            return {
                value: obj,
                label: new Moment(obj, format).format(this._getTimeLabelFormat(obj))
            }
        }, this));

        return config;

    };

    Utils.prototype._configDropdownFromSource = function (c) {

        var config = {},
            domain = c.domain || {},
            codes = domain.codes,
            cl;

        if (!Array.isArray(codes) || codes.length > 1) {
            log.warn("Invalid domain.codes attributes");
        }

        cl = codes[0];

        if (!cl.codes) {
            log.error("Impossible to find codes");
        }

        //configure selector
        //html selector configuration
        config.selector = {};
        config.selector.id = "dropdown";
        config.selector.source = _.map(cl.codes, _.bind(function (obj) {
            return {
                value: obj.code,
                label: obj.label[this.lang.toUpperCase()]
            }
        }, this));

        return config;

    };

    Utils.prototype._configDropdownFromCodelist = function (c) {

        var config = {},
            domain = c.domain || {},
            codes = domain.codes,
            cl;

        if (!Array.isArray(codes) || codes.length > 1) {
            log.warn("Invalid domain.codes attributes");
        }

        cl = codes[0];

        if (!cl.idCodeList) {
            log.error("Impossible to find idCodeList");
        }

        //configure code list
        config.cl = {};
        config.cl.uid = cl.idCodeList;
        config.cl.version = cl.version;

        //configure selector
        //html selector configuration
        config.selector = {};
        config.selector.id = "dropdown";

        return config;

    };

    Utils.prototype._configTimeFromPeriod = function (c) {

        var config = {},
            domain = c.domain || {},
            period = domain.period,
            from = String(period.from),
            to = String(period.to),
        //from = String(period.from).substring(0, String(period.from).length - 2),
        //to = String(period.to).substring(0, String(period.to).length - 2),
            format = this._getTimeFormat(from);

        //configure selector
        config.selector = {
            config: {}
        };
        config.selector.id = "time";
        config.selector.config.minDate = new Moment(from, format);
        config.selector.config.maxDate = new Moment(to, format);
        config.selector.config.format = this._getTimeLabelFormat(from);

        if (from.length < 5) {
            config.selector.config.viewMode = "years";
        }

        return config;
    };

    Utils.prototype._configRangeFromPeriod = function (c) {

        var config = {},
            domain = c.domain || {},
            period = domain.period;

        //configure selector
        config.selector = {
            config: {}
        };

        config.selector.id = "range";
        config.selector.config.min = period.from;
        config.selector.config.max = period.to;
        config.selector.config.type = "double";
        config.selector.config.prettify_enabled = false;

        return config;

    };

    Utils.prototype._configInput = function (c, o) {

        var config = {
            selector: {}
        };

        config.selector.id = "input";
        config.selector.type = o.type || "text";

        return config;
    };

    Utils.prototype._configTemporalColumn = function (c) {

        var domain = c.domain || {},
            period = domain.period,
            timelist = domain.timeList;

        if (period && period.from && period.to) {
            //return this._configRangeFromPeriod(c);
            return this._configTimeFromPeriod(c);
            //return this._configDropdownFromPeriod(c);
        }

        if (timelist) {
            return this._configDropdownFromTimelist(c);
        }

        //Default set year range
        log.warn("Column " + c.id + " set with default time period range.");

        c.domain = {
            period: {
                from: C.DEFAULT_PERIOD_FROM || CD.DEFAULT_PERIOD_FROM,
                to: C.DEFAULT_PERIOD_TO || CD.DEFAULT_PERIOD_TO
            }
        };

        return this._configTimeFromPeriod(c);
    };

    Utils.prototype._getTimeFormat = function (s) {

        var format;

        switch (String(s).length) {
            case 4 :
                format = "YYYY";
                break;
            case 6:
                format = "YYYY MM";
                break;
            case 8:
                format = "YYYY MM DD";
                break;
            case 12:
                format = "YYYY MM DD hh mm";
                break;
            case 14:
                format = "YYYY MM DD hh mm ss";
                break;
            default:
                log.warn("Impossible to find time format for: " + format);
        }

        return format;

    };

    Utils.prototype._getTimeLabelFormat = function (s) {

        if (this.timeLabelFormat) {
            return this.timeLabelFormat;
        }

        var format;

        switch (String(s).length) {
            case 4 :
                format = "YYYY";
                break;
            case 6:
                format = "L";
                break;
            case 8:
                format = "L";
                break;
            case 14:
                format = "lll";
                break;
            default:
                log.warn("Impossible to find time label format for: " + format);
        }

        return format;

    };

 /*   /!* Revert Process *!/
    /!**
     * Extracts a blank selection from FENIX process
     * default values
     * @param {Object} filter
     * @return {Object} filter configuration
     *!/
    Utils.prototype.revertProcess = function (filter) {

        var configuration = {};

        if (Array.isArray(filter)) {

            _.each(filter, _.bind(function ( step ) {

                var fn = "_revert_" + step.name;

                if ( $.isFunction(this[fn]) && step.parameters) {
                    configuration[step.name] = $.extend(true, this[fn](step));
                } else {
                    log.error(fn + " is not a valid reverse function");
                }

            }, this));
        }

        return configuration;

    };

    Utils.prototype._revert_filter = function (step) {
        log.info("_revert_filter " + JSON.stringify(step));

        var self = this,
            result = {},
            parameters = step.parameters,
            rows = parameters.rows,
            columns = parameters.columns;

        _.each(rows, function ( obj , key) {

            if ( obj.time ) {
                result[key] = self._revert_time_row(obj);
            } else {
                result[key] = self._revert_codes_row(obj);
            }

        });

        return result;
    };

    Utils.prototype._revert_time_row = function ( step ) {

        console.log(step)

    };

    Utils.prototype._revert_codes_row = function ( step ) {

        console.log(step)


    };

    Utils.prototype._revert_group = function (step) {
        log.info("_revert_group " + JSON.stringify(step));


        return;
    };

    Utils.prototype._revert_order = function (step) {
        log.info("_revert_order " + JSON.stringify(step));

        return;
    };
*/
    /* Validation */

    Utils.prototype._isFenixResource = function (res) {

        var valid = true,
            errors = [];

        if (!res.hasOwnProperty("metadata")) {
            errors.push({code: ERR.INVALID_METADATA});
            valid = false;
        }

        if (valid && !res.metadata.hasOwnProperty("dsd")) {
            errors.push({code: ERR.INVALID_DSD});
        }

        if (valid && (!res.metadata.dsd.hasOwnProperty("columns") || !Array.isArray(res.metadata.dsd.columns))) {
            errors.push({code: ERR.INVALID_COLUMNS});
        }

        return errors.length > 0 ? errors : valid;
    };

    Utils.prototype._isFenixColumn = function (c) {

        var valid = true,
            errors = [];

        if (!c.hasOwnProperty("dataType")) {
            errors.push({code: ERR.INVALID_COLUMN_DATATYPE});
            valid = false;
        }

        return errors.length > 0 ? errors : valid;
    };

    return new Utils();
});