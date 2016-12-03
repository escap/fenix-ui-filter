define(function () {

    return {

        "coverageTime": {
            classNames: "row",
            "template": {
                "title": "Data collection period",
                "description": "Select the date on which data collection started and ended for this survey",
            },
            "format": {
                "output": "period"
            },
            selectors: {
                from: {
                    template : { title: "from" },
                    classNames: "col-xs-6",
                    selector: {
                        id: "time"
                    },
                    "constraints": {"presence": true}

                },
                to: {
                    template : { title: "to" },
                    classNames: "col-xs-6",
                    selector: {
                        id: "time"
                    },
                    "constraints": {"presence": true}
                }
            }

        },

        role: {

            template : {
                title : "This is the title",
                description : "This is the description",
                footer : "This is the footer"
            },

            enumeration: {
                uid: "ResponsiblePartyRole"
            },

            selector: {
                id: "dropdown",
                config: {
                    maxItems: 1
                }
            },

            format: {
                output: "label"
            }

        },

        specify: {

            selector: {
                id: "input",
                type: "text",
                source: [{"value": "specify", "label": "Specify"}],
                config: {
                    readonly: true
                }

            },

            format: {
                output: "label"
            },

            dependencies: {
                role: [{id: "readOnlyIfNotValue", event: "select", args: {value: "other"}}]
            }

        }
    }

});
