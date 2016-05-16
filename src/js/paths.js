define(function () {

    var config = {
       // "baseUrl": "",

        paths: {
            'fx-filter' : 'src/js/',
            'fx-filter/component_plugin' : 'src/js/component_plugin/',
            'fx-filter/filtercontroller': 'src/js/Fx-filter-controller',
            'fx-filter/containerfactory': 'src/js/Fx-filter-containerFactory',
            'fx-filter/componentfactory': 'src/js/Fx-filter-componentFactory',
            'fx-filter/layoutfactory': 'src/js/Fx-filter-layoutFactory',
            'fx-filter/filtermodule': 'src/js/Fx-filter-module',
            'fx-filter/fluidGridBaseContainer': 'src/js/container_plugin/Fx-filter-fluidGridBaseContainer',
            'fx-filter/baseContainer': 'src/js/container_plugin/baseContainer',
            'fx-filter/fluidGridLayoutRender': 'src/js/layout_plugin/Fx-filter-fluidGridLayoutRender',
            'fx-filter/fluidGridSystemLayoutRender': 'src/js/layout_plugin/Fx-filter-fluidGridSystemLayoutRender',

            //'fx-filter/component1': '../../submodules/fenix-ui-filter/src/js/component_plugin/Fx-filter-component1',
            //'fx-filter/component1': 'src/js/component_plugin/Fx-filter-component1',
            'fx-filter/componentcreator': 'src/js/Fx-filter-component-creator',
            'fx-filter/widgetcommons': 'src/js/Fx-widgets-commons',
            'fx-filter/start': 'src/js/start',
            'fx-filter/utils': 'src/js/Fx-filter-utils',
            'fx-filter/config' : 'config',
//            'fx-filter/src': './src'

            //Third party libs
            //'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            //'pnotify': '{FENIX_CDN}/js/pnotify/2.0.1/pnotify.core',
            //'jqwidgets': '{FENIX_CDN}/js/jqwidgets/3.1/jqx-light',
            //'jqueryui': 'src/lib/jquery-ui.min',
            //'jqueryuicustom': '{FENIX_CDN}/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
            //'nprogress': '{FENIX_CDN}/js/nprogress/0.1.6/nprogress',
            //'underscore': '{FENIX_CDN}/js/underscore/1.7.0/underscore.min',
            //'bootstrap': '{FENIX_CDN}/js/bootstrap/3.2/js/bootstrap.min',
            //'isotope': "{FENIX_CDN}/js/isotope/2.1.0/dist/isotope.pkgd.min",
            //'packery': '{FENIX_CDN}/js/packery/dist/packery.pkgd.min',
            //'jstree': '{FENIX_CDN}/js/jstree/3.0.8/dist/jstree.min',
            //'amplify' : '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',

            'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            'pnotify': '{FENIX_CDN}/js/pnotify/2.0.1/pnotify.core',
            //'jqwidgets': '//fenixapps.fao.org/repository/js/jqwidgets/3.1/jqx-light',
            //'jqwidgets': '//fenixrepo.fao.org/cdn/js/jqwidgets/3.1/jqx-all',
            'jqwidgets': '{FENIX_CDN}/js/jqwidgets/3.8.2/jqx-all',
            'jqueryui': 'src/lib/jquery-ui.min',
            'jqueryuicustom': '{FENIX_CDN}/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
            'nprogress': '{FENIX_CDN}/js/nprogress/0.1.6/nprogress',
            'underscore': '{FENIX_CDN}/js/underscore/1.7.0/underscore.min',
            'bootstrap': '{FENIX_CDN}/js/bootstrap/3.2/js/bootstrap.min',
            'isotope': "{FENIX_CDN}/js/isotope/2.1.0/dist/isotope.pkgd.min",
            'packery': '{FENIX_CDN}/js/packery/1.4.3/dist/packery.pkgd.min.js',
            'jstree': '{FENIX_CDN}/js/jstree/3.0.8/dist/jstree.min',
            'select2': '{FENIX_CDN}/js/select2/3.5.4/select2.min',
            'text': '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
            'draggabilly':'{FENIX_CDN}/js/draggabilly/dist/draggabilly.pkgd.min',
            'amplify' : '{FENIX_CDN}/js/amplify/1.1.2/amplify.min'
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
            pnotify: {
                deps: ['bootstrap']
            },
            'select2': {
                deps: ['jquery']
            }
        }
    };

    return config;
});