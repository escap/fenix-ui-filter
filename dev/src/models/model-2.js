/*global define*/

define(function () {

    'use strict';

    return {

        coverageTime: {
            selector: {
                id: "range",
                format: "DD/MM/YYYY",
                config: {
                    type: "double"
                }

            },
            template: {
                "title": "Coverage period",
                "description": "Information about the time period for which data are available. It requests to report the time window of reference (reporting the starting date and the ending date) even if it presents some lacks.",

            }
        },
/*
        input: {
            selector: {
                id: "input",
                type: "text",
                source: [{value: "Label", label: "e.g. John Smith"}]
            },
            template: {
                title: "Name",
                description : "My custom description"
            }
        },

        contact: {

            className: "well",

            semantic: false,

            incremental: true,

            selectors: {
                name: {
                    selector: {
                        id: "input",
                        type: "text",
                        source: [{value: "Label", label: "e.g. John Smith"}]
                    },
                    template: {
                        title: "Name"
                    }
                },
                role: {
                    selector: {
                        id: "dropdown",
                        source: [{label: "Project Manager", value: "item_1"}, {label: "Data Owner", value: "item_2"}],
                        default: "item_1",
                        config: {
                            maxItems: 1
                        }
                    },
                    template: {
                        title: "Role",
                        description : "The function assumed or part played by a person or thing in a particular situation."
                    }
                }
            },

            template: {
                hideHeader: false,
                title: "Contact"
            }
        }*/
    }

});