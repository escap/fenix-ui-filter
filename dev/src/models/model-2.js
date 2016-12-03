define(function () {

    return {

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
