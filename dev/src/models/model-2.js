define(function () {

    var IANA = {uid: 'IANAcharacterSet'},
        Role = [
            { "value": "owner", "label": "Owner" },
            { "value": "distributor", "label": "Distributor" },
            { "value": "producer", "label": "Producer" },
            { "value": "other", "label": "Other" }
        ],
        GAUL = {uid: 'GAUL0', version: "2014"},
        Languages = {uid: 'ISO639-2', version: "1998"},
        PeriodOfReference = {uid: 'FAO_Period', version: "1.0"},
        TypeOfCollection = {uid: 'FAOSTAT_Collection', version: "1.0"},
        OriginOfCollectedData = {uid: 'FAOSTAT_OriginData', version: "1.0"},
        DataAdjustment = {uid: 'CL_ADJUSTMENT', version: "1.1"},
        StatusConfidenciality = {uid: 'CL_CONF_STATUS', version: "1.0"},
        AreaOfReference = {uid: 'GAUL_ReferenceArea', version: "1.0"},
        DisseminationPeriodicy = {uid: 'FAO_Period', version: "1.0"},
        PeriodicityDataCollection = {uid: 'FAO_Period', version: "1.0"},
        UpdatePeriodicity = {uid: 'FAO_Period', version: "1.0"},
        CoverageSectorDetails = {uid: 'CRS_purpose_codes'},
        CoverageSector = {uid: 'CRS_purpose_codes'}; // CSTAT_Core


    return {
        "title": {
            "selector": {
                "id": "input",
                "type": "text",
                "source": [
                    {
                        "value": "title",
                        "label": "Title"
                    }
                ]
            },
            "template": {
                "title": "Title",
                "description": "Textual label used as title of the resource.",

            },
            "format": {
                "output" : "label"
            },
            "constraints": { "presence" : true  }

        },
        "creationDate": {
            "selector": {
                "id": "time"
            },
            "template": {
                "title": "Creation Date",
                "description": "Creation date of the resource.",

            },
            "format": {
                "output" : "date"
            },
            "constraints": { "presence" : true  }
        },
        "characterSet": {
            "cl": IANA,
            "selector": {
                "id": "dropdown",
                "default": ['106']
            },
            "template": {
                "title": "Character-set",
                "description": "Full name of the character coding standard used by the resource.",

            },
            "format": {
                "output" : "codes"
            },

            "constraints": { "presence" : true  }
        },
        "language": {
            "cl": Languages,
            "selector": {
                "id": "dropdown",
                "default": ['eng']
            },
            "template": {
                "title": "Language(s)",
                "description": "Language used by the resource for textual information.",

            },
            "format": {
                "output" : "codes"
            }
        },
        "languageDetails": {
            "selector": {
                "id": "input",
                "type": "text",
                "source": [
                    {
                        "value": "languageDetails",
                        "label": "Language details"
                    }
                ]
            },
            "template": {
                "title": "Language details",
                "description": "Comments and additional details about the language used for the textual information of the resource. This field is addressed to highlight some particular inconsistencies in the language (or languages) used in the resource, if any. For example to alert that the resource is not completely homogeneous in the language used for textual information. Otherwise it can be leaved empty.",

            },
            "format": {
                "output" : "label"
            }
        },
        "metadataStandardName": {
            "selector": {
                "id": "input",
                "type": "text",
                "default": "FENIX",
                "source": [
                    {
                        "value": "metadataStandardName",
                        "label": "metadataStandardName"
                    }
                ]
            },
            "template": {
                "title": "Used metadata standard",
                "description": "Name of the metadata standard specifications used. In FENIX framework this field would be pre-compiled by 'FENIX'.",

            },
            "format": {
                "output" : "string"
            },
            "constraints": { "presence" : true  }
        },
        "metadataStandardVersion": {
            "selector": {
                "id": "input",
                "type": "text",
                "default": "1.0",
                "source": [
                    {
                        "value": "metadataStandardVersion",
                        "label": "metadataStandardVersion"
                    }
                ]
            },
            "template": {
                "title": "Version of metadata standard",
                "description": "Version of the metadata standard specifications used.",

            },
            "format": {
                "output" : "string"
            }
        },
        "metadataLanguage": {
            "cl": Languages,
            "selector": {
                "id": "dropdown",
                "default": ['eng']
            },
            "template": {
                "title": "metadataLanguage",
                "description": "Language(s) used for metadata",

            },
            "format": {
                "output" : "codes"
            }
        },
        "noDataValue": {
            "selector": {
                "id": "input",
                "type": "text",
                "source": [
                    {
                        "value": "noDataValue",
                        "label": "Value assigned to No-data"
                    }
                ]
            },
            "template": {
                "title": "Value assigned to No-data",
                "description": " Value assigned to the cells to represent the absence of data. Missing values are usually highlight through apposite ags, however the data matrix does not report empty cells but a predefined combination of characters (such as 'NA', '000' . . . ) indicating the absence of data.",

            },
            "format": {
                "output" : "string"
            }
        },

        "contacts": {

            template : {
                title: "Contacts"
            },

            classNames: "well",

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
                        "output" : "label"
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
                        "output" : "label"
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
                        "output" : "label"
                    }

                },
                "specify": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{"value": "specify", "label": "Specify"}]

                    },
                    "template": {
                        "title": "Specify",
                        "description": "Textual metadata element that allows to specify the role performed by the responsible party. This field is conditional to the element \u003crole\u003e."

                    },
                    "format": {
                        "output" : "label"
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
                        "output" : "string"
                    }

                },

                "role": {
                    "selector": {
                        "id": "dropdown",
                        source: Role
                    },
                    "template": {
                        "title": "Role",
                        "description": "Textual metadata element that allows to specify the role performed by the responsible party. This field is conditional to the element \u003crole\u003e."

                    },
                    "format": {
                        "output" : "label"
                    }

                },

                "phone": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{ "value": "phone", "label": "Telephone"}]
                    },
                    "template": {
                        "title": "Telephone",
                        "description": "Telephone numbers at which the organization or individual may be contacted.",

                    },
                    "format": {
                        "output" : "template",
                        "path" : "contactInfo.phone"
                    }
                },
                "address": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{ "value": "address", "label": "Address"}]
                    },
                    "template": {
                        "title": "Address",
                        "description": "Physical address at which the organization or individual may be contacted.",

                    },
                    "format": {
                        "output" : "template",
                        "path" : "contactInfo.address"
                    }
                },
                "emailAddress": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{ "value": "emailAddress", "label": "E-mail address"}]
                    },
                    "template": {
                        "title": "E-mail address",
                        "description": "E-mail address at which the organization or individual may be contacted.",

                    },
                    "format": {
                        "output" : "template",
                        "path" : "contactInfo.emailAddress"
                    }
                },
                "hoursOfService": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{ "value": "hoursOfService", "label": "Hour of service"}]
                    },
                    "template": {
                        "title": "Hour of service",
                        "description": "Time period (including time zone) when individuals can contact the organization or individual.",

                    },
                    "format": {
                        "output" : "template",
                        "path" : "contactInfo.hoursOfService"
                    }
                },
                "contactInstruction": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{ "value": "contactInstruction", "label": "Instruction"}]
                    },
                    "template": {
                        "title": "Instruction",
                        "description": "Supplemental instructions on how or when to contact the individual or organization.",

                    },
                    "format": {
                        "output" : "template",
                        "path" : "contactInfo.contactInstruction"
                    }
                }
            },

            format: {
                output: "array<contact>"
            }

        }
    }


});
