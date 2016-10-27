/*global define*/

define(function () {

    'use strict';

    return {
/*
        bb: {

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
                title: "NLS internal",
                hideRemoveButton: false,
                hideSwitch: false,
            }
        },
*/


        group: {

            incremental : true,

            className: "well",

            template: {
                title: "Hello Group!",
                hideRemoveButton: false,
                hideSwitch: false
            },

            selectors: {
                name: {
                    selector: {
                        id: "input",
                        type: "text",
                        source: [{value: "name", label: "Name"}],
                        default : ["Daniele"]
                    },
                    template : {
                        title : "Name"
                    }
                },
                surname: {
                    selector: {
                        id: "input",
                        type: "text",
                        source: [{value: "surname", label: "Surname"}]
                    },
                    template : {
                        title : "Surname"
                    }
                }
            }
        }

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

});