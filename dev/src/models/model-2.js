define(function () {

    return {

        contact: {

            //incremental: true,

            selectors: {

                role: {

                    template: {
                        title: "This is the title",
                        description: "This is the description",
                        footer: "This is the footer"
                    },

                    enumeration: {
                        uid: "ResponsiblePartyRole"
                    },

                    selector: {
                        id: "tree",
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
                        id: "textarea",
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
            },

            template: {
                title: "Title"
            }
        }
    }
});
