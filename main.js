/*global require*/

// relative or absolute path of Components' main.js
//URL resolution relative to the location of this file
require([
    'src/js/paths'
], function (Filter) {

    console.log("Filter")
    var override = {
        'lib': './src/js/lib'
    };

    /*
     @param: prefix of Components paths to reference them also in absolute mode
     @param: paths to override
     @param: callback function
     */
    //URL resolution relative to the location of this file
    Filter.initialize('./src/js', override, function () {

        require([
            'fx-filter/start'
        ], function (Filter){

            new Filter().init();
        });

    });

});