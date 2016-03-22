/*global define*/
define(function ( ) {

    'use strict';

    var prefix = "";

    return {

        MISSING_CONTAINER : prefix + "missing_container",
        MISSING_SUMMARY_CONTAINER : prefix + "missing_summary_container",
        MISSING_SELECTORS : prefix + "missing_selectors",
        INVALID_DATA : prefix + "invalid_data",
        READY_TIMEOUT: prefix + "ready_timeout",
        SUMMARY_MODEL_CREATION: prefix + "summary_model_creation",
        UNKNOWN_DEPENDENCY_EVENT: prefix + "unknown_dependency_event",
        UNKNOWN_DEPENDENCY_ID: prefix + "unknown_dependency_id",

        //Utils
        INVALID_FENIX_RESOURCE: prefix + "invalid_fenix_resource",
        INVALID_METADATA: prefix + "invalid_metadata",
        INVALID_DSD: prefix + "invalid_dsd",
        INVALID_COLUMNS: prefix + "invalid_dsd",
        INVALID_FENIX_COLUMN: prefix + "invalid_fenix_column",
        INVALID_COLUMN_DATATYPE : prefix + "invalid_column_datatype",
        UNKNOWN_FENIX_COLUMN_DATATYPE :prefix + "unknown_fenix_column_datatype",
    };
});
