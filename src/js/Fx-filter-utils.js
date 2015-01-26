define([
    "jquery",
    "text!fx-filter/config/fx_filter_base_config.json"
], function ($, baseConfig) {

    var defaultOptions = {
        lang: 'EN',

        events: {
            REMOVE_MODULE: "fx.filter.module.remove"
        },

        column_map_with_code_title: {},

        column_map_with_code: {},

        original_data: ''
    };

    function Fx_filter_utils(opts) {

        this.o = $.extend(true, {}, defaultOptions, opts);

        this.baseConfig = JSON.parse(baseConfig);

        if (!this.baseConfig.hasOwnProperty('containers')) {
            throw new Error('FENIX Filter: base config does not contain containers attribute');
        }

        if (!this.baseConfig.hasOwnProperty('components')) {
            throw new Error('FENIX Filter: base config does not contain components attribute');
        }

    }

    Fx_filter_utils.prototype.createConfiguration = function (item) {

        this.finalConfig = [];

        if (!item.hasOwnProperty('metadata')) {
            throw new Error('FENIX resource does not container metadata');
        }

        if (!item.metadata.hasOwnProperty('dsd')) {
            throw new Error('FENIX resource does not container DSD');
        }

        if (!item.metadata.dsd.hasOwnProperty('columns')) {
            throw new Error('DSD does not container columns');
        }

        return this.compileConfiguration(item);
    };

    Fx_filter_utils.prototype.compileConfiguration = function (item) {

        var columns = item.metadata.dsd.columns,
            dimension;

        for (var i = 0; i < columns.length; i++) {

            //Enter only if column has values (No Value Column considered)
            if (columns[i].hasOwnProperty('values')) {
                dimension = this.compileDimension(columns[i]);

                if (dimension !== false) {
                    this.finalConfig.push(dimension);
                }
            }
        }

        return this.finalConfig;

    };

    Fx_filter_utils.prototype.compileDimension = function (column) {

        //Use this to choose the right base configuration
        var temp = "temp";
        switch (temp) {
            default:
                return this.compileBaseContainer(column);
                break;
        }
    };

    Fx_filter_utils.prototype.compileBaseContainer = function (column) {

        var component;

        if (!this.baseConfig.containers.hasOwnProperty('baseContainer')) {
            throw new Error('FENIX Filter: base config does not contain "baseContainer" configuration')
        }

        var _config = $.extend(true, {}, this.baseConfig.containers.baseContainer);
        _config.title = column.title[this.o.lang];
        component = this.compileComponent(column);

        if (component !== false) {
            _config.components.push(component);

        }
        return !component ? component : _config;
    };

    Fx_filter_utils.prototype.compileComponent = function (column) {

        //Use this to choose the right base configuration
        var temp = "temp";

        switch (temp) {
            default:
                return this.compileListComponent(column);
                break;
        }

    };

    Fx_filter_utils.prototype.compileListComponent = function (column) {

        if (!this.baseConfig.components.hasOwnProperty('list')) {
            throw new Error('FENIX Filter: base config does not contain "list" component')
        }

        var _config = this.baseConfig.components.list,
            values = column.values,
            source = [], valid = true;

        _config.title = column.title;
        _config.name = column.id;

        if ((values != null) && (typeof values != 'undefined')) {

            if (column.dataType == 'code') {
                var values_code_type = values.codes[0].codes;

                if (values_code_type.length > 1) {
                    for (var iValue = 0; iValue < values_code_type.length; iValue++) {
                        if (values_code_type[iValue].code && values_code_type[iValue].label) {
                            source.push({
                                value: values_code_type[iValue].code.toString(),
                                label: values_code_type[iValue].label[this.o.lang].toString()
                            })
                        } else {
                            console.log(values_code_type[iValue].code + 'does not contain a valid label and it can not be filtered')
                        }
                    }
                } else {
                    valid = false
                }
            }
            //if column is time
            else {
                var values_code_type = values.timeList;

                if (values_code_type.length > 1) {
                    for (var iValue = 0; iValue < values_code_type.length; iValue++) {
                        source.push({
                            value: values_code_type[iValue].toString(),
                            label: values_code_type[iValue].toString()
                        });
                    }
                } else {
                    valid = false
                }
            }
        }
        else {
            //Virtual column or Value column.... Ignore
        }

        _config.source = source;

        return valid ? $.extend(true, {}, _config) : valid;

    };

    Fx_filter_utils.prototype.filterData = function (item, filter, exclusive) {

        if (!item.hasOwnProperty('data')) {
            throw new Error('FENIX resource does not contain data');
        }

        if (!item.hasOwnProperty('metadata')) {
            throw new Error('FENIX resource does not contain metadata');
        }

        if (!item.metadata.hasOwnProperty('dsd')) {
            throw new Error('FENIX resource does not contain dsd');
        }

        if (exclusive === true) {
            return this.filterExclusiveData(item, filter);
        } else {
            return this.filterInclusiveData(item, filter);
        }

    };

    Fx_filter_utils.prototype.filterExclusiveData = function (item, filter) {

        var data = item.data.slice(0),
            filterToIndex,
            result = [];

        filterToIndex = this.createFilterToIndex(item.metadata.dsd, filter);

        for (var i = 0; i < data.length; i++) {
            var row = this.filterExclusiveRow(data[i], filterToIndex);
            if (row !== false) {
                result.push(row)
            }
        }

        item.data = result;

        return item;

    };

    Fx_filter_utils.prototype.filterExclusiveRow = function (row, filter) {

        var valid = false;

        for (var i = 0; i < row.length; i++) {

            if (filter.hasOwnProperty('filter' + i)) {
                if (this.toBeFilteredExclusive(filter['filter' + i], row[i])) {
                    valid = true
                }
            }
        }

        return valid ? row : valid;
    };

    Fx_filter_utils.prototype.toBeFilteredExclusive = function (filter, cell) {

        var valid = true;

        for (var i = 0; i < filter.length; i++) {
            if (filter[i].code.toString() === cell.toString()) {
                valid = false;
            }
        }

        return valid;
    };

    Fx_filter_utils.prototype.filterInclusiveData = function (item, filter) {

        var data = item.data.slice(0),
            filterToIndex,
            result = [];

        filterToIndex = this.createFilterToIndex(item.metadata.dsd, filter);

        for (var i = 0; i < data.length; i++) {
            var row = this.filterInclusiveRow(data[i], filterToIndex);
            if (row !== false) {
                result.push(row)
            }
        }

        item.data = result;

        return item;
    };

    Fx_filter_utils.prototype.filterInclusiveRow = function (row, filter) {

        var valid = true;

        for (var i = 0; i < row.length; i++) {

            if (filter.hasOwnProperty('filter' + i)) {{
                if (!this.toBeFilteredInclusive(filter['filter' + i], row[i]))
                    valid = false
                }
            }
        }

        return valid ? row : valid;
    };

    Fx_filter_utils.prototype.toBeFilteredInclusive = function (filter, cell) {

        var valid = false;

        /*If the component has not selected values*/
        if (filter.length === 0) {
            return true;
        }

        for (var i = 0; i < filter.length; i++) {
            if (filter[i].code.toString() === cell.toString()) {
                valid = true;
            }
        }

        return valid;
    };

    Fx_filter_utils.prototype.createFilterToIndex = function (dsd, filter) {

        if (!dsd.hasOwnProperty('columns')) {
            throw new Error('FENIX resource does not contain columns');
        }

        var result = {},
            cols = dsd.columns;

        for (var i = 0; i < cols.length; i++) {

            if (filter.hasOwnProperty(cols[i].id)) {
                result['filter' + i] = filter[cols[i].id];
            }
        }

        return result;
    };


    //to check if needed

    Fx_filter_utils.prototype.dataParser = function (item, selected_values) {

        this.original_data = item;

        if ((selected_values != null) && (typeof selected_values != 'undefined')) {

            if ((this.original_data != null) && (typeof this.original_data != 'undefined')) {
                var dataCopy = {};
                $.extend(true, dataCopy, this.original_data);
                var columns = dataCopy.metadata.dsd.columns;
                var data = dataCopy.data;
                var mapColIdToIndex = {};
                var mapIndexToColId = {};
                for (var iCol = 0; iCol < columns.length; iCol++) {
                    var key = '' + columns[iCol].dataType + '_' + columns[iCol].id;
                    if ((selected_values[key] != null) && (selected_values[key] != 'undefined') && (selected_values[key].length > 0)) {
                        mapColIdToIndex['' + columns[iCol].id] = '' + iCol;
                        mapIndexToColId['' + iCol] = key;
                    }
                }

                var mapIndexToColId_keySet = Object.keys(mapIndexToColId);
                var criteriaCount = mapIndexToColId_keySet.length;
                for (var iData = (data.length - 1); iData >= 0; iData--) {

                    var valid = false;
                    criteriaCount = mapIndexToColId_keySet.length;
                    for (var iDataCol = 0; iDataCol < data[iData].length; iDataCol++) {
                        if ($.inArray('' + iDataCol, mapIndexToColId_keySet) != -1) {
                            //The column is in the filter
                            var filter_id = mapIndexToColId['' + iDataCol];
                            var elem_array = selected_values[filter_id];
                            for (var iElem = 0; iElem < elem_array.length; iElem++) {
                                if (data[iData][iDataCol] == elem_array[iElem].code.code) {
                                    criteriaCount--;
                                    if (criteriaCount == 0) {
                                        valid = true;
                                    }
                                    break;
                                }
                            }
                        }
                    }

                    if (valid == false) {
                        //Remove the record
                        data.splice(iData, 1);
                    }
                }
                return dataCopy;
            }
        }
    };
    Fx_filter_utils.prototype.createItem = function (item) {

        this.original_data = item;
        if ((item.metadata.dsd.columns != null) && (typeof item.metadata.dsd.columns != "undefined")) {
            var values = '';
            for (var iCol = 0; iCol < item.metadata.dsd.columns.length; iCol++) {
                //Values contains the distinct of the values of each column
                values = item.metadata.dsd.columns[iCol].values;
                if ((values != null) && (typeof values != 'undefined')) {
                    if (item.metadata.dsd.columns[iCol].dataType == 'code') {
                        var values_code_type = values.codes[0].codes;
                        var code_label_map = {};
                        if (values_code_type.length > 1) {
                            for (var iValue = 0; iValue < values_code_type.length; iValue++) {

                                code_label_map[values_code_type[iValue].code] = values_code_type[iValue].label['EN'];
                            }
                            o.column_map_with_code_title[item.metadata.dsd.columns[iCol].id] = code_label_map;
                        }
                    }
                    else {
                        var values_code_type = values.timeList;
                        var code_label_map = {};
                        if (values_code_type.length > 1) {
                            for (var iValue = 0; iValue < values_code_type.length; iValue++) {

                                code_label_map['' + values_code_type[iValue]] = '' + values_code_type[iValue];
                            }
                            o.column_map_with_code[item.metadata.dsd.columns[iCol].id] = code_label_map;
                        }
                    }
                }
                else {
                    //Virtual column or Value column.... Ignore
                }
            }
            var filter_empty = true;
            modules = [];
            var filter_items = Object.keys(o.column_map_with_code_title).length + Object.keys(o.column_map_with_code).length;

            var mapCodeTitleKeys = Object.keys(o.column_map_with_code_title);
            for (var i = 0; i < mapCodeTitleKeys.length; i++) {
                module = {"module": "code", "label": {"EN": mapCodeTitleKeys[i]}, "id": mapCodeTitleKeys[i]};
                this.addItem(module);
                filter_empty = false;
            }

            mapCodeTitleKeys = Object.keys(o.column_map_with_code);
            for (var i = 0; i < mapCodeTitleKeys.length; i++) {
                module = {"module": "year", "label": {"EN": mapCodeTitleKeys[i]}, "id": mapCodeTitleKeys[i]};
                this.addItem(module);
                filter_empty = false;
            }
            if (filter_empty) {
                $(o.container).trigger('filter_empty');
            }
        }
    };

    Fx_filter_utils.prototype.createConfiguration_OLD = function (item) {

        var result = [],
            module;

        this.original_data = item;
        if ((item.metadata.dsd.columns != null) && (typeof item.metadata.dsd.columns != "undefined")) {
            var values = '';
            for (var iCol = 0; iCol < item.metadata.dsd.columns.length; iCol++) {
                //Values contains the distinct of the values of each column
                values = item.metadata.dsd.columns[iCol].values;
                if ((values != null) && (typeof values != 'undefined')) {
                    if (item.metadata.dsd.columns[iCol].dataType == 'code') {
                        var values_code_type = values.codes[0].codes;
                        var code_label_map = {};
                        if (values_code_type.length > 1) {
                            for (var iValue = 0; iValue < values_code_type.length; iValue++) {

                                if (values_code_type[iValue].label) {
                                    code_label_map[values_code_type[iValue].code] = values_code_type[iValue].label['EN'];
                                }

                            }
                            o.column_map_with_code_title[item.metadata.dsd.columns[iCol].id] = code_label_map;
                        }
                    }
                    else {
                        var values_code_type = values.timeList;
                        var code_label_map = {};
                        if (values_code_type.length > 1) {
                            for (var iValue = 0; iValue < values_code_type.length; iValue++) {

                                code_label_map['' + values_code_type[iValue]] = '' + values_code_type[iValue];
                            }
                            o.column_map_with_code[item.metadata.dsd.columns[iCol].id] = code_label_map;
                        }
                    }
                }
                else {
                    //Virtual column or Value column.... Ignore
                }
            }
            var filter_empty = true;

            var filter_items = Object.keys(o.column_map_with_code_title).length + Object.keys(o.column_map_with_code).length;

            var mapCodeTitleKeys = Object.keys(o.column_map_with_code_title);
            for (var i = 0; i < mapCodeTitleKeys.length; i++) {
                module = {"module": "code", "label": {"EN": mapCodeTitleKeys[i]}, "id": mapCodeTitleKeys[i]};
                result.push(module);
                filter_empty = false;
            }

            mapCodeTitleKeys = Object.keys(o.column_map_with_code);
            for (var i = 0; i < mapCodeTitleKeys.length; i++) {
                module = {"module": "year", "label": {"EN": mapCodeTitleKeys[i]}, "id": mapCodeTitleKeys[i]};
                result.push(module);
                filter_empty = false;
            }
            if (filter_empty) {
                $(o.container).trigger('filter_empty');
            }
        }

        return result;
    };

    //end to check if needed

    return new Fx_filter_utils();

});