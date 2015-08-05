/*global define, amplify, alert*/
define([
        "jquery",
        "geojson_selector",
        "fx-filter/config/config",
        "fx-filter/config/config-default",
        "fx-filter/config/events",
        "text!test_geo_json/world-countries.json",
        "leaflet", "jstree", "amplify"],
    function ($, GeoSelector, C, DC, E, GEOJSON, L) {

        'use strict';


        var URL = {
            africa_countries: "http://fenix.fao.org/geo/fenix/spatialquery/db/spatial/query/SELECT%20ST_AsGeoJSON(geom),%20adm0_code,%20areanamee%20FROM%20spatial.gaul0_faostat_afo_4326%20WHERE%20adm0_code%20IN%20(%208,29,35,42,43,45,47,49,50,58,59,68,66,70,40765,76,77,79,89,90,94,106,105,133,142,144,145,150,152,155,159,160,169,170,172,181,182,206,205,214,217,220,221,226,227,630,235,257,243,248,253,270,271,40764,4%20)%20",
            world_countries: "http://fenixrepo.fao.org/cdn/js/leaflet/plugins/leaflet-geojson-selector/0.2.0/examples/world-countries.json"
        }

        var o = {
            lang: 'EN',
            //For filter logic .... start
            componentType: '',
            componentid: '',
            name: '',
            title: '',
            grid: '',
            source: '',
            defaultsource: '',
            adapter: null,
            css_classes: {
                HOLDER: "fx-catalog-modular-form-holder",
                HEADER: "fx-catalog-modular-form-header",
                HANDLER: "fx-catalog-modular-form-handler",
                CONTENT: "fx-catalog-modular-form-content",
                CLOSE_BTN: "fx-catalog-modular-form-close-btn",
                MODULE: 'fx-catalog-form-module',
                RESIZE: ".fx-catalog-modular-form-resize-btn",
                LABEL: "fx-catalog-modular-form-label"
            },

            sourceType: {
                timelist: 'timeList',
                period: 'period'
            },

            events: {
                REMOVE_MODULE: "fx.filter.module.remove",
                READY: "fx.filter.component.ready",
                DESELECT: 'fx.filter.module.deselect.'
            }
            //For filter logic .... end
        };

        function FX_ui_geographic_component(optionsDefault) {

            if (this.options === undefined) {
                this.options = {};
            }

            $.extend(true, this.options, o, optionsDefault);
        };

        FX_ui_geographic_component.prototype._initialize = function (e) {

            // map
            this.$mapSelector = $('#' + e.template.descriptions.GEO.MAP_ID)

        };

        FX_ui_geographic_component.prototype.render = function (e, container) {

            var self = this;

            self.options.container = container;

            self.options.module = e;

            $.extend(self.options.events, e.events); // extend events passed from the host

            this.$componentStructure = e.template.overallStructure;

            this.$container = $(container);

            this.$container.append(this.$componentStructure);

            this._initialize(e);

            // initialize map
            this._renderMAp();



             this.bindEventListeners();


            if ((e.adapter != null) && (typeof e.adapter != "undefined")) {
                self.options.adapter = e.adapter;
            }

            self.options.name = e.name;
            self.options.componentid = $(container).attr("id");
            //Raise an event to show that the component has been rendered
            $(container).trigger(self.options.events.READY, {name: e.name});

        };

        FX_ui_geographic_component.prototype._renderMAp = function () {

           this.$leafletMap = new L.Map('map-filter', {
                zoomControl: false,
                layers: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
            });

            this.$leafletMap.addControl(L.control.zoom({position: 'topright'}));

            var geoLayer = L.geoJson(JSON.parse(GEOJSON)).addTo(this.$leafletMap);

            // zoom on every country to select
            this.$leafletMap.fitBounds(geoLayer.getBounds())
                .setMaxBounds(geoLayer.getBounds().pad(0.5));

            var geoList = new L.Control.GeoJSONSelector(geoLayer);

            geoList.on('item-active', function (e) {
                $('#map-filter').prev('label').text(e.layer.feature.properties.name)
                console.log(JSON.stringify(e.layer.feature.properties));
            });

            this.$leafletMap.addControl(geoList);



        }

        FX_ui_geographic_component.prototype.validate = function (e) {

            //TODO

            if ((e.component.hasOwnProperty("sourceType")) && (e.component.hasOwnProperty("defaultsource"))) {
                return true;
            }
            else {
                throw new Error("ELEM_NOT_SOURCE");
            }

            return true;
        };

        FX_ui_geographic_component.prototype.processData = function (dataType, data) {
            // TODO

            var r = [];
            if (dataType == o.sourceType.timelist) {
                //Array of years
                data.sort(function (a, b) {
                    if (a < b)
                        return -1;
                    if (a > b)
                        return 1;
                    return 0;
                });

                $(data).each(function (index, item) {
                    r.push({"text": "" + item, "id": item, "children": false});
                });
            }
            else if (dataType == o.sourceType.period) {
                //Array of json object {from: to}
                $(data).each(function (index, item) {
                    var start_year = item.from;
                    var end_year = item.to;
                    var iYear = 0;
                    if (start_year <= end_year) {
                        for (iYear = start_year; iYear <= end_year; iYear++) {
                            r.push({"text": "" + iYear, "id": iYear, "children": false});
                        }
                    }
                });
            }

            return r;
        };

        FX_ui_geographic_component.prototype.bindEventListeners = function () {

            var self = this;

            // oresize jqallrange slider
            $(this.options.css_classes.RESIZE).on('click', function () {
                self.$leafletMap.invalidateSize();
            })


            amplify.subscribe(E.MODULE_DESELECT + '.' + self.options.module.name, function (e) {
                self.deselectValue(e);
            });
        };

        FX_ui_geographic_component.prototype.deselectValue = function (obj) {


        };

        //For filter logic .... start
        FX_ui_geographic_component.prototype.getName = function () {
            return this.options.name;
        };

        FX_ui_geographic_component.prototype.getAdapter = function () {
            return this.options.adapter;
        };
        //For filter logic .... end

        FX_ui_geographic_component.prototype.getValues = function (e) {


            return {

                country_selected:{

                }



            };
        };

        return FX_ui_geographic_component;
    });