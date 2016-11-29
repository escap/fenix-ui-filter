define(function () {

    return {
        "DIMENSION0": {
            "selector": {"config": {}, "id": "tree", "from": 1970, "to": 2017, "hideSummary": true},
            "format": {"output": "time", "dimension": "DIMENSION0"},
            "template": {"title": "Year", "hideSwitch": true}
        },
        "DIMENSION1": {
            "distinct": {"uid": "D3S_3282308509609665355720826198320839709", "columnId": "DIMENSION1"},
            "selector": {"id": "tree", "hideSummary": true},
            "format": {"output": "code", "dimension": "DIMENSION1"},
            "template": {"title": "Indicator", "hideSwitch": true}
        },
        "DIMENSION2": {
            "distinct": {"uid": "D3S_3282308509609665355720826198320839709", "columnId": "DIMENSION2"},
            "selector": {"id": "tree", "hideSummary": true},
            "format": {"output": "code", "dimension": "DIMENSION2"},
            "template": {"title": "Administrative level 1", "hideSwitch": true}
        },
        "DIMENSION3": {
            "distinct": {"uid": "D3S_3282308509609665355720826198320839709", "columnId": "DIMENSION3"},
            "selector": {"id": "tree", "hideSummary": true},
            "format": {"output": "code", "dimension": "DIMENSION3"},
            "template": {"title": "Product", "hideSwitch": true}
        },
        "OTHER0": {
            "distinct": {"uid": "D3S_3282308509609665355720826198320839709", "columnId": "OTHER0"},
            "selector": {"id": "tree", "hideSummary": true},
            "format": {"output": "code", "dimension": "OTHER0"},
            "template": {"title": "Flag", "hideSwitch": true}
        },
        "OTHER1": {
            "distinct": {"uid": "D3S_3282308509609665355720826198320839709", "columnId": "OTHER1"},
            "selector": {"id": "tree", "hideSummary": true},
            "format": {"output": "code", "dimension": "OTHER1"},
            "template": {"title": "Unit", "hideSwitch": true}
        }
    }

});
