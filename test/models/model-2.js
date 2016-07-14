/*global define*/

define(function () {

    'use strict';

    return {

        "Year": {
            "selector": {
                "config": {}, "id": "tree", "from": 1960, "to": 2016,
                hideSummary : true},
            "format": {"output": "time", "dimension": "Year"},
            "template": {"title": "Year"}
        }
    }


});