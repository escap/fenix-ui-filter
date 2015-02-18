define(function () {

    var config = {

        paths: {

            'fx-filter/filtercontroller': 'src/js/Fx-filter-controller',
            'fx-filter/fluidgrid': 'src/js/Fx-fluid-grid',
            'fx-filter/containerfactory': 'src/js/Fx-filter-containerFactory',
            'fx-filter/componentfactory': 'src/js/Fx-filter-componentFactory',
            'fx-filter/filtermodule': 'src/js/Fx-filter-module',
            'fx-filter/container1': 'src/js/container_plugin/Fx-filter-container',
            'fx-filter/component1': '../../submodules/fenix-ui-filter/src/js/component_plugin/Fx-filter-component1',
            'fx-filter/componentcreator': 'src/js/Fx-filter-component-creator',
            'fx-filter/widgetcommons': 'src/js/Fx-widgets-commons',
            'fx-filter/start': 'src/js/start',
            'fx-filter/utils': 'src/js/Fx-filter-utils',
            'fx-filter/config' : 'config',
//            'fx-filter/src': './src'

            //Third party libs
            'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            'pnotify': '{FENIX_CDN}/js/pnotify/2.0.1/pnotify.core',
            'jqwidgets': '{FENIX_CDN}/js/jqwidgets/3.1/jqx-light',
            'jqueryui': 'src/lib/jquery-ui.min',
            'jqueryuicustom': '{FENIX_CDN}/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
            'nprogress': '{FENIX_CDN}/js/nprogress/0.1.6/nprogress',
            'underscore': '{FENIX_CDN}/js/underscore/1.7.0/underscore.min',
            'bootstrap': '{FENIX_CDN}/js/bootstrap/3.2/js/bootstrap.min',
            'isotope': "{FENIX_CDN}/js/isotope/2.1.0/dist/isotope.pkgd.min",
            'packery': '{FENIX_CDN}/js/packery/dist/packery.pkgd.min',
            'jstree': '{FENIX_CDN}/js/jstree/3.0.8/dist/jstree.min',
            'jQAllRangeSliders': 'src/lib/jQAllRangeSliders-min'
        },

        shim: {
            bootstrap: {
                deps: ['jquery']
            },
            underscore: {
                exports: '_'
            },
            "jquery.i18n.properties": {
                deps: ['jquery']
            },
            jqwidget: {
                export: "$",
                deps: ['jquery']
            },
            jQAllRangeSliders: {
                deps: ['jquery', 'jqueryui', 'jqueryuicustom']
            },
            pnotify: {
                deps: ['bootstrap']
            }
        }
    };

    return config;
});