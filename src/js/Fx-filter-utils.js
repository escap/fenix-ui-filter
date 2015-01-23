define([
    "jquery"
], function ($) {

    var o = {},
        defaultOptions = {
            widget: {
                lang: 'EN'
            },

            events: {
                REMOVE_MODULE: "fx.filter.module.remove"
            },

            column_map_with_code_title: {},

            column_map_with_code: {},

            original_data: ''
        };

    function Fx_filter_utils() {

        $.extend(true, o, defaultOptions)
    }

    Fx_filter_utils.prototype.dataParser = function (selected_values) {
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

    Fx_filter_utils.prototype.createConfiguration = function (item) {

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

    Fx_filter_utils.prototype.filterData = function (filter, data){

        return data;
    };

    return new Fx_filter_utils();

});