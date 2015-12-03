Fenix Filter
=======

#Configuration example

```
 {
    "type": "distinct",
    "uid": "FLUDE_TOPIC_1",
    "column": "indicator",
    "containerType": "baseContainer",
    "class" : "myCustomClass myOtherClass",
    "title": "Indicator",
    "defaultCodes": ["Forest"],
    "components": [
        {
            "type": "codelist",
            "componentType": "dropDownList-FENIX",
            "lang": "EN",
            "uid" : "FLUDE_INDICATORS",
            "title": {"EN": "Distinct"},
            // name is the ID output in tehe filter getValues()
            "name": "indicator",
            "config": {
                "onlyValueText" : true,
                "defaultsource": []
            }

        }
    ]
}

```