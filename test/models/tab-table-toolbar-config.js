/*global define*/

define(function () {

    'use strict';

    return {

        "aggregation": {

            "selector": {
                "id": "dropdown",
                "source": [
                    {"value": "aggregation_1", "label": "my aggregation fn 1"},
                    {"value": "aggregation_2", "label": "my aggregation fn 2"},
                    {"value": "aggregation_3", "label": "my aggregation fn 3"},
                    {"value": "aggregation_4", "label": "my aggregation fn 4"},
                    {"value": "aggregation_5", "label": "my aggregation fn 5"}
                ], // Static data
                "config": { //Selectize configuration
                    "maxItems": 1
                }
            },

            "className" : "col-xs-6"

        },

        "decimal_separator": {

            "selector": {
                "id": "input",
                "type": "radio",
                "source": [
                    {"value": "dot", "label": "Dot"},
                    {"value": "comma", "label": "Comma"}

                ]
            },

            "className" : "col-xs-6"

        },

        "thousand": {

            "selector": {
                "id": "input",
                "type": "radio",
                "source": [
                    {"value": "enable", "label": "Enable"},
                    {"value": "disable", "label": "Disable"}

                ]
            },

            "className" : "col-xs-6"

        },

        "decimal_digit": {

            "selector": {
                "id": "input",
                "type": "number"
            },

            "className" : "col-xs-6"

        }
    }

});