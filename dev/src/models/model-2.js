define(function () {

/*    return {

        time: {

            //incremental : true,

            //initialAmount : 1,

            template: {
                title: "Time"
            },

            selectors: {

                from: {
                    classNames: "col-xs-6",
                    selector: {
                        id: "time"
                    },
                    template: {
                        title: "From"
                    },
                    constraints: {"presence": true}

                },

                to: {
                    classNames: "col-xs-6",
                    selector: {
                        id: "time"
                    },
                    template: {
                        title: "To"
                    },
                    constraints: {"presence": true}
                }
            }

        }

    };*/


    return {

        country: {
            cl: {
                uid: "GAUL0",
                version: "2014"
            },
            selector: {
                id: "tree",
                hideSummary : true
            },

            template: {
                title: "Country"
            }
        },

        time: {
            selector: {
                id: "range",
                config: {
                    min: 1983,
                    max: new Date().getFullYear(),
                    type: "double",
                    grid: true,
                    force_edges: true,
                    prettify: function (num) {
                        return num;
                    }
                }
            },
            template: {
                title: "Time"
            },
            dependencies: {
                country: [{id: "test", event: "select"}]
            }
        },

        referenceArea: {

            cl: {
                uid: "GIFT_ReferenceArea_filter"
            },

            selector: {
                id: "input",
                type: "radio",
                source: [
                    {label: "All", value: "none"}
                ],
                default: ["none"]
            },
            template: {
                title: "Reference Area"
            }
        },

        coverageSector: {

            cl: {
                uid: "GIFT_CoverageSector_filter"
            },

            selector: {
                id: "input",
                type: "radio",
                source: [
                    {label: "All", value: "none"}
                ],
                default: ["none"]

            },
            template: {
                title: "Coverage Sector"
            }
        },

        gender: {

            cl: {
                uid: "GIFT_Gender_filter"
            },

            selector: {
                id: "input",
                type: "radio",
                source: [
                    {label: "All", value: "none"}
                ],
                default: ["none"]
            },
            template: {
                title: "Gender"
            }
        },

        specialCondition: {

            cl: {
                uid: "GIFT_SpecialConditions_filter"
            },

            selector: {
                id: "input",
                type: "checkbox",
                default: ["1", "2", "3", "4"]
            },

            template: {
                title: "Special Condition"
            },

            dependencies: {
                "@gender,age": [
                    {
                        id: "disableSpecialCondition",
                        event: "select",
                        args: {
                            payloadIncludes : ["gender", "age", "ageGranularity"],
                            forbiddenGender : "1",
                            forbiddenAgeGranularity : "month",
                            threshold: 15
                        }
                    }]
            }
        },

        ageGranularity: {

            selector: {
                id: "input",
                type: "radio",
                source: [
                    {label: "Year", value: "year"},
                    {label: "Month", value: "month"}
                ],
                default: ["year"]
            },

            template: {
                title: "Age Granularity"
            }
        },

        age: {

            selector: {
                id: "range",
                config: {
                    min: 0,
                    max: 120,
                    step : 0.5,
                    from: 0,
                    to: 120,
                    type: "double",
                    grid: true,
                    force_edges: true,
                    prettify: function (num) {
                        return num;
                    }
                }
            },

            template: {
                title: "Age"
            },

            dependencies: {
                ageGranularity : [{id : "updateAge", event : "select"}]
            }
        },

        food: {

            cl: {
                uid: "GIFT_Foods",
                level: 2
            },

            selector: {
                id: "tree",
                hideSummary : true
            },
            template: {
                title: "Food"
            }
        }

    }

});
