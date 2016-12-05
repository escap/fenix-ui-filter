/*global define*/

define(function () {

    'use strict';

    return {

        checkbox: {

            selector: {
                id: "input",
                type: "checkbox",
                source: [
                    {value: "item_1", label: "Item 1"},
                    {value: "item_2", label: "Item 2"}
                ]
            },

            template: {
                title: "Checkbox",
                hideSwitch: false,
                hideRemoveButton: false
            }
        },

        radio: {

            selector: {
                id: "input",
                type: "radio",
                source: [
                    {value: "item_1", label: "Item 1"},
                    {value: "item_2", label: "Item 2"}
                ],
                default: ["item_1"]
            },

            template: {
                title: "Radio",
                hideSwitch: false,
                hideRemoveButton: false
            }
        },

        text: {

            selector: {
                id: "input",
                type: "text",
                source: [
                    {value: "item_1", label: "Item 1"}
                ]
            },

            template: {
                title: "Input Text",
                hideSwitch: false,
                hideRemoveButton: false
            }
        },

        textDisabled: {

            selector: {
                id: "input",
                type: "text",
                source: [
                    {value: "item_1", label: "Item 1"}
                ],
                disabled: true
            },

            template: {
                title: "Input Text",
                hideSwitch: false,
                hideRemoveButton: false
            }
        },

        tree: {

            selector: {
                id: "tree",
                source: [
                    {value: "item_1", label: "Item 1"},
                    {value: "item_2", label: "Item 2"}
                ],
                default: ["item_1"]
            },

            template: {
                title: "Tree",
                hideSwitch: false,
                hideRemoveButton: false
            }
        },

        treeTriple: {

            selectors: {

                first: {

                    selector: {
                        id: "tree",
                        source: [
                            {value: "item_1", label: "Item 1"},
                            {value: "item_2", label: "Item 2"}
                        ],
                        default: ["item_1"]
                    },

                    template: {
                        title: "First tab"
                    }

                },

                second: {
                    selector: {
                        id: "tree",
                        source: [
                            {value: "item_3", label: "Item 3"},
                            {value: "item_4", label: "Item 4"}
                        ],
                        default: ["item_4"]
                    },

                    template: {
                        title: "Second tab"
                    }
                },

                third: {
                    selector: {
                        id: "tree",
                        source: [
                            {value: "item_5", label: "Item 5"},
                            {value: "item_6", label: "Item 6"}
                        ],
                        default: ["item_5"]
                    },

                    template: {
                        title: "Third tab"
                    }
                }
            },

            template: {
                title: "Triple Tree",
                hideSwitch: false,
                hideRemoveButton: false
            }
        },

        treeDisabled: {

            selector: {
                id: "tree",
                source: [
                    {value: "item_1", label: "Item 1"},
                    {value: "item_2", label: "Item 2"}
                ],
                default: ["item_1"],
                disabled: true
            },

            template: {
                title: "Disabled tree",
                hideSwitch: false,
                hideRemoveButton: false
            }
        },

        treeSingle: {

            selector: {
                id: "tree",
                source: [
                    {value: "item_1", label: "Item 1"},
                    {value: "item_2", label: "Item 2"}
                ],
                default: ["item_1"],
                config: {
                    core: {
                        multiple: false
                    }
                }
            },

            template: {
                title: "Single selection",
                hideSwitch: false,
                hideRemoveButton: false
            }
        },

        dropdown: {

            selector: {
                id: "dropdown",
                source: [
                    {value: "item_1", label: "Item 1"},
                    {value: "item_2", label: "Item 2"}
                ]
            },

            template: {
                title: "Multiple selection",
                hideSwitch: false,
                hideRemoveButton: false
            }
        },

        dropdownSingle: {

            selector: {
                id: "dropdown",
                source: [
                    {value: "item_1", label: "Item 1"},
                    {value: "item_2", label: "Item 2"}
                ],
                config: {
                    maxItems: 1
                }
            },

            template: {
                title: "Single selection",
                hideSwitch: false,
                hideRemoveButton: false
            }
        },

        dropdownDisabled: {

            selector: {
                id: "dropdown",
                source: [
                    {value: "item_1", label: "Item 1"},
                    {value: "item_2", label: "Item 2"}
                ],
                disabled: true
            },

            template: {
                title: "Disabled",
                hideSwitch: false,
                hideRemoveButton: false
            }
        },

        range: {

            selector: {
                id: "range"
            },

            template: {
                title: "Range",
                hideSwitch: false,
                hideRemoveButton: false
            }
        },

        rangeDouble: {

            selector: {
                id: "range",
                config: {
                    min: 100,
                    max: 200,
                    type: "double"
                }
            },

            template: {
                title: "Double Range",
                hideSwitch: false,
                hideRemoveButton: false
            }

        },

        rangeDisabled: {

            selector: {
                id: "range",
                disabled: true
            },

            template: {
                title: "Double Range",
                hideSwitch: false,
                hideRemoveButton: false
            }

        },

        sortable: {

            selector: {
                id: "sortable",
                source: [
                    {value: 'item_1', label: "Item 1"},
                    {value: 'item_2', label: "Item 2"}
                ]
            },

            template: {
                title: "Sortable",
                hideSwitch: false,
                hideRemoveButton: false
            }
        },

        drag: {

            selector: {
                id: "sortable",
                source: [
                    {value: 'item_1', label: "Item 1", parent: "parent_1"},
                    {value: 'item_2', label: "Item 2", parent: "parent_1"},
                    {value: 'item_3', label: "Item 3", parent: "parent_1"},
                    {value: 'item_4', label: "Item 4", parent: "parent_1"},
                    {value: 'item_5', label: "Item 5", parent: "parent_1"},
                    {value: 'item_6', label: "Item 6", parent: "parent_2"},
                    {value: 'item_7', label: "Item 7", parent: "parent_2"},
                    {value: 'item_8', label: "Item 8", parent: "parent_2"}
                ],
                config: {
                    groups: {
                        parent_1: "Parent 1",
                        parent_2: "Parent 2"
                    }
                }
            },

            template: {
                title: "Drag & Drop",
                hideSwitch: false,
                hideRemoveButton: false
            }
        },

        sortableDisabled: {

            selector: {
                id: "sortable",
                source: [
                    {value: 'item_1', label: "Item 1"},
                    {value: 'item_2', label: "Item 2"},
                    {value: 'item_3', label: "Item 3"},
                    {value: 'item_4', label: "Item 4"},
                    {value: 'item_5', label: "Item 5"},
                    {value: 'item_6', label: "Item 6"}
                ],
                disabled: true
            },

            template: {
                title: "Disabled",
                hideSwitch: false,
                hideRemoveButton: false
            }
        },

        sortableCustomRender: {

            selector: {
                id: "sortable",
                source: [
                    {value: 'item_1', label: "Item 1"},
                    {value: 'item_2', label: "Item 2"},
                    {value: 'item_3', label: "Item 3"},
                    {value: 'item_4', label: "Item 4"},
                    {value: 'item_5', label: "Item 5"},
                    {value: 'item_6', label: "Item 6"}
                ],
                config: {
                    itemRender: function (model) {

                        var $el = $("<u><mark> " + model.label + "</mark></u>");

                        return $el;
                    }
                }
            },

            template: {
                title: "Disabled",
                hideSwitch: false,
                hideRemoveButton: false
            }
        },

        time: {

            selector: {
                id: "time",
                default: ["Thu Mar 8 2016 17:04:58 GMT+0100 (CET)"]
            },

            template: {
                title: "Time",
                hideSwitch: false,
                hideRemoveButton: false
            }
        },

        timeDisabled: {

            selector: {
                id: "time",
                default: ["Thu Mar 8 2016 17:04:58 GMT+0100 (CET)"],
                disabled: true
            },

            template: {
                title: "Time",
                hideSwitch: false,
                hideRemoveButton: false
            }
        }

    }

});