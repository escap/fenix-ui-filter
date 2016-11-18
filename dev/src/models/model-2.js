define(function () {


    return {

        "metadataCompletenessRate": {
            "selector": {
                "id": "time",
                source : [{value: "1", label : "FIRST"}]
            },
            constraints : {
                presence : true
            },
            "format": {
                "output": "string"
            },
            "template": {
                "title": "Metadata completeness rate",
                "description": "The percentage of completeness of metadata offers a numerical evaluation of the extent to which the resource is documented.",
            }
        }
    }


});
