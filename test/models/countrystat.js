define(function () {

    return {
        "countrycode": {
            "cl": {"uid": "GAUL0", "version": "2014"},
            "selector": {"id": "tree", "hideSummary": true},
            "template": {"title": "Country Code", "hideSwitch": true},
            "format": {"dimension": "countrycode"}
        },
        "citycode": {
            "cl": {"uid": "crowd_cities"},
            "selector": {"id": "tree", "hideSummary": true},
            "template": {"title": "City code", "hideSwitch": true},
            "format": {"dimension": "citycode"}
        },
        "marketcode": {
            "cl": {"uid": "crowd_markets"},
            "selector": {"id": "tree", "hideSummary": true},
            "template": {"title": "Market code", "hideSwitch": true},
            "format": {"dimension": "marketcode"}
        },
        "vendorcode": {
            "cl": {"uid": "crowd_vendors"},
            "selector": {"id": "tree", "hideSummary": true},
            "template": {"title": "Vendor code", "hideSwitch": true},
            "format": {"dimension": "vendorcode"}
        },
        "unitcode": {
            "cl": {"uid": "crowd_units"},
            "selector": {"id": "tree", "hideSummary": true},
            "template": {"title": "Unit Code", "hideSwitch": true},
            "format": {"dimension": "unitcode"}
        },
        "currencycode": {
            "cl": {"uid": "crowd_currencies"},
            "selector": {"id": "tree", "hideSummary": true},
            "template": {"title": "Currency Code", "hideSwitch": true},
            "format": {"dimension": "currencycode"}
        },
        "commoditycode": {
            "cl": {"uid": "crowd_commodities"},
            "selector": {"id": "tree", "hideSummary": true},
            "template": {"title": "Commodity Code", "hideSwitch": true},
            "format": {"dimension": "commoditycode"}
        },
        "date": {
            "selector": {"config": {}, "id": "tree", "from": 20130101, "to": 20170101, "hideSummary": true},
            "format": {"output": "time", "dimension": "date"},
            "template": {"title": "Date", "hideSwitch": true}
        },
        "quantity": {
            "selector": {"id": "input", "type": "number", "hideSummary": true},
            "format": {"output": "enumeration", "dimension": "quantity"},
            "template": {"title": "Quantity", "hideSwitch": true}
        }
    }

});