define(function () {

    var config = {

        paths: {
            'fx-filter/start': './start',
            'fx-filter/html': '../../html',
            'fx-filter/js': './',
            'fx-filter/config' :  '../../config',
            'fx-filter/nls' :  '../../i18n',

            //3rd party libs
            'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            'handlebars': "{FENIX_CDN}/js/handlebars/2.0.0/handlebars",
            'amplify' : '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
            underscore: "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
            i18n: "{FENIX_CDN}/js/requirejs/plugins/i18n/2.0.4/i18n",
            text: '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
            bootstrap : "{FENIX_CDN}/js/bootstrap/3.3.4/js/bootstrap.min",
            q: '{FENIX_CDN}/js/q/1.1.2/q',
            selectize : '{FENIX_CDN}/js/selectize/0.12.1/js/standalone/selectize.min',
            jstree: '{FENIX_CDN}/js/jstree/3.0.8/dist/jstree.min',
            "ion.rangeSlider" : '{FENIX_CDN}/js/ion.rangeSlider/2.1.2/js/ion-rangeSlider/ion.rangeSlider.min',
            "bootstrap.datetimepicker" : '{FENIX_CDN}/js/bootstrap-datetimepicker/4.17.37/build/js/bootstrap-datetimepicker.min',
            moment : '{FENIX_CDN}/js/moment/2.12.0/min/moment.min'
        },

        shim: {
            bootstrap : {
                deps : ['jquery']
            },
            underscore: {
                exports: '_'
            },
            'amplify' : {
                deps : ['jquery']
            },
            handlebars: {
                exports: 'Handlebars'
            },
            "ion.rangeSlider" : {
                deps : ['jquery']
            },
            "bootstrap.datetimepicker" : {
                deps : ['bootstrap', "moment", 'jquery']
            }
        }
    };

    return config;
});