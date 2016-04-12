/*global define*/

define(function () {

    'use strict';

    return {

        "fabio" : {

            selector : {
                id : "sortable",
                source : [
                    {value : "da" , label : "Dani2", parent : "group1"},
                    {value : "d" , label : "Dani 1", parent : "group1"},
                    {value : "dq" , label : "Dani 2", parent : "group2"},
                    {value : "dw" , label : "Dani 3", parent : "group2"},
                    {value : "de" , label : "Dani 4", parent : "group2"},
                    {value : "dr" , label : "Dani 5", parent : "group2"},
                    {value : "dt" , label : "Dani 5", parent : "group2"},
                ],
                config : {
                    itemRender :  function (model) {

                        var $el = $("<h1> " +model.label + "</h1>");

                        $el.on("click", function () {
                            alert()
                        })

                        return $el;
                    }
                }
            },

            template :{
                title : "Fabio"
            }
        }


    }

});