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

    var forbiddenSubjects = ["value"];

    function Utils() {
        log.info("FENIX filter utils");

        $.extend(true, this, CD, C);

        return this;
    }

    Utils.prototype.createConfiguration = function (o) {
        log.info("Create filter configuration from:");
        log.info(o);

        var configuration = {};

        if (this._isFenixResource(o.model) === true) {
            log.info("Valid resource");

            _.each(o.model.metadata.dsd.columns, _.bind(function (c) {

                if (!_.contains(forbiddenSubjects, c.subject)) {
                    configuration[c.id] = this._processFxColumn(c);
                } else {
                    log.warn(c.id + " was excluded because subject: " + c.subject);
                }

            }, this));

        } else {
            log.error(ERR.INVALID_FENIX_RESOURCE);
        }

        return configuration;
    };

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
                case "day" :
                    conf = this._processDayColumn(c);
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
        return this._configTreeFromSource(c);
    };

    Utils.prototype._processEnumerationColumn = function (c) {

        var config = {},
            domain = c.domain || {},
            enumeration = domain.enumeration || [];

        //configure selector
        //html selector configuration
        config.selector = {};
        config.selector.id = "tree";
        config.selector.source = _.map(enumeration, function (obj) {
            return {
                value: obj,
                label: obj
            }
        });

        return config;
    };

    Utils.prototype._processCodeColumn = function (c) {

        return this._configTreeFromCodelist(c);

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

    Utils.prototype._processDayColumn = function (c) {
        log.warn("TODO process");
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

    /* Common process */

    Utils.prototype._commonProcessColumn = function (c) {

        var config = {
            template: {}
        };

        if (c.title && c.title['EN']) {
            config.template.title = c.title.EN;
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
        config.selector.source = _.map(cl.codes, function (obj) {
            return {
                value: obj.code,
                label: obj.label
            }
        });

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
        config.selector.source = _.map(timelist, function (obj) {
            return {
                value: obj,
                label: new Moment(obj, format).format(format)
            }
        });

        return config;

    };

    Utils.prototype._configTimeFromPeriod = function (c, opts) {

        var config = {},
            domain = c.domain || {},
            period = domain.period,
            from = String(period.from),
            to = String(period.to),
            format =  this._getTimeFormat(from);

        //configure selector
        config.selector = {
            config: {}
        };
        config.selector.id = "time";
        config.selector.config.minDate = new Moment(from, format);
        config.selector.config.maxDate = new Moment(to, format);
        config.selector.config.format = format;

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

        log.warn("Impossible to find process for column " + c.id);

        return {};
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
            default:
                log.warn("Impossible to find time format for: " + format);
        }

        return format;

    };

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