define(function () {


    return {
        /*
         CountryCode: {

         className: 'col-md-6',

         selector: {
         id: "tree",
         default: ["DZA"]
         },

         cl: {
         uid: "UNECA_ISO3"

         },
         template: {
         title: "Multiple selection",
         hideHeader: true
         }
         },
         */


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

        },

        /*       first: {
         selector: {
         id: "dropdown",
         config: {
         maxItems: 1
         },
         source: [
         {value: "test", label: "Test ('second' should be disabled)"},
         {value: "other", label: "Other ('second' should be enabled)"}
         ]
         }
         },

         second: {
         selector: {
         id: "input",
         type: "text",
         config: {
         readonly: true,
         placeholder: "hi!"
         }
         },
         dependencies: {
         first: [{id: "readOnlyIfNotValue", event: "select", args: {value: "other"}}]
         }
         }*/

    }

});
