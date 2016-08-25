/*global require*/

require.config({

    paths: {

    }
});

require([
    "./dist/fenix-ui-filter"
], function ( Filter ) {

    'use strict';

    console.log(Filter)


});