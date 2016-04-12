/*global define*/

define(function () {

    'use strict';

    return {

        tree : {

            selector : {
                id : "tree",
                source : [
                    {value: "danie", label : "Daniele"},
                    {value: "fra", label : "Cuoricina"},
                    {value: "barbara", label : "Barbara"}
                ],
                config : {
                    maxItems : 1
                },
                hideButtons : true, //hide all buttons,
            }

        },
        
        friends : {

            selector : {
                id : "dropdown",
                source : [
                    {value: "danie", label : "Daniele"},
                    {value: "fra", label : "Cuoricina"},
                    {value: "barbara", label : "Barbara"}
                ],
                config : {
                    maxItems : 1
                }
            },

            dependencies : {
                switch : [{id: "disable", event: "select"}]
            }

        }

    }

});