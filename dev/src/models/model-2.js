define(function () {


    return {

        parentsector_code: {

            selector: {
                id: "dropdown",
                default: ["600"],
                config: {
                    placeholder: "Please select",
                    plugins: ['remove_button'],
                    mode: 'multi'
                }
            },

            cl: {
                uid: "crs_dac",
                version: "2016",
                level: 1,
                levels: 1
            },

            template: {
                hideSwitch: true,
                hideRemoveButton: true
            }
        },

        purposecode: {

            selector: {

                id: "dropdown",

                config: {
                    //maxItems: 1,
                    placeholder: "All",
                    plugins: ['remove_button'],
                    mode: 'multi'
                }
            },

            cl: {
                codes: ["60010", "60020", "60030", "60040", "60061", "60062", "60063"],
                "uid": "crs_dac",
                "version": "2016",
                "level": 2,
                "levels": 2
            },
            template: {
                hideSwitch: true,
                hideRemoveButton: true
            },
            dependencies: {
                "parentsector_code": {
                    id: "parent",
                    event: "select",
                    args: {
                        body: {
                            levels: 9999
                        },
                        exclude: ["240", "600", "250", "910", "311"]
                    }
                }, //obj or array of obj
            }
        },
    }

});
