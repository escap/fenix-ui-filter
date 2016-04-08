/*global define*/

define(function () {

    'use strict';

    return {

        "sort": {

            "selector": {
                "id": "sortable",
                "source": [
                    {"value": "sort_1", "label": "my sort fn 1", parent: 'group-1'},
                    {"value": "sort_2", "label": "my sort fn 2", parent: 'group-1'},
                    {"value": "sort_3", "label": "my sort fn 3"},
                    {"value": "sort_4", "label": "my sort fn 4"},
                    {"value": "sort_5", "label": "my sort fn 5"}
                ], // Static data
                "config": { //SortableJS configuration
                    //disabled: true,
                    "groups" : {
                        test: "Test"
                    }
                }
            },

            "template": {
                // "hideHeader": true
            },

            "className": "col-xs-12"

        }
    }

});