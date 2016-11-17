define(function () {


    return {
        "format": {
            "selector": {
                "id": "dropdown",
                "source": [
                    {"value": "localstring", "label": "Local String"}, {
                    "value": "value",
                    "label": "Raw Value"
                }],
                "config": {"maxItems": 1},
                "default": ["localstring"]
            }, "template": {"title": "Format"}
        },
        "decimals": {
            "selector": {
                "id": "dropdown",
                "source": [{"value": "0", "label": 0}, {"value": "1", "label": 1}, {
                    "value": "2",
                    "label": 2
                }, {"value": "3", "label": 3}, {"value": "4", "label": 4}, {"value": "5", "label": 5}],
                "config": {"maxItems": 1},
                "default": [2]
            }, "template": {"title": "Décimales"}, "className": "testDec"
        },
        "show": {
            "selector": {"id": "input", "type": "checkbox", "source": [{"value": "code", "label": "Code"}]},
            "template": {"title": "Montrer"}
        },
        "dimensionsSort": {
            "selector": {
                "id": "sortable",
                "source": [{"value": "OTHER0", "label": "unit", "parent": "aggregations"}, {
                    "value": "DIMENSION1_FR",
                    "label": "DIMENSION1_FR",
                    "parent": "aggregations"
                }, {
                    "value": "DIMENSION2_FR",
                    "label": "DIMENSION2_FR",
                    "parent": "aggregations"
                }, {
                    "value": "OTHER0_FR",
                    "label": "OTHER0_FR",
                    "parent": "aggregations"
                }, {"parent": "aggregations"}, {
                    "value": "OTHER1_FR",
                    "label": "OTHER1_FR",
                    "parent": "aggregations"
                }, {"value": "DIMENSION0", "label": "DIMENSION0", "parent": "columns"}, {
                    "value": "DIMENSION1",
                    "label": "DIMENSION1",
                    "parent": "rows"
                }, {"value": "DIMENSION2", "label": "DIMENSION2", "parent": "rows"}, {
                    "value": "VALUE0",
                    "label": "value",
                    "parent": "values"
                }],
                "config": {
                    "groups": {
                        "rows": "Lignes",
                        "columns": "Colonnes",
                        "hidden": "Caché",
                        "aggregations": "Agrégations",
                        "values": "Valeurs"
                    }
                }
            }, "template": {"hideSwitch": true, "hideRemoveButton": true, "title": "Ordre des dimensions"}
        },
        "aggregatorValue": {
            "selector": {
                "id": "dropdown",
                "source": [{"value": "sum", "label": "Sum"}, {"value": "avg", "label": "avg"}, {
                    "value": "median",
                    "label": "median"
                }, {"value": "stdev", "label": "stdev"}, {"value": "count", "label": "count"}, {
                    "value": "concat",
                    "label": "concat"
                }],
                "config": {"maxItems": 1},
                "default": ["sum"]
            }, "template": {}
        }
    }


});
