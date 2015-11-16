requirejs.config({

    //Define it as string : string
    //Explicit jquery path!  Don't use a prefix for it
    paths: {
        'jquery': 'node_modules/jquery/dist/jquery.min',
        'pnotify': 'src/lib/pnotify.custom.min',
        'jqwidgets': "node_modules/jqwidgets-3.1/jqx-all",
        'jqueryui': 'src/lib/jquery-ui.min',
        'nprogress': 'node_modules/nprogress',
        'bootstrap': 'node_modules/bootstrap/dist/js/bootstrap.min',
        'isotope': "src/lib/isotope",
        'packery': 'node_modules/packery/dist/packery.pkgd.min',
        'jstree': 'node_modules/jstree/dist/jstree.min',
        'jQAllRangeSliders': 'src/lib/jQAllRangeSliders-min',

        'filtercontroller': 'src/js/Fx-filter-controller',
        'fluidgrid': 'src/js/Fx-fluid-grid',
        'draggabilly': 'node_modules/draggabilly/dist/draggabilly.pkgd.min',
        'containerfactory': 'src/js/Fx-filter-containerFactory',
        'componentfactory': 'src/js/Fx-filter-componentFactory',
        'filtermodule': 'src/js/Fx-filter-module',
        'container1': 'src/js/container_plugin/Fx-filter-container',
        'component1': 'src/js/component_plugin/Fx-filter-component1',
        'componentcreator': 'src/js/Fx-filter-component-creator',
        'widgetcommons': 'src/js/Fx-widgets-commons',
        'src': './src'
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
        }
    }
});

