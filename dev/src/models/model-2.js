define(function () {


    return {


        "contacts": {

            classNames: "well",

            template: {
                title: "Contacts"
            },

            "incremental": true,

            "selectors": {
                "organization": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{"value": "organization", "label": "Organization"}]
                    },
                    "template": {
                        "title": "Organization",
                        "description": "Name of the responsible organization."

                    },
                    "format": {
                        "output": "label"
                    }
                },
                "organizationUnit": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{"value": "organizationUnit", "label": "Organization unit/division"}]

                    },
                    "template": {
                        "title": "Organization unit/division",
                        "description": "Addressable subdivision of an organization."

                    },
                    "format": {
                        "output": "label"
                    }

                },
                "position": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{"value": "organizationUnit", "label": "Position"}]

                    },
                    "template": {
                        "title": "Position",
                        "description": "Role or position of the responsible person."

                    },
                    "format": {
                        "output": "label"
                    }

                },
                "pointOfContact": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{"value": "pointOfContact", "label": "Point of contact"}]

                    },
                    "template": {
                        "title": "Point of contact",
                        "description": "Responsible person-surname, given name, title separated by a delimiter. It contains information about the party who can be contacted for acquiring knowledge the resource."

                    },
                    "format": {
                        "output": "string"
                    }

                },

                "role": {
                    "selector": {
                        "id": "dropdown",
                        source: [
                            {"value": "owner", "label": "Owner"},
                            {"value": "distributor", "label": "Distributor"},
                            {"value": "producer", "label": "Producer"},
                            {"value": "other", "label": "Other"}
                        ]
                    },
                    "template": {
                        "title": "Role",
                        "description": "Textual metadata element that allows to specify the role performed by the responsible party. This field is conditional to the element \u003crole\u003e."

                    },
                    "format": {
                        "output": "label"
                    }

                },

                "specify": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{"value": "specify", "label": "Specify"}],
                        config: {
                            readonly: true
                        }

                    },
                    "dependencies": {
                        "role": [{id: "readOnlyIfNotValue", event: "select", args: {value: "other"}}]
                    },
                    "template": {
                        "title": "Specify",
                        "description": "Textual metadata element that allows to specify the role performed by the responsible party. This field is conditional to the element \u003crole\u003e."

                    },
                    "format": {
                        "output": "label"
                    }

                },

                "phone": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{"value": "phone", "label": "Telephone"}]
                    },
                    "template": {
                        "title": "Telephone",
                        "description": "Telephone numbers at which the organization or individual may be contacted.",

                    },
                    "format": {
                        "output": "template",
                        "path": "contactInfo.phone"
                    }
                },
                "address": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{"value": "address", "label": "Address"}]
                    },
                    "template": {
                        "title": "Address",
                        "description": "Physical address at which the organization or individual may be contacted.",

                    },
                    "format": {
                        "output": "template",
                        "path": "contactInfo.address"
                    }
                },
                "emailAddress": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{"value": "emailAddress", "label": "E-mail address"}]
                    },
                    "template": {
                        "title": "E-mail address",
                        "description": "E-mail address at which the organization or individual may be contacted.",

                    },
                    "format": {
                        "output": "template",
                        "path": "contactInfo.emailAddress"
                    }
                },
                "hoursOfService": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{"value": "hoursOfService", "label": "Hour of service"}]
                    },
                    "template": {
                        "title": "Hour of service",
                        "description": "Time period (including time zone) when individuals can contact the organization or individual.",

                    },
                    "format": {
                        "output": "template",
                        "path": "contactInfo.hoursOfService"
                    }
                },
                "contactInstruction": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{"value": "contactInstruction", "label": "Instruction"}]
                    },
                    "template": {
                        "title": "Instruction",
                        "description": "Supplemental instructions on how or when to contact the individual or organization.",

                    },
                    "format": {
                        "output": "template",
                        "path": "contactInfo.contactInstruction"
                    }
                }
            },

            format: {
                output: "array<contact>"
            }

        }


    }


});
