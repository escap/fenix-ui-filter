/*global define*/

define(function () {

    'use strict';

    return {

        stefano : {

            selector : {
                id : "sortable",
                source : [
                    {value : "primo", label : "Primo", parent : "primoG", parentLabel : "Dnie"},
                    {value : "secondo", label : "Secondo", parent : "primo2"}
                ],
                config : {
                    groups  :{
                        stef : "Stef"
                    },
                    itemRender : function (model) {

                        var self = this,
                            $template = $("<h1> " + model.label+ " </h1>");

                        $template.on("click", function () {
                            console.log(self);
                        });

                        return $template;

                    }
                }
            }
        }

    }

});