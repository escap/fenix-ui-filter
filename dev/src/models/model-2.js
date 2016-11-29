define(function () {

    return {

        country: {
            cl: {
                uid: "GAUL0",
                version: "2014"
            },
            selector: {
                id: "tree",
                hideSummary: true
            },

            template: {
                title: "Country"
            },
            format: {
                dimension: "meContent.seCoverage.coverageGeographic",
                output: "code"
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
            },

            format: {
                dimension: "meContent.seCoverage.coverageTime",
                output: "time"
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
            },

            format: {
                output: "codes"
            }
        },

        special_condition: {

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
                "@gender,age_year": [
                    {
                        id: "disableSpecialCondition",
                        event: "select",
                        args: {
                            payloadIncludes: ["gender", "age_year", "ageGranularity"],
                            forbiddenGender: "1",
                            forbiddenAgeGranularity: "month",
                            threshold: 14
                        }
                    }
                ]
            },

            constraints: {
                presence: {message: "Please select at least one value."}
            },

            format: {
                output: "codes"
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
                    step: 0.5,
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
                ageGranularity: [{id: "updateAge", event: "select"}]
            },

            format: {
                output: "number"
            }
        },

        foodex2_code: {

            cl: {
                uid: "GIFT_Foods",
                level: 2
            },

            selector: {
                id: "tree",
                hideSummary: true
            },
            template: {
                title: "Food"
            }
        }

    }

});