require(['jquery', 'filtercontroller'], function ($, FC) {

    $('body').on("fx.host.component.ready", function (event, properties) {

        //The host can set now the domain
        fc.setDomain("FirstComponent", [{"label": "l10", "value":"v10"}, {"label": "l20", "value":"v20"}]);
    });

    $("#jqxButton").on('click', function () {
//        var ris = fc.getValues([{name: "FirstComponent3"}]);
        var ris = fc.getValues();
    });

    var filter_content = document.querySelector('#filter_content');
    var fc = new FC({mainContent: filter_content});
    fc.render();
    var modules = [
        {
            "containerType": "container1",
            "title": "Container1Title",
            "components": [
                {"componentType": "component1",
//                    "source": [
//                        {"label": "l1", "value": "v1"},
//                        {"label": "l2", "value": "v2"}
//                    ],
                    //"type":"radiobuttongroup",
                    //"domain_type" : "CommodityDomain",
                    //"group_name":"fx_selector_1_group",
                    "elements": [
                        {"value": true, "id": "fx_selector_1_rb1", "label": "Agricultural", "code": 1, "position": 0},
                        {"value": false, "id": "fx_selector_1_rb2", "label": "Biofuels", "code": 2, "position": 1},
                        {"value": false, "id": "fx_selector_1_rb3", "label": "Both", "code": -1, "position": 3}
                    ],
                    "lang": "EN",
                    "title": {
                        "EN": "Component 1",
                        "ES": "ES List",
                        "FR": "FR List"},
                    "subtitle": {
                        "EN": "SubTitle1EN",
                        "ES": "SubTitle1ES",
                        "FR": "SubTitle1FR"},
                    "multipleselection": true,
                    "name": "FirstComponent",
                    "details": {
                        "cl": {
                            "system": "CS_Units",
                            "version": "1.0"}
                    },
                    "component": {
                        "source": {
                            "datafields": [
                                {
                                    "name": "label"
                                },
                                {
                                    "name": "value"
                                }
                            ],
                            "id": "code"
                        },
                        "rendering": {
                            "displayMember": "label",
                            "valueMember": "value",
                            "multiple": true,
                            "width": "100%",
                            "height": "100%"
                        }}
                }
                ,
                {"componentType": "component1",
                    "source": [
                        {"label": "l6", "value": "v6"},
                        {"label": "l7", "value": "v7"}
                    ],
                    //"type":"radiobuttongroup",
                    //"domain_type" : "CommodityDomain",
                    //"group_name":"fx_selector_1_group",
                    "elements": [
                        {"value": true, "id": "fx_selector_1_rb1", "label": "Agricultural", "code": 1, "position": 0},
                        {"value": false, "id": "fx_selector_1_rb2", "label": "Biofuels", "code": 2, "position": 1},
                        {"value": false, "id": "fx_selector_1_rb3", "label": "Both", "code": -1, "position": 3}
                    ],
                    "lang": "EN",
                    "title": {
                        "EN": "Component 2",
                        "ES": "ES List",
                        "FR": "FR List"},
                    "multipleselection": true,
                    "name": "SecondComponent",
                    "details": {
                        "cl": {
                            "system": "CS_Units",
                            "version": "1.0"}
                    },
                    "component": {
                        "source": {
                            "datafields": [
                                {
                                    "name": "label"
                                },
                                {
                                    "name": "value"
                                }
                            ],
                            "id": "code"
                        },
                        "rendering": {
                            "displayMember": "label",
                            "valueMember": "value",
                            "multiple": true,
                            "width": "100%",
                            "height": "100%"
                        }}
                }
            ]
        },
        {
            "containerType": "container1",
            "title": "Container2Title",
            "components": [
                {"componentType": "component1",
                    "source": [
                        {"label": "l13", "value": "v13"},
                        {"label": "l23", "value": "v23"}
                    ],
                    //"type":"radiobuttongroup",
                    //"domain_type" : "CommodityDomain",
                    //"group_name":"fx_selector_1_group",
                    "elements": [
                        {"value": true, "id": "fx_selector_1_rb1", "label": "Agricultural", "code": 1, "position": 0},
                        {"value": false, "id": "fx_selector_1_rb2", "label": "Biofuels", "code": 2, "position": 1},
                        {"value": false, "id": "fx_selector_1_rb3", "label": "Both", "code": -1, "position": 3}
                    ],
                    "lang": "EN",
                    "title": {
                        "EN": "Component 3",
                        "ES": "ES List",
                        "FR": "FR List"},
                    "subtitle": {
                        "EN": "SubTitle2EN",
                        "ES": "SubTitle1ES",
                        "FR": "SubTitle1FR"},
                    "multipleselection": true,
                    "name": "ThirdComponent",
                    "component": {
                        "source": {
                            "datafields": [
                                {
                                    "name": "label"
                                },
                                {
                                    "name": "value"
                                }
                            ],
                            "id": "code"
                        },
                        "rendering": {
                            "displayMember": "label",
                            "valueMember": "value",
                            "multiple": true,
                            "width": "100%",
                            "height": "100%"
                        }}
                }
                ,
                {"componentType": "component1",
                    "source": [
                        {"label": "l61", "value": "v61"},
                        {"label": "l71", "value": "v71"}
                    ],
                    //"type":"radiobuttongroup",
                    //"domain_type" : "CommodityDomain",
                    //"group_name":"fx_selector_1_group",
                    "elements": [
                        {"value": true, "id": "fx_selector_1_rb1", "label": "Agricultural", "code": 1, "position": 0},
                        {"value": false, "id": "fx_selector_1_rb2", "label": "Biofuels", "code": 2, "position": 1},
                        {"value": false, "id": "fx_selector_1_rb3", "label": "Both", "code": -1, "position": 3}
                    ],
                    "lang": "EN",
                    "title": {
                        "EN": "Component 4",
                        "ES": "ES List",
                        "FR": "FR List"},
                    "multipleselection": true,
                    "name": "4Component",
                    "component": {
                        "source": {
                            "datafields": [
                                {
                                    "name": "label"
                                },
                                {
                                    "name": "value"
                                }
                            ],
                            "id": "code"
                        },
                        "rendering": {
                            "displayMember": "label",
                            "valueMember": "value",
                            "multiple": true,
                            "width": "100%",
                            "height": "100%"
                        }}
                }
            ]
        }
    ];

    fc.add(modules);
});