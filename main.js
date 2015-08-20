/*global require*/

//relative or absolute path of Components' main.js
//URL resolution relative to the location of this file
require([
    'src/js/paths'
], function (Path) {

    require.config(Path)

    require([
        'fx-filter/start',
        'fx-filter/utils'
    ], function (Filter, FilterUtils) {

        //var override = {
        //    'lib': './src/js/lib'
        //};

        var FILTER_CONTAINER= 'filterContainer';

        var filterUtils = new FilterUtils();

        var filter = new Filter();
        filter.init({
            container: FILTER_CONTAINER,
            plugin_prefix: '',
            layout: 'fluidGrid'
          //  plugin_subdir: 'FENIX-plugin'
        });


        //FENIX List Example : 1 component "sourceType": "timeList", 1 component "sourceType": "period"
        //var configuration =[
        //    {
        //        "containerType":"fluidGridBaseContainer",
        //        "title":"List Test Timelist",
        //        "components":[
        //            {
        //                "componentType":"timeList-FENIX",
        //                "lang":"EN",
        //                "title":{"EN": "Time List For Fenix",
        //                    "ES": "Time List For Fenix",
        //                    "DE": "Time List For Fenix",
        //                    "FR": "Time List For Fenix"},
        //                "name":"timeListForFenix",
        //                "component": {
        //                    "source": {
        //                        "uid": "GAUL_ReferenceArea",
        //                        "version": "1.0"
        //                    },
        //                    "sourceType": "timeList",
        //                    "defaultsource":[1986, 2015, 1997, 2000, 2002, 2003, 2005, 2007, 2010]
        //                }
        //            }
        //        ]
        //    },
        //    {
        //        "containerType":"fluidGridBaseContainer",
        //        "title":"List Test Period",
        //        "components":[
        //            {
        //                "componentType":"timeList-FENIX",
        //                "lang":"EN",
        //                "title":{"EN": "Time List For Fenix",
        //                    "ES": "Time List For Fenix",
        //                    "DE": "Time List For Fenix",
        //                    "FR": "Time List For Fenix"},
        //                "name":"periodForFenix",
        //                "component": {
        //                    "sourceType": "period",
        //                    "defaultsource":[{"from": 1983, "to": 1994},{"from": 1996, "to": 1998},{"from": 2002, "to": 2005},{"from": 2007, "to": 2011}]
        //                }
        //            }
        //        ]
        //    }
        //];

        //Baselist Example
        var configuration = [
            {
                "containerType":"fluidGridBaseContainer",
                "title":"List Test Timelist",
                "components":[
                        {
                            "componentType":"dropDownList",
                            "lang":"EN",
                            "title":{"EN":"Region"},
                            "name":"RegionC2",
                            config:{
                                "defaultsource":[
                                    {"value":"51325","label":"Central","selected":false},
                                    {"value":"51326","label":"Coast","selected":false},
                                    {"value":"51327","label":"Eastern","selected":false},
                                    {"value":"51328","label":"Nairobi","selected":false},
                                    {"value":"51329","label":"North Eastern","selected":false},
                                    {"value":"51330","label":"Nyanza","selected":false},
                                    {"value":"51331","label":"Rift Valley","selected":false},
                                    {"value":"51332","label":"Western","selected":false}
                                ]
                            }
                        }
                ]
            }
            //{
            //    "containerType":"fluidGridBaseContainer",
            //    "title":"List Test Radio Button",
            //    "components":[
            //        {
            //            "componentType":"radioButton",
            //            "lang":"EN",
            //            "title":{"EN":"Region"},
            //            "name":"RegionC4",
            //            config:{
            //                "elementsNum": 3,
            //                "defaultsource":[
            //                    {"value":"RB1","label":"RadioButton1","selected":true},
            //                    {"value":"RB2","label":"RadioButton2","selected":false},
            //                    {"value":"RB3","label":"RadioButton3","selected":false}
            //                ]
            //            }
            //        }
            //    ]
            //}
        ];

        //Example with one container and these components:
        //"enumeration-FENIX", "text-FENIX", "tree-FENIX", "codes-FENIX", "baseList"
        //var configuration =
        //[{
        //            "containerType":"fluidGridBaseContainer",
        //            "title":"Container Region",
        //            "activeTab":"ResurceType",
        //            "components":[
        //                {
        //                    "componentType":"enumeration-FENIX",
        //                    "lang":"EN",
        //                    "title":{"EN": "ResurceType",
        //                        "ES": "ResurceType",
        //                        "FR": "ResurceType"},
        //                    "name":"ResurceType",
        //                    "component": {
        //                        "source": {
        //                            "uid": "RepresentationType"
        //                        }
        //                    }
        //                },
        //                {
        //                    "componentType":"text-FENIX",
        //                    "lang":"EN",
        //                    "title":{"EN": "Uid",
        //                        "DE": "Suche",
        //                        "ES": "Búsqueda",
        //                        "FR": "Recherchet"},
        //                    "name":"Uid",
        //                    "component": {
        //                        "rendering": {
        //                            "placeholder": {
        //                                "EN": "Uid",
        //                                "DE": "uid",
        //                                "ES": "uid",
        //                                "FR": "uid"
        //                            },
        //                            "htmlattributes": {
        //                                "className": "form-control"
        //                            }
        //                        }
        //                    }
        //                },
        //                {
        //                    "componentType":"tree-FENIX",
        //                    "lang":"EN",
        //                    "title":{"EN": "Region",
        //                        "ES": "ES List",
        //                        "FR": "FR List"},
        //                    "name":"Region",
        //                    "component": {
        //                        "source": {
        //                            "uid": "GAUL",
        //                            "version": "2014"
        //                        }
        //                    }
        //                },
        //                {
        //                    "componentType":"codes-FENIX",
        //                    "lang":"EN",
        //                    "title":{"EN": "Reference Area2",
        //                        "ES": "Intervalo de tiempo",
        //                        "DE": "Zeitbereich",
        //                        "FR": "Intervalle de temps"},
        //                    "name":"ReferenceArea2",
        //                    "component": {
        //                        "source": {
        //                            "uid": "GAUL_ReferenceArea",
        //                            "version": "1.0"
        //                        }
        //                    }
        //                },
        //                {
        //                    "componentType":"baseList",
        //                    "lang":"EN",
        //                    "title":{"EN":"Region"},
        //                    "name":"RegionC2",
        //                    config:{
        //                        "multipleselection":true,
        //                        "defaultsource":[
        //                            {"value":"51325","label":"Central","selected":true},
        //                            {"value":"51326","label":"Coast","selected":true},
        //                            {"value":"51327","label":"Eastern","selected":false},
        //                            {"value":"51328","label":"Nairobi","selected":false},
        //                            {"value":"51329","label":"North Eastern","selected":false},
        //                            {"value":"51330","label":"Nyanza","selected":false},
        //                            {"value":"51331","label":"Rift Valley","selected":false},
        //                            {"value":"51332","label":"Western","selected":false}
        //                        ]
        //                    }
        //                }
        //            ]
        //        }
        //];

        var adapterMap = {};
        var regionC1_func = function(model, success, error)
        {
            var source = [{'value':'1234','label':'S3','selected':false},{'value':'12345','label':'S5','selected':true}];
            //$.proxy(success(source), this);
            success(source)
            return true;
        }
        //adapterMap["RegionC2"] =  regionC1_func;
        //adapterMap["RegionC2"] =  regionC1_func;

        $("#jqxGetValuesButton").on('click', function () {
            var values = filter.getValues();
            console.log("Values ");
            console.log(values)
            var s = JSON.stringify(values);
            console.log(s)
        })

        filter.add(configuration, adapterMap);

        //Radio Button SetDomain test
        //$('body').on(filter.getReadyEvent(), function(event, properties){
        //
        //    alert("In Event Ready!!!")
        //    var sourceAfter= [
        //        {"value":"RB1","label":"RadioButton10","selected":false},
        //        {"value":"RB2","label":"RadioButton20","selected":true},
        //        {"value":"RB3","label":"RadioButton30","selected":false}
        //    ];
        //    filter.setDomain("RegionC4", sourceAfter);
        //});

        //var FILTER_CONTAINER2= 'filterContainer2';
        //
        //var filterUtils2 = new FilterUtils();
        //
        //var filter2 = new Filter();
        //filter2.init({
        //    container: FILTER_CONTAINER2,
        //    plugin_prefix: ''
        //});
        //
        ////var configuration = [{"containerType":"container1","title":"Region","components":[{"componentType":"baseList","lang":"EN","title":{"EN":"Region"},"multipleselection":true,"name":"Region","component":{"source":{"datafields":[{"name":"label"},{"name":"value"}]},"rendering":{"displayMember":"label","valueMember":"value","multiple":true,"width":"100%","height":"100%"}},"source":[{"value":"51325","label":"Central","selected":false},{"value":"51326","label":"Coast","selected":false},{"value":"51327","label":"Eastern","selected":false},{"value":"51328","label":"Nairobi","selected":false},{"value":"51329","label":"North Eastern","selected":false},{"value":"51330","label":"Nyanza","selected":false},{"value":"51331","label":"Rift Valley","selected":false},{"value":"51332","label":"Western","selected":false}]}]}];
        //var configuration2 = [{"containerType":"container1","title":"Region","components":[{"componentType":"baseList","lang":"EN","title":{"EN":"Region"},"multipleselection":true,"name":"Region","component":{"source":{"datafields":[{"name":"label"},{"name":"value"}]},"rendering":{"displayMember":"label","valueMember":"value","multiple":true,"width":"100%","height":"100%"}},"source":[{"value":"51325","label":"Central","selected":false},{"value":"51326","label":"Coast","selected":false},{"value":"51327","label":"Eastern","selected":false},{"value":"51328","label":"Nairobi","selected":false},{"value":"51329","label":"North Eastern","selected":false},{"value":"51330","label":"Nyanza","selected":false},{"value":"51331","label":"Rift Valley","selected":false},{"value":"51332","label":"Western","selected":false}]}]}, {"containerType":"container1","title":"Region","components":[{"componentType":"component1","lang":"EN","title":{"EN":"Region"},"multipleselection":true,"name":"Region","component":{"source":{"datafields":[{"name":"label"},{"name":"value"}]},"rendering":{"displayMember":"label","valueMember":"value","multiple":true,"width":"100%","height":"100%"}},"source":[{"value":"51325","label":"Central","selected":false},{"value":"51326","label":"Coast","selected":false},{"value":"51327","label":"Eastern","selected":false},{"value":"51328","label":"Nairobi","selected":false},{"value":"51329","label":"North Eastern","selected":false},{"value":"51330","label":"Nyanza","selected":false},{"value":"51331","label":"Rift Valley","selected":false},{"value":"51332","label":"Western","selected":false}]}]}];
        //filter2.add(configuration2);
    });
});

