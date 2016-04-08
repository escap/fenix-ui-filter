/*global define*/

define(function () {

    'use strict';

    return {

        stefano: {

            selector: {
                id: "sortable",
                source: [
                    {value: "value1", label: "Label 1", parent: "group1"},
                    {value: "value2", label: "Label 2", parent: "group2"}
                ],
                config: {
                    groups: {
                        group1: "Group 1",
                        group2: "Group 2"
                    },
                    itemRender: function (model) {

                        var self = this,
                            $template = $("<h1> " + model.label + " </h1>");

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