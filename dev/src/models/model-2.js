/*global define*/

define(function () {

    'use strict';

    return {

        textarea: {
            selector: {
                id: "textarea",
                source : [{value: "Label", label: "Label"}],
                default : "Hello world!",
                config : {
                    //rows : 100
                }
            },
            template: {
                title: "Year",
                hideRemoveButton: false,
                hideSwitch: false,
                hideHeaderIcon: false
            }
        }
    }

});