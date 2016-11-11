/*global define*/

define(function () {

    'use strict';

    return {

        time: {

            selector : {
                id : "tree",
                source : [{value: "1", label : "dd"}]
                //default : ["Fri Nov 11 2016 13:57:00 GMT+0100"]
            },

            template : {
                hideRemoveButton : false,
                hideSwitch : false,
            },

            format : {
                output : "freeText",
                metadataAttribute: "freetext"
            }

        },

/*        resourceType: {

            enumeration : {
                uid: "RepresentationType"
            },

            selector : {
                id : "dropdown",
                hideSummary : true,
                default : ['dataset'],
                config : {
                    plugins: ['remove_button'],
                    mode: 'multi'
                }
            },

            template : {
                hideRemoveButton : false
            },

            format : {
                output : "enumeration",
                metadataAttribute: "meContent.resourceRepresentationType"
            }

        },

        referencePeriod: {

            cl : {
                uid: "FAO_Period",
                version: "1.0"
            },

            selector : {
                id : "dropdown",
                hideSummary : true,
                config : {
                    plugins: ['remove_button'],
                    mode: 'multi'
                }
            },

            template : {
                hideRemoveButton : false
            },

            format : {
                output : "codes",
                metadataAttribute: "meContent.seReferencePopulation.referencePeriod"
            }
        },

        referenceArea: {

            cl : {
                uid: "GAUL_ReferenceArea",
                version: "1.0"
            },

            selector : {
                id : "dropdown",
                hideSummary : true,
                config : {
                    plugins: ['remove_button'],
                    mode: 'multi'
                }
            },

            template : {
                hideRemoveButton : false
            },

            format : {
                output : "codes",
                metadataAttribute: "meContent.seReferencePopulation.referenceArea"
            }
        },

        dataDomain: {

            cl : {
                uid: "UNECA_ClassificationOfActivities",
                level : 2,
                levels : 1
            },

            selector : {
                id : "dropdown",
                hideSummary : true,
                config : {
                    plugins: ['remove_button'],
                    mode: 'multi'
                }
            },

            template : {
                hideRemoveButton : false
            },

            format : {
                output : "codes",
                metadataAttribute: "meContent.seCoverage.coverageSectors"
            }

        },

        region: {

            cl : {
                uid: "GAUL0",
                version: "2014"
            },

            selector : {
                id : "dropdown",
                hideSummary : true,
                config : {
                    plugins: ['remove_button'],
                    mode: 'multi'
                }
            },

            template : {
                hideRemoveButton : false
            },

            format : {
                output : "codes",
                metadataAttribute: "meContent.seCoverage.coverageGeographic"
            }
        },

        statusOfConfidentiality: {

            cl : {
                uid: "CL_CONF_STATUS",
                version: "1.0"
            },

            selector : {
                id : "dropdown",
                hideSummary : true,
                config : {
                    plugins: ['remove_button'],
                    mode: 'multi'
                }
            },

            template : {
                hideRemoveButton : false
            },

            format : {
                output : "codes",
                metadataAttribute: "meAccessibility.seConfidentiality.confidentialityStatus"
            }

        },

        uid: {

            selector : {
                id : "input",
                type : "text"
            },

            template : {
                hideRemoveButton : false
            },

            format : {
                output : "enumeration",
                metadataAttribute: "uid"
            }

        },

        contextSystem : {

            selector : {
                id : "dropdown",
                source : [{value : "uneca", label : "UNECA"}],
                default : ["uneca"],
                hideSummary : true,
                config : {
                    plugins: ['remove_button'],
                    mode: 'multi'
                }
            },

            template : {
                hideRemoveButton : false
            },

            format : {
                output : "enumeration",
                metadataAttribute: "dsd.contextSystem"
            }
        },*/

/*
        "organization": {
            "selector": {
                "id": "input",
                "type": "text",
                "source": [
                    {
                        "value": "organization",
                        "label": "Organization"
                    }
                ]
            },
            "template": {
                "title": "Organization",
                "description": "Name of the responsible organization.",

            },
            "format": {
                "output" : "string"
            }
        },
        "organizationUnit": {
            "selector": {
                "id": "input",
                "type": "text",
                "source": [
                    {
                        "value": "organizationUnit",
                        "label": "Organization unit/division"
                    }
                ]
            },
            "template": {
                "title": "Organization unit/division",
                "description": "Addressable subdivision of an organization.",

            },
            "format": {
                "output" : "string"
            }
        },
        "pointOfContact": {
            "selector": {
                "id": "input",
                "type": "text",
                "source": [
                    {
                        "value": "pointOfContact",
                        "label": "Point of contact"
                    }
                ]
            },
            "template": {
                "title": "Point of contact",
                "description": "Responsible person-surname, given name, title separated by a delimiter. It contains information about the party who can be contacted for acquiring knowledge the resource.",

            },
            "format": {
                "output" : "string"
            }
        },
        "position": {
            "selector": {
                "id": "input",
                "type": "text",
                "source": [
                    {
                        "value": "position",
                        "label": "Position"
                    }
                ]
            },
            "template": {
                "title": "Position",
                "description": " Role or position of the responsible person.",

            },
            "format": {
                "output" : "string"
            }
        },

        "specify": {
            "selector": {
                "id": "input",
                "type": "text",
                "source": [
                    {
                        "value": "specify",
                        "label": "Specify"
                    }
                ]
            },
            "template": {
                "title": "Specify",
                "description": "Textual metadata element that allows to specify the role performed by the responsible party. This field is conditional to the element .",

            },
            "format": {
                "output" : "string"
            }
        },
        "contactInfo": {
            "incremental": true,
            "selectors": {

                "phone": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{ "value": "phone", "label": "Telephone"}]
                    },
                    "template": {
                        "title": "phone",
                        "description": "Telephone numbers at which the organization or individual may be contacted.",

                    },
                    "format": {
                        "output" : "string"
                    }
                },
                "address": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{ "value": "address", "label": "Address"}]
                    },
                    "template": {
                        "title": "address",
                        "description": "Physical address at which the organization or individual may be contacted.",

                    },
                    "format": {
                        "output" : "string"
                    }
                },
                "emailAddress": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{ "value": "emailAddress", "label": "E-mail address"}]
                    },
                    "template": {
                        "title": "emailAddress",
                        "description": "E-mail address at which the organization or individual may be contacted.",

                    },
                    "format": {
                        "output" : "string"
                    }
                },
                "hoursOfService": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{ "value": "hoursOfService", "label": "Hour of service"}]
                    },
                    "template": {
                        "title": "hoursOfService",
                        "description": "Time period (including time zone) when individuals can contact the organization or individual.",

                    },
                    "format": {
                        "output" : "string"
                    }
                },
                "contactInstruction": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{ "value": "contactInstruction", "label": "Instruction"}]
                    },
                    "template": {
                        "title": "contactInstruction",
                        "description": "Supplemental instructions on how or when to contact the individual or organization.",

                    },
                    "format": {
                        "output" : "string"
                    }
                }
            },
            "format": {
                "output" : "array<string>"
            }

        }*/

/*
        contacts: {

            incremental: true,

            className: "well",

            template: {
                title: "Contacts:",
                hideRemoveButton: true,
                hideSwitch: true
            },

            selectors: {

                name: {

                    //nls: true,

                    selector: {
                        id: "input",
                        type: "text",
                        source: [{value: "name", label: "Name"}]
                    },
                    template: {
                        title: "Name"
                    },

                    constraints: {
                        presence: true,
                        url : true
                    }
                },

                surname: {
                    selector: {
                        id: "input",
                        type: "text",
                        source: [{value: "surname", label: "Surname"}]
                    },
                    template: {
                        title: "Surname"
                    }
                },

                role: {

                    selector: {
                        id: "dropdown",
                        source: [
                            {value: "role_1", label: "Operations manager"},
                            {value: "role_2", label: "Quality control, safety, environmental manager"},
                            {value: "role_3", label: "Receptionist"}
                        ],
                        config: {
                            maxItems: 1
                        }
                    },
                    template: {
                        title: "Role"
                    }

                }
            }
        },

        input: {

            selector: {
                id: "input",
                type: "text"
            },

            constraints: {
                presence: true
            }
        }
*/

        /*
         "format": {
         "selector": {
         "id": "dropdown",
         "source": [{"value": "localstring", "label": "Local String"}, {"value": "value", "label": "Raw Value"}],
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
         }, "template": {"title": "Decimals"}, "className": "testDec"
         },
         "show": {
         "selector": {
         "id": "input",
         "type": "checkbox",
         "source": [{"value": "unit", "label": "Unit"}, {"value": "flag", "label": "Flag"}, {
         "value": "code",
         "label": "Code"
         }]
         }, "template": {"title": "Show"}
         },
         "dimensionsSort": {
         "selector": {
         "id": "sortable",
         "source": [{"value": "OTHER1", "label": "unit", "parent": "aggregations"}, {
         "value": "DIMENSION0",
         "label": "année",
         "parent": "columns"
         }, {"value": "DIMENSION2", "label": "Indicateur", "parent": "rows"}, {
         "value": "DIMENSION3",
         "label": "département",
         "parent": "rows"
         }, {"value": "DIMENSION4", "label": "sexe", "parent": "rows"}, {
         "value": "VALUE0",
         "label": "value",
         "parent": "values"
         }],
         "config": {
         "groups": {
         "rows": "Rows",
         "columns": "Columns",
         "hidden": "Hidden",
         "aggregations": "Aggregation",
         "values": "Values"
         }
         }
         }, "template": {"hideSwitch": true, "hideRemoveButton": true, "title": "Sort dimension"}
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
         }, "template": {"title": "Aggregator for Value"}
         }
         */


        /*        item : {

         className : "",

         incremental : true,

         //template: {
         //  hideSwitch : false,
         //    hideRemoveButton: false
         //},

         selectors : {

         first : {
         selector : {
         id : 'dropdown',
         source : [
         {value : 'item_1', label : "Item 1"},
         {value : 'item_2', label : "Item 2"},
         {value : 'item_3', label : "Item 3"}
         ],
         default : ['item_1']
         },
         template : {
         title : "First"
         }
         },

         second : {
         selector : {
         id : 'tree',
         source : [
         {value : 'item_1', label : "Item 1"},
         {value : 'item_2', label : "Item 2"},
         {value : 'item_3', label : "Item 3"}
         ],
         default : ['item_2']
         },
         template : {
         title : "Second"
         }
         },
         third : {
         nls: true,
         selector : {
         id : 'tree',
         source : [
         {value : 'item_1', label : "Item 1"},
         {value : 'item_2', label : "Item 2"},
         {value : 'item_3', label : "Item 3"}
         ],
         default : ['item_2']
         },
         template : {
         title : "Second"
         }
         }

         }

         }*/

        /*        item : {

         selectors: {

         first: {
         selector: {
         id: 'tree',
         source: [
         {value: 'item_1', label: "Item 1"},
         {value: 'item_2', label: "Item 2"},
         {value: 'item_3', label: "Item 3"}
         ],
         default: ['item_1']
         }
         },

         second: {
         selector: {
         id: 'tree',
         source: [
         {value: 'item_1', label: "Item 1"},
         {value: 'item_2', label: "Item 2"},
         {value: 'item_3', label: "Item 3"}
         ],
         default: ['item_2']
         }
         }

         }
         }*/


        /*        bb: {

         nls: true,

         selector: {

         id: "tree",

         source: [
         {value: "item_1", label: "Item 1"},
         {value: "item_2", label: "Item 2"},
         {value: "item_3", label: "Item 3"},
         {value: "item_4", label: "Item 4"}
         ]
         },

         template: {
         title: "NLS selector",
         hideRemoveButton: false,
         hideSwitch: false
         }
         },*/

        /*
         policyMeasure: {

         selector: {
         id: "dropdown",
         hideSelectAllButton: false,
         hideClearAllButton: false
         },

         cl: {
         "uid": "OECD_PolicyType2_1_1",
         "version": "1.0"
         },

         template: {
         title: "Policy Measure"
         },

         dependencies: {
         commodityDomain: [{
         id: "process",
         event: "select",
         args: {
         uid: "OECD_View_QueryDownload",
         payloadIncludes: ["commodityDomain", "policyDomain", "policyType"],
         body: [{
         name: "filter",
         parameters: {
         rows: {
         commoditydomain: {
         codes: [{
         uid: "OECD_CommodityDomain",
         version: "1.0",
         codes: ["{{{commodityDomain}}}"]
         }]
         },
         policydomain: {
         codes: [{
         uid: "OECD_PolicyDomain",
         version: "1.0",
         codes: ["{{{policyDomain}}}"]
         }]
         },
         policytype: {
         codes: [{
         uid: "OECD_PolicyType",
         version: "1.0",
         codes: ["{{{policyType}}}"]
         }]
         }
         },
         columns: ["policymeasure"]
         }
         },
         {
         "name": "group",
         "parameters": {
         "by": [
         "policymeasure"

         ],
         "aggregations": []
         }
         }]
         }
         }],
         policyDomain: [{
         id: "process",
         event: "select",
         args: {
         uid: "OECD_View_QueryDownload",
         payloadIncludes: ["commodityDomain", "policyDomain", "policyType"],
         body: [{
         name: "filter",
         parameters: {
         rows: {
         commoditydomain: {
         codes: [{
         uid: "OECD_CommodityDomain",
         version: "1.0",
         codes: ["{{{commodityDomain}}}"]
         }]
         },
         policydomain: {
         codes: [{
         uid: "OECD_PolicyDomain",
         version: "1.0",
         codes: ["{{{policyDomain}}}"]
         }]
         },
         policytype: {
         codes: [{
         uid: "OECD_PolicyType",
         version: "1.0",
         codes: ["{{{policyType}}}"]
         }]
         }
         },
         columns: ["policymeasure"]
         }
         },
         {
         "name": "group",
         "parameters": {
         "by": [
         "policymeasure"

         ],
         "aggregations": []
         }
         }]
         }
         }],
         policyType: [{
         id: "process",
         event: "select",
         args: {
         uid: "OECD_View_QueryDownload",
         payloadIncludes: ["commodityDomain", "policyDomain", "policyType"],
         body: [{
         name: "filter",
         parameters: {
         rows: {
         commoditydomain: {
         codes: [{
         uid: "OECD_CommodityDomain",
         version: "1.0",
         codes: ["{{{commodityDomain}}}"]
         }]
         },
         policydomain: {
         codes: [{
         uid: "OECD_PolicyDomain",
         version: "1.0",
         codes: ["{{{policyDomain}}}"]
         }]
         },
         policytype: {
         codes: [{
         uid: "OECD_PolicyType",
         version: "1.0",
         codes: ["{{{policyType}}}"]
         }]
         }
         },
         columns: ["policymeasure"]
         }
         },
         {
         "name": "group",
         "parameters": {
         "by": [
         "policymeasure"

         ],
         "aggregations": []
         }
         }]
         }
         }]
         }
         },*/


        /*    textarea: {

         nls: true,

         selector: {
         id: "textarea"
         },

         template: {
         title: "NLS external",
         hideRemoveButton: false,
         hideSwitch: false,
         }
         },*/


        //dep_process

        /*        commodityDomain: {

         selector: {
         id: "input",
         type: "checkbox",
         source: [
         {value: "1", label: "Agricultural"},
         {value: "2", label: "Biofuels"}
         ],
         default: ["1"],
         hideSelectAllButton: false,
         hideClearAllButton: false
         },

         template: {
         title: "Commodity Domain"
         }
         },

         policyDomain: {

         selector: {
         id: "input",
         type: "checkbox",
         source: [
         {value: "1", label: "Trade"},
         {value: "2", label: "Domestic"}
         ],
         default: ["1"],
         hideSelectAllButton: false,
         hideClearAllButton: false
         },

         template: {
         title: "Policy Domain"
         }
         },

         policyType: {

         selector: {
         id: "dropdown",
         source: [
         {value: "1", label: "Export measures"},
         {value: "2", label: "Import measures"}
         ],
         hideSelectAllButton: false,
         hideClearAllButton: false,
         config: {
         //maxItems: 1, // Max amount of selected items,
         //placeholder: "Please select",
         plugins: ['remove_button'], //in combination with mode:'multi' create a 'X' button to remove items
         mode: 'multi'
         }
         },

         template: {
         title: "Policy Type"
         },

         dependencies: {
         commodityDomain: [{
         id: "process",
         event: "select",
         args: {
         uid: "OECD_View_QueryDownload",
         payloadIncludes: ["commodityDomain", "policyDomain"],
         body: [{
         name: "filter",
         parameters: {
         rows: {
         commoditydomain: {
         codes: [{
         uid: "OECD_CommodityDomain",
         version: "1.0",
         codes: ["{{{commodityDomain}}}"]
         }]
         },
         policydomain: {
         codes: [{
         uid: "OECD_PolicyDomain",
         version: "1.0",
         codes: ["{{{policyDomain}}}"]
         }]
         }
         },
         columns: ["policytype"]
         }
         },
         {
         "name": "group",
         "parameters": {
         "by": [
         "policytype"

         ],
         "aggregations": []
         }
         }]
         }
         }],
         policyDomain: [{
         id: "process",
         event: "select",
         args: {
         uid: "OECD_View_QueryDownload",
         payloadIncludes: ["commodityDomain", "policyDomain"],
         body: [{
         name: "filter",
         parameters: {
         rows: {
         commoditydomain: {
         codes: [{
         uid: "OECD_CommodityDomain",
         version: "1.0",
         codes: ["{{{commodityDomain}}}"]
         }]
         },
         policydomain: {
         codes: [{
         uid: "OECD_PolicyDomain",
         version: "1.0",
         codes: ["{{{policyDomain}}}"]
         }]
         }
         },
         columns: ["policytype"]
         }
         },
         {
         "name": "group",
         "parameters": {
         "by": [
         "policytype"

         ],
         "aggregations": []
         }
         }]
         }
         }]
         }
         },*/


        /*        commodityClass: {

         selector: {
         id: "dropdown",
         hideSelectAllButton: false,
         hideClearAllButton: false
         },

         cl: {
         "uid": "OECD_CommodityClass1",
         "version": "1.0"
         },

         template: {
         title: "Commodity Class"
         }
         },*/

        /*        country: {

         selector: {
         id: "dropdown",
         hideSelectAllButton: false,
         hideClearAllButton: false
         },

         cl: {
         "uid": "OECD_Country",
         "version": "1.0"
         },

         template: {
         title: "Country"
         }
         },*/

        /*
         mixedCommodityClass: {

         selector: {
         id: "input",
         type: "checkbox",
         source: [
         {value: "1", label: "Mixed commodity classes"}
         ],
         default: ["1"],
         hideSelectAllButton: false,
         hideClearAllButton: false
         }
         },
         */


        /*parentsector_code: {
         selector: {
         id: "tree",
         config: { //Selectize configuration
         maxItems: 1,
         plugins: ['remove_button'],
         mode: 'multi'
         },
         default : ["311", "600"],
         hideSummary: true, //Hide selection summary,
         },
         cl: {
         uid: "crs_dac",
         version: "2016",
         level: 1,
         levels: 1
         },
         template: {
         title: "Parent",
         hideSwitch: true,
         hideRemoveButton: true
         }
         },
         purposecode: {
         selector: {
         id: "tree",
         config: {
         plugins: ['remove_button'],
         mode: 'multi'
         },
         hideSummary: true, //Hide selection summary,
         },
         cl: {
         // codes: ["60010", "60020", "60030", "60040", "60061", "60062", "60063"],
         "uid": "crs_dac",
         "version": "2016",
         "level": 2,
         "levels": 2
         },
         template: {
         title: "Son",

         hideSwitch: true,
         hideRemoveButton: true
         },
         dependencies: {
         "parentsector_code": {id: "parent", event: "select"} //obj or array of obj
         }
         },
         */


        /*  from: {

         cl : {
         uid : ""
         },

         selector: {
         id: "dropdown",
         },

         },

         to: {

         selector: {
         id: "dropdown",
         from: 1,
         to: 10,
         },

         dependencies: {
         from: [{event: "select", id: "min"}]
         }


         }*/

        /*  nls: {

         className : "test",

         cl: {
         uid: "OECD_PolicyType2_1_1",
         version: "1.0"
         },

         selector: {
         id: "tree",
         //source : [{value : "item_1", label : "Item 1"}]
         //default : ['27']
         },

         template: {
         title: "NLS selector",
         description: "My description",
         hideRemoveButton : false,
         hideSwitch : false
         }

         },*/
        /* aa: {
         selector: {
         id: "range",
         config: {
         type: "double"
         }

         },
         template: {
         title: "Coverage period",
         description: "Information about the time period for which data are available. It requests to report the time window of reference (reporting the starting date and the ending date) even if it presents some lacks.",
         hideRemoveButton : false,
         hideSwitch : false,

         }
         },*/


        /*
         bb: {

         className: "well",

         semantic: false,

         incremental: true,

         selectors: {
         cca: {
         selector: {
         id: "input",
         type: "text",
         source: [{value: "Label", label: "e.g. John Smith"}]
         },
         template: {
         title: "Name"
         }
         },
         ccb: {
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
         hideRemoveButton : false,
         hideSwitch : false,
         title: "Contact"
         }
         }*/
    }

})
;