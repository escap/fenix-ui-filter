/*global define*/

define(function () {

    'use strict';

    return {

        "from": {

            "selector": {
                "id": "dropdown",
                //"source" : [ {"value" : "myvalue", "label" : "my custom label"} ], // Static data
                "from": 2000,
                "to": 2014,
                "config": { //Selectize configuration
                    "maxItems": 1
                }
            },

            "format": {
                "type": "static",
                "output" : "time",
                //"process": '{"year": { "time":[{"from": "{{year-from}}", "to": "{{year-to}}" } ]}}'
            },

            "template": {
                "hideSwitch": true
            }
        },

        "to": {

            "selector": {
                "id": "dropdown",
                "from": 2000,
                "to": 2014,
                "default": [2014],
                "config": { //Selectize configuration
                    "maxItems": 1
                }
            },

            "format": {
                "type": "static",
                "output" : "time"
                //, "process": '{"year": { "time":[{"from": "{{year-from}}", "to": "{{year-to}}" } ]}}' //Not used
            },

            "dependencies": {
                "from": {id: "min", event: "select"}
            },

            "template": {
                "hideSwitch": true
            }

        }
    }

});