define(function () {

    return {

        "tree": {
            "cl": {"uid": "UNECA_ISO3"},
            "selector": {
                "id": "tree",
                "hideSummary": true,
                "lazy": true
            },
            "template": {
                "title": "Country",
                "hideSwitch": true
            },
            "format": {"dimension": "CountryCode"}
        },

        "dropdown": {
            "cl": {"uid": "UNECA_ISO3"},
            "selector": {
                "id": "dropdown",
                //hideButtons : false, //hide all buttons,
                //hideSelectAllButton: true, //Hide select all button
                //hideClearAllButton : true, //Hide clear all button
            },
            "template": {
                "title": "Country",
                "hideSwitch": true
            },
            "format": {"dimension": "CountryCode"}
        },

    }


});