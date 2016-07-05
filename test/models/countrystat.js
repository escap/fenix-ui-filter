define(function () {

    return {


/*
        "countrycode": {

            "selector": {
                "id": "tree",
                "hideSummary": false,
                "source": [
                    {
                        "value": "AMU",
                        "label": "AMU",
                        "parent": "#"
                    },
                    {
                        "value": "DZA",
                        "label": "Algeria",
                        "parent": "AMU"
                    },
                    {
                        "value": "DZA",
                        "label": "Algeria",
                        "parent": "OPC"
                    },
                    {
                        "value": "DZA",
                        "label": "Algeria",
                        "parent": "B5"
                    },
                    {
                        "value": "DZA",
                        "label": "Algeria",
                        "parent": "SRONA"
                    },
                    {
                        "value": "AGO",
                        "label": "Angola",
                        "parent": "LDC"
                    },
                    {
                        "value": "AGO",
                        "label": "Angola",
                        "parent": "OPC"
                    },
                    {
                        "value": "AGO",
                        "label": "Angola",
                        "parent": "ECCAS"
                    },
                    {
                        "value": "AGO",
                        "label": "Angola",
                        "parent": "SADC"
                    },
                    {
                        "value": "AGO",
                        "label": "Angola",
                        "parent": "SROSA"
                    },
                    {
                        "value": "AGO",
                        "label": "Angola",
                        "parent": "SAF"
                    },
                    {
                        "value": "AGO",
                        "label": "Angola",
                        "parent": "COMESA"
                    },
                    {
                        "value": "AGO",
                        "label": "Angola",
                        "parent": "OLDC"
                    },
                    {
                        "value": "B5",
                        "label": "B5",
                        "parent": "#"
                    },
                    {
                        "value": "BEN",
                        "label": "Benin",
                        "parent": "SROWA"
                    },
                    {
                        "value": "BEN",
                        "label": "Benin",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "BEN",
                        "label": "Benin",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "BEN",
                        "label": "Benin",
                        "parent": "NOPC"
                    },
                    {
                        "value": "BEN",
                        "label": "Benin",
                        "parent": "LDC"
                    },
                    {
                        "value": "BEN",
                        "label": "Benin",
                        "parent": "ECOWAS"
                    },
                    {
                        "value": "BEN",
                        "label": "Benin",
                        "parent": "SAF"
                    },
                    {
                        "value": "BWA",
                        "label": "Botswana",
                        "parent": "LLC"
                    },
                    {
                        "value": "BWA",
                        "label": "Botswana",
                        "parent": "NOPC"
                    },
                    {
                        "value": "BWA",
                        "label": "Botswana",
                        "parent": "SROSA"
                    },
                    {
                        "value": "BWA",
                        "label": "Botswana",
                        "parent": "SADC"
                    },
                    {
                        "value": "BWA",
                        "label": "Botswana",
                        "parent": "MRC"
                    },
                    {
                        "value": "BWA",
                        "label": "Botswana",
                        "parent": "SAF"
                    },
                    {
                        "value": "BFA",
                        "label": "Burkina Faso",
                        "parent": "LLLDC"
                    },
                    {
                        "value": "BFA",
                        "label": "Burkina Faso",
                        "parent": "ECOWAS"
                    },
                    {
                        "value": "BFA",
                        "label": "Burkina Faso",
                        "parent": "LDC"
                    },
                    {
                        "value": "BFA",
                        "label": "Burkina Faso",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "BFA",
                        "label": "Burkina Faso",
                        "parent": "SROWA"
                    },
                    {
                        "value": "BFA",
                        "label": "Burkina Faso",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "BFA",
                        "label": "Burkina Faso",
                        "parent": "LLC"
                    },
                    {
                        "value": "BFA",
                        "label": "Burkina Faso",
                        "parent": "NOPC"
                    },
                    {
                        "value": "BFA",
                        "label": "Burkina Faso",
                        "parent": "SAF"
                    },
                    {
                        "value": "BDI",
                        "label": "Burundi",
                        "parent": "EAC"
                    },
                    {
                        "value": "BDI",
                        "label": "Burundi",
                        "parent": "SROEA"
                    },
                    {
                        "value": "BDI",
                        "label": "Burundi",
                        "parent": "LLC"
                    },
                    {
                        "value": "BDI",
                        "label": "Burundi",
                        "parent": "NOPC"
                    },
                    {
                        "value": "BDI",
                        "label": "Burundi",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "BDI",
                        "label": "Burundi",
                        "parent": "ECCAS"
                    },
                    {
                        "value": "BDI",
                        "label": "Burundi",
                        "parent": "SAF"
                    },
                    {
                        "value": "BDI",
                        "label": "Burundi",
                        "parent": "LLLDC"
                    },
                    {
                        "value": "BDI",
                        "label": "Burundi",
                        "parent": "LDC"
                    },
                    {
                        "value": "BDI",
                        "label": "Burundi",
                        "parent": "COMESA"
                    },
                    {
                        "value": "CENSAD",
                        "label": "CEN-SAD",
                        "parent": "#"
                    },
                    {
                        "value": "COMESA",
                        "label": "COMESA",
                        "parent": "#"
                    },
                    {
                        "value": "CPV",
                        "label": "Cabo Verde",
                        "parent": "NOPC"
                    },
                    {
                        "value": "CPV",
                        "label": "Cabo Verde",
                        "parent": "SROWA"
                    },
                    {
                        "value": "CPV",
                        "label": "Cabo Verde",
                        "parent": "SAF"
                    },
                    {
                        "value": "CPV",
                        "label": "Cabo Verde",
                        "parent": "ISE"
                    },
                    {
                        "value": "CPV",
                        "label": "Cabo Verde",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "CPV",
                        "label": "Cabo Verde",
                        "parent": "ECOWAS"
                    },
                    {
                        "value": "CPV",
                        "label": "Cabo Verde",
                        "parent": "LDC"
                    },
                    {
                        "value": "CMR",
                        "label": "Cameroon",
                        "parent": "SAF"
                    },
                    {
                        "value": "CMR",
                        "label": "Cameroon",
                        "parent": "OPC"
                    },
                    {
                        "value": "CMR",
                        "label": "Cameroon",
                        "parent": "ECCAS"
                    },
                    {
                        "value": "CMR",
                        "label": "Cameroon",
                        "parent": "SROCA"
                    },
                    {
                        "value": "CAF",
                        "label": "Central African Republic",
                        "parent": "LLLDC"
                    },
                    {
                        "value": "CAF",
                        "label": "Central African Republic",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "CAF",
                        "label": "Central African Republic",
                        "parent": "LDC"
                    },
                    {
                        "value": "CAF",
                        "label": "Central African Republic",
                        "parent": "ECCAS"
                    },
                    {
                        "value": "CAF",
                        "label": "Central African Republic",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "CAF",
                        "label": "Central African Republic",
                        "parent": "MRC"
                    },
                    {
                        "value": "CAF",
                        "label": "Central African Republic",
                        "parent": "NOPC"
                    },
                    {
                        "value": "CAF",
                        "label": "Central African Republic",
                        "parent": "SAF"
                    },
                    {
                        "value": "CAF",
                        "label": "Central African Republic",
                        "parent": "LLC"
                    },
                    {
                        "value": "CAF",
                        "label": "Central African Republic",
                        "parent": "SROCA"
                    },
                    {
                        "value": "TCD",
                        "label": "Chad",
                        "parent": "SROCA"
                    },
                    {
                        "value": "TCD",
                        "label": "Chad",
                        "parent": "LLC"
                    },
                    {
                        "value": "TCD",
                        "label": "Chad",
                        "parent": "LDC"
                    },
                    {
                        "value": "TCD",
                        "label": "Chad",
                        "parent": "LLLDC"
                    },
                    {
                        "value": "TCD",
                        "label": "Chad",
                        "parent": "OPC"
                    },
                    {
                        "value": "TCD",
                        "label": "Chad",
                        "parent": "SAF"
                    },
                    {
                        "value": "TCD",
                        "label": "Chad",
                        "parent": "OLDC"
                    },
                    {
                        "value": "TCD",
                        "label": "Chad",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "TCD",
                        "label": "Chad",
                        "parent": "ECCAS"
                    },
                    {
                        "value": "COM",
                        "label": "Comoros",
                        "parent": "ISE"
                    },
                    {
                        "value": "COM",
                        "label": "Comoros",
                        "parent": "COMESA"
                    },
                    {
                        "value": "COM",
                        "label": "Comoros",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "COM",
                        "label": "Comoros",
                        "parent": "SAF"
                    },
                    {
                        "value": "COM",
                        "label": "Comoros",
                        "parent": "LDC"
                    },
                    {
                        "value": "COM",
                        "label": "Comoros",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "COM",
                        "label": "Comoros",
                        "parent": "NOPC"
                    },
                    {
                        "value": "COM",
                        "label": "Comoros",
                        "parent": "SROEA"
                    },
                    {
                        "value": "COG",
                        "label": "Congo",
                        "parent": "ECCAS"
                    },
                    {
                        "value": "COG",
                        "label": "Congo",
                        "parent": "OPC"
                    },
                    {
                        "value": "COG",
                        "label": "Congo",
                        "parent": "SROCA"
                    },
                    {
                        "value": "COG",
                        "label": "Congo",
                        "parent": "SAF"
                    },
                    {
                        "value": "CIV",
                        "label": "Cote d'Ivoire",
                        "parent": "SAF"
                    },
                    {
                        "value": "CIV",
                        "label": "Cote d'Ivoire",
                        "parent": "SROWA"
                    },
                    {
                        "value": "CIV",
                        "label": "Cote d'Ivoire",
                        "parent": "OPC"
                    },
                    {
                        "value": "CIV",
                        "label": "Cote d'Ivoire",
                        "parent": "ECOWAS"
                    },
                    {
                        "value": "CIV",
                        "label": "Cote d'Ivoire",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "COD",
                        "label": "Democratic Republic of the Congo",
                        "parent": "COMESA"
                    },
                    {
                        "value": "COD",
                        "label": "Democratic Republic of the Congo",
                        "parent": "LDC"
                    },
                    {
                        "value": "COD",
                        "label": "Democratic Republic of the Congo",
                        "parent": "NOPC"
                    },
                    {
                        "value": "COD",
                        "label": "Democratic Republic of the Congo",
                        "parent": "MRC"
                    },
                    {
                        "value": "COD",
                        "label": "Democratic Republic of the Congo",
                        "parent": "SADC"
                    },
                    {
                        "value": "COD",
                        "label": "Democratic Republic of the Congo",
                        "parent": "ECCAS"
                    },
                    {
                        "value": "COD",
                        "label": "Democratic Republic of the Congo",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "COD",
                        "label": "Democratic Republic of the Congo",
                        "parent": "SAF"
                    },
                    {
                        "value": "COD",
                        "label": "Democratic Republic of the Congo",
                        "parent": "SROEA"
                    },
                    {
                        "value": "DJI",
                        "label": "Djibouti",
                        "parent": "IGAD"
                    },
                    {
                        "value": "DJI",
                        "label": "Djibouti",
                        "parent": "LDC"
                    },
                    {
                        "value": "DJI",
                        "label": "Djibouti",
                        "parent": "SAF"
                    },
                    {
                        "value": "DJI",
                        "label": "Djibouti",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "DJI",
                        "label": "Djibouti",
                        "parent": "SROEA"
                    },
                    {
                        "value": "DJI",
                        "label": "Djibouti",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "DJI",
                        "label": "Djibouti",
                        "parent": "NOPC"
                    },
                    {
                        "value": "DJI",
                        "label": "Djibouti",
                        "parent": "COMESA"
                    },
                    {
                        "value": "EAC",
                        "label": "EAC",
                        "parent": "#"
                    },
                    {
                        "value": "ECCAS",
                        "label": "ECCAS",
                        "parent": "#"
                    },
                    {
                        "value": "ECOWAS",
                        "label": "ECOWAS",
                        "parent": "#"
                    },
                    {
                        "value": "EGY",
                        "label": "Egypt",
                        "parent": "OPC"
                    },
                    {
                        "value": "EGY",
                        "label": "Egypt",
                        "parent": "SRONA"
                    },
                    {
                        "value": "EGY",
                        "label": "Egypt",
                        "parent": "COMESA"
                    },
                    {
                        "value": "EGY",
                        "label": "Egypt",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "EGY",
                        "label": "Egypt",
                        "parent": "B5"
                    },
                    {
                        "value": "GNQ",
                        "label": "Equatorial Guinea",
                        "parent": "ECCAS"
                    },
                    {
                        "value": "GNQ",
                        "label": "Equatorial Guinea",
                        "parent": "LDC"
                    },
                    {
                        "value": "GNQ",
                        "label": "Equatorial Guinea",
                        "parent": "OLDC"
                    },
                    {
                        "value": "GNQ",
                        "label": "Equatorial Guinea",
                        "parent": "SROCA"
                    },
                    {
                        "value": "GNQ",
                        "label": "Equatorial Guinea",
                        "parent": "SAF"
                    },
                    {
                        "value": "GNQ",
                        "label": "Equatorial Guinea",
                        "parent": "OPC"
                    },
                    {
                        "value": "ERI",
                        "label": "Eritrea",
                        "parent": "SAF"
                    },
                    {
                        "value": "ERI",
                        "label": "Eritrea",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "ERI",
                        "label": "Eritrea",
                        "parent": "IGAD"
                    },
                    {
                        "value": "ERI",
                        "label": "Eritrea",
                        "parent": "NOPC"
                    },
                    {
                        "value": "ERI",
                        "label": "Eritrea",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "ERI",
                        "label": "Eritrea",
                        "parent": "COMESA"
                    },
                    {
                        "value": "ERI",
                        "label": "Eritrea",
                        "parent": "SROEA"
                    },
                    {
                        "value": "ERI",
                        "label": "Eritrea",
                        "parent": "LDC"
                    },
                    {
                        "value": "ETH",
                        "label": "Ethiopia",
                        "parent": "LLC"
                    },
                    {
                        "value": "ETH",
                        "label": "Ethiopia",
                        "parent": "NOPC"
                    },
                    {
                        "value": "ETH",
                        "label": "Ethiopia",
                        "parent": "LDC"
                    },
                    {
                        "value": "ETH",
                        "label": "Ethiopia",
                        "parent": "COMESA"
                    },
                    {
                        "value": "ETH",
                        "label": "Ethiopia",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "ETH",
                        "label": "Ethiopia",
                        "parent": "IGAD"
                    },
                    {
                        "value": "ETH",
                        "label": "Ethiopia",
                        "parent": "SROEA"
                    },
                    {
                        "value": "ETH",
                        "label": "Ethiopia",
                        "parent": "SAF"
                    },
                    {
                        "value": "ETH",
                        "label": "Ethiopia",
                        "parent": "LLLDC"
                    },
                    {
                        "value": "GAB",
                        "label": "Gabon",
                        "parent": "SAF"
                    },
                    {
                        "value": "GAB",
                        "label": "Gabon",
                        "parent": "SROCA"
                    },
                    {
                        "value": "GAB",
                        "label": "Gabon",
                        "parent": "ECCAS"
                    },
                    {
                        "value": "GAB",
                        "label": "Gabon",
                        "parent": "OPC"
                    },
                    {
                        "value": "GMB",
                        "label": "Gambia",
                        "parent": "SAF"
                    },
                    {
                        "value": "GMB",
                        "label": "Gambia",
                        "parent": "ECOWAS"
                    },
                    {
                        "value": "GMB",
                        "label": "Gambia",
                        "parent": "SROWA"
                    },
                    {
                        "value": "GMB",
                        "label": "Gambia",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "GMB",
                        "label": "Gambia",
                        "parent": "LDC"
                    },
                    {
                        "value": "GMB",
                        "label": "Gambia",
                        "parent": "NOPC"
                    },
                    {
                        "value": "GMB",
                        "label": "Gambia",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "GHA",
                        "label": "Ghana",
                        "parent": "SROWA"
                    },
                    {
                        "value": "GHA",
                        "label": "Ghana",
                        "parent": "ECOWAS"
                    },
                    {
                        "value": "GHA",
                        "label": "Ghana",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "GHA",
                        "label": "Ghana",
                        "parent": "NOPC"
                    },
                    {
                        "value": "GHA",
                        "label": "Ghana",
                        "parent": "MRC"
                    },
                    {
                        "value": "GHA",
                        "label": "Ghana",
                        "parent": "SAF"
                    },
                    {
                        "value": "GIN",
                        "label": "Guinea",
                        "parent": "SAF"
                    },
                    {
                        "value": "GIN",
                        "label": "Guinea",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "GIN",
                        "label": "Guinea",
                        "parent": "SROWA"
                    },
                    {
                        "value": "GIN",
                        "label": "Guinea",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "GIN",
                        "label": "Guinea",
                        "parent": "ECOWAS"
                    },
                    {
                        "value": "GIN",
                        "label": "Guinea",
                        "parent": "MRC"
                    },
                    {
                        "value": "GIN",
                        "label": "Guinea",
                        "parent": "LDC"
                    },
                    {
                        "value": "GIN",
                        "label": "Guinea",
                        "parent": "NOPC"
                    },
                    {
                        "value": "GNB",
                        "label": "Guinea-Bissau",
                        "parent": "SAF"
                    },
                    {
                        "value": "GNB",
                        "label": "Guinea-Bissau",
                        "parent": "ECOWAS"
                    },
                    {
                        "value": "GNB",
                        "label": "Guinea-Bissau",
                        "parent": "NOPC"
                    },
                    {
                        "value": "GNB",
                        "label": "Guinea-Bissau",
                        "parent": "LDC"
                    },
                    {
                        "value": "GNB",
                        "label": "Guinea-Bissau",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "GNB",
                        "label": "Guinea-Bissau",
                        "parent": "SROWA"
                    },
                    {
                        "value": "GNB",
                        "label": "Guinea-Bissau",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "IGAD",
                        "label": "IGAD",
                        "parent": "#"
                    },
                    {
                        "value": "ISE",
                        "label": "ISE",
                        "parent": "#"
                    },
                    {
                        "value": "KEN",
                        "label": "Kenya",
                        "parent": "SROEA"
                    },
                    {
                        "value": "KEN",
                        "label": "Kenya",
                        "parent": "EAC"
                    },
                    {
                        "value": "KEN",
                        "label": "Kenya",
                        "parent": "COMESA"
                    },
                    {
                        "value": "KEN",
                        "label": "Kenya",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "KEN",
                        "label": "Kenya",
                        "parent": "NOPC"
                    },
                    {
                        "value": "KEN",
                        "label": "Kenya",
                        "parent": "SAF"
                    },
                    {
                        "value": "KEN",
                        "label": "Kenya",
                        "parent": "IGAD"
                    },
                    {
                        "value": "LDC",
                        "label": "LDC",
                        "parent": "#"
                    },
                    {
                        "value": "LLC",
                        "label": "LLC",
                        "parent": "#"
                    },
                    {
                        "value": "LLLDC",
                        "label": "LLLDC",
                        "parent": "#"
                    },
                    {
                        "value": "LSO",
                        "label": "Lesotho",
                        "parent": "LLC"
                    },
                    {
                        "value": "LSO",
                        "label": "Lesotho",
                        "parent": "SROSA"
                    },
                    {
                        "value": "LSO",
                        "label": "Lesotho",
                        "parent": "LDC"
                    },
                    {
                        "value": "LSO",
                        "label": "Lesotho",
                        "parent": "SAF"
                    },
                    {
                        "value": "LSO",
                        "label": "Lesotho",
                        "parent": "LLLDC"
                    },
                    {
                        "value": "LSO",
                        "label": "Lesotho",
                        "parent": "SADC"
                    },
                    {
                        "value": "LSO",
                        "label": "Lesotho",
                        "parent": "NOPC"
                    },
                    {
                        "value": "LSO",
                        "label": "Lesotho",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "LBR",
                        "label": "Liberia",
                        "parent": "SROWA"
                    },
                    {
                        "value": "LBR",
                        "label": "Liberia",
                        "parent": "NOPC"
                    },
                    {
                        "value": "LBR",
                        "label": "Liberia",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "LBR",
                        "label": "Liberia",
                        "parent": "LDC"
                    },
                    {
                        "value": "LBR",
                        "label": "Liberia",
                        "parent": "SAF"
                    },
                    {
                        "value": "LBR",
                        "label": "Liberia",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "LBR",
                        "label": "Liberia",
                        "parent": "ECOWAS"
                    },
                    {
                        "value": "LBY",
                        "label": "Libya",
                        "parent": "COMESA"
                    },
                    {
                        "value": "LBY",
                        "label": "Libya",
                        "parent": "AMU"
                    },
                    {
                        "value": "LBY",
                        "label": "Libya",
                        "parent": "SRONA"
                    },
                    {
                        "value": "LBY",
                        "label": "Libya",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "LBY",
                        "label": "Libya",
                        "parent": "OPC"
                    },
                    {
                        "value": "MRC",
                        "label": "MRC",
                        "parent": "#"
                    },
                    {
                        "value": "MDG",
                        "label": "Madagascar",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "MDG",
                        "label": "Madagascar",
                        "parent": "SAF"
                    },
                    {
                        "value": "MDG",
                        "label": "Madagascar",
                        "parent": "ISE"
                    },
                    {
                        "value": "MDG",
                        "label": "Madagascar",
                        "parent": "NOPC"
                    },
                    {
                        "value": "MDG",
                        "label": "Madagascar",
                        "parent": "LDC"
                    },
                    {
                        "value": "MDG",
                        "label": "Madagascar",
                        "parent": "SADC"
                    },
                    {
                        "value": "MDG",
                        "label": "Madagascar",
                        "parent": "SROEA"
                    },
                    {
                        "value": "MDG",
                        "label": "Madagascar",
                        "parent": "COMESA"
                    },
                    {
                        "value": "MWI",
                        "label": "Malawi",
                        "parent": "SROSA"
                    },
                    {
                        "value": "MWI",
                        "label": "Malawi",
                        "parent": "LDC"
                    },
                    {
                        "value": "MWI",
                        "label": "Malawi",
                        "parent": "COMESA"
                    },
                    {
                        "value": "MWI",
                        "label": "Malawi",
                        "parent": "NOPC"
                    },
                    {
                        "value": "MWI",
                        "label": "Malawi",
                        "parent": "LLLDC"
                    },
                    {
                        "value": "MWI",
                        "label": "Malawi",
                        "parent": "SADC"
                    },
                    {
                        "value": "MWI",
                        "label": "Malawi",
                        "parent": "LLC"
                    },
                    {
                        "value": "MWI",
                        "label": "Malawi",
                        "parent": "SAF"
                    },
                    {
                        "value": "MWI",
                        "label": "Malawi",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "MLI",
                        "label": "Mali",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "MLI",
                        "label": "Mali",
                        "parent": "SROWA"
                    },
                    {
                        "value": "MLI",
                        "label": "Mali",
                        "parent": "NOPC"
                    },
                    {
                        "value": "MLI",
                        "label": "Mali",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "MLI",
                        "label": "Mali",
                        "parent": "ECOWAS"
                    },
                    {
                        "value": "MLI",
                        "label": "Mali",
                        "parent": "MRC"
                    },
                    {
                        "value": "MLI",
                        "label": "Mali",
                        "parent": "LDC"
                    },
                    {
                        "value": "MLI",
                        "label": "Mali",
                        "parent": "LLLDC"
                    },
                    {
                        "value": "MLI",
                        "label": "Mali",
                        "parent": "LLC"
                    },
                    {
                        "value": "MLI",
                        "label": "Mali",
                        "parent": "SAF"
                    },
                    {
                        "value": "MRT",
                        "label": "Mauritania",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "MRT",
                        "label": "Mauritania",
                        "parent": "AMU"
                    },
                    {
                        "value": "MRT",
                        "label": "Mauritania",
                        "parent": "LDC"
                    },
                    {
                        "value": "MRT",
                        "label": "Mauritania",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "MRT",
                        "label": "Mauritania",
                        "parent": "NOPC"
                    },
                    {
                        "value": "MRT",
                        "label": "Mauritania",
                        "parent": "MRC"
                    },
                    {
                        "value": "MRT",
                        "label": "Mauritania",
                        "parent": "SRONA"
                    },
                    {
                        "value": "MUS",
                        "label": "Mauritius",
                        "parent": "ISE"
                    },
                    {
                        "value": "MUS",
                        "label": "Mauritius",
                        "parent": "SROSA"
                    },
                    {
                        "value": "MUS",
                        "label": "Mauritius",
                        "parent": "NOPC"
                    },
                    {
                        "value": "MUS",
                        "label": "Mauritius",
                        "parent": "COMESA"
                    },
                    {
                        "value": "MUS",
                        "label": "Mauritius",
                        "parent": "SADC"
                    },
                    {
                        "value": "MUS",
                        "label": "Mauritius",
                        "parent": "SAF"
                    },
                    {
                        "value": "MAR",
                        "label": "Morocco",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "MAR",
                        "label": "Morocco",
                        "parent": "SRONA"
                    },
                    {
                        "value": "MAR",
                        "label": "Morocco",
                        "parent": "NOPC"
                    },
                    {
                        "value": "MAR",
                        "label": "Morocco",
                        "parent": "AMU"
                    },
                    {
                        "value": "MAR",
                        "label": "Morocco",
                        "parent": "B5"
                    },
                    {
                        "value": "MOZ",
                        "label": "Mozambique",
                        "parent": "SROSA"
                    },
                    {
                        "value": "MOZ",
                        "label": "Mozambique",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "MOZ",
                        "label": "Mozambique",
                        "parent": "MRC"
                    },
                    {
                        "value": "MOZ",
                        "label": "Mozambique",
                        "parent": "LDC"
                    },
                    {
                        "value": "MOZ",
                        "label": "Mozambique",
                        "parent": "SAF"
                    },
                    {
                        "value": "MOZ",
                        "label": "Mozambique",
                        "parent": "NOPC"
                    },
                    {
                        "value": "MOZ",
                        "label": "Mozambique",
                        "parent": "SADC"
                    },
                    {
                        "value": "NOLDC",
                        "label": "NOLDC",
                        "parent": "#"
                    },
                    {
                        "value": "NOPC",
                        "label": "NOPC",
                        "parent": "#"
                    },
                    {
                        "value": "NAM",
                        "label": "Namibia",
                        "parent": "SADC"
                    },
                    {
                        "value": "NAM",
                        "label": "Namibia",
                        "parent": "MRC"
                    },
                    {
                        "value": "NAM",
                        "label": "Namibia",
                        "parent": "SROSA"
                    },
                    {
                        "value": "NAM",
                        "label": "Namibia",
                        "parent": "NOPC"
                    },
                    {
                        "value": "NAM",
                        "label": "Namibia",
                        "parent": "SAF"
                    },
                    {
                        "value": "NER",
                        "label": "Niger",
                        "parent": "LLLDC"
                    },
                    {
                        "value": "NER",
                        "label": "Niger",
                        "parent": "LDC"
                    },
                    {
                        "value": "NER",
                        "label": "Niger",
                        "parent": "SAF"
                    },
                    {
                        "value": "NER",
                        "label": "Niger",
                        "parent": "ECOWAS"
                    },
                    {
                        "value": "NER",
                        "label": "Niger",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "NER",
                        "label": "Niger",
                        "parent": "NOPC"
                    },
                    {
                        "value": "NER",
                        "label": "Niger",
                        "parent": "SROWA"
                    },
                    {
                        "value": "NER",
                        "label": "Niger",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "NER",
                        "label": "Niger",
                        "parent": "LLC"
                    },
                    {
                        "value": "NER",
                        "label": "Niger",
                        "parent": "MRC"
                    },
                    {
                        "value": "NGA",
                        "label": "Nigeria",
                        "parent": "OPC"
                    },
                    {
                        "value": "NGA",
                        "label": "Nigeria",
                        "parent": "SAF"
                    },
                    {
                        "value": "NGA",
                        "label": "Nigeria",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "NGA",
                        "label": "Nigeria",
                        "parent": "B5"
                    },
                    {
                        "value": "NGA",
                        "label": "Nigeria",
                        "parent": "SROWA"
                    },
                    {
                        "value": "NGA",
                        "label": "Nigeria",
                        "parent": "ECOWAS"
                    },
                    {
                        "value": "OLDC",
                        "label": "OLDC",
                        "parent": "#"
                    },
                    {
                        "value": "OPC",
                        "label": "OPC",
                        "parent": "#"
                    },
                    {
                        "value": "RWA",
                        "label": "Rwanda",
                        "parent": "LLLDC"
                    },
                    {
                        "value": "RWA",
                        "label": "Rwanda",
                        "parent": "NOPC"
                    },
                    {
                        "value": "RWA",
                        "label": "Rwanda",
                        "parent": "SAF"
                    },
                    {
                        "value": "RWA",
                        "label": "Rwanda",
                        "parent": "LDC"
                    },
                    {
                        "value": "RWA",
                        "label": "Rwanda",
                        "parent": "MRC"
                    },
                    {
                        "value": "RWA",
                        "label": "Rwanda",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "RWA",
                        "label": "Rwanda",
                        "parent": "EAC"
                    },
                    {
                        "value": "RWA",
                        "label": "Rwanda",
                        "parent": "COMESA"
                    },
                    {
                        "value": "RWA",
                        "label": "Rwanda",
                        "parent": "SROEA"
                    },
                    {
                        "value": "RWA",
                        "label": "Rwanda",
                        "parent": "LLC"
                    },
                    {
                        "value": "RWA",
                        "label": "Rwanda",
                        "parent": "ECCAS"
                    },
                    {
                        "value": "SADC",
                        "label": "SADC",
                        "parent": "#"
                    },
                    {
                        "value": "SAF",
                        "label": "SAF",
                        "parent": "#"
                    },
                    {
                        "value": "SROCA",
                        "label": "SROCA",
                        "parent": "#"
                    },
                    {
                        "value": "SROEA",
                        "label": "SROEA",
                        "parent": "#"
                    },
                    {
                        "value": "SRONA",
                        "label": "SRONA",
                        "parent": "#"
                    },
                    {
                        "value": "SROSA",
                        "label": "SROSA",
                        "parent": "#"
                    },
                    {
                        "value": "SROWA",
                        "label": "SROWA",
                        "parent": "#"
                    },
                    {
                        "value": "STP",
                        "label": "Sao Tome and Principe",
                        "parent": "SAF"
                    },
                    {
                        "value": "STP",
                        "label": "Sao Tome and Principe",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "STP",
                        "label": "Sao Tome and Principe",
                        "parent": "SROCA"
                    },
                    {
                        "value": "STP",
                        "label": "Sao Tome and Principe",
                        "parent": "ECCAS"
                    },
                    {
                        "value": "STP",
                        "label": "Sao Tome and Principe",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "STP",
                        "label": "Sao Tome and Principe",
                        "parent": "ISE"
                    },
                    {
                        "value": "STP",
                        "label": "Sao Tome and Principe",
                        "parent": "NOPC"
                    },
                    {
                        "value": "STP",
                        "label": "Sao Tome and Principe",
                        "parent": "LDC"
                    },
                    {
                        "value": "SEN",
                        "label": "Senegal",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "SEN",
                        "label": "Senegal",
                        "parent": "SAF"
                    },
                    {
                        "value": "SEN",
                        "label": "Senegal",
                        "parent": "NOPC"
                    },
                    {
                        "value": "SEN",
                        "label": "Senegal",
                        "parent": "ECOWAS"
                    },
                    {
                        "value": "SEN",
                        "label": "Senegal",
                        "parent": "SROWA"
                    },
                    {
                        "value": "SEN",
                        "label": "Senegal",
                        "parent": "LDC"
                    },
                    {
                        "value": "SEN",
                        "label": "Senegal",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "SYC",
                        "label": "Seychelles",
                        "parent": "NOPC"
                    },
                    {
                        "value": "SYC",
                        "label": "Seychelles",
                        "parent": "SAF"
                    },
                    {
                        "value": "SYC",
                        "label": "Seychelles",
                        "parent": "COMESA"
                    },
                    {
                        "value": "SYC",
                        "label": "Seychelles",
                        "parent": "ISE"
                    },
                    {
                        "value": "SYC",
                        "label": "Seychelles",
                        "parent": "SROEA"
                    },
                    {
                        "value": "SLE",
                        "label": "Sierra Leone",
                        "parent": "MRC"
                    },
                    {
                        "value": "SLE",
                        "label": "Sierra Leone",
                        "parent": "LDC"
                    },
                    {
                        "value": "SLE",
                        "label": "Sierra Leone",
                        "parent": "SROWA"
                    },
                    {
                        "value": "SLE",
                        "label": "Sierra Leone",
                        "parent": "NOPC"
                    },
                    {
                        "value": "SLE",
                        "label": "Sierra Leone",
                        "parent": "ECOWAS"
                    },
                    {
                        "value": "SLE",
                        "label": "Sierra Leone",
                        "parent": "SAF"
                    },
                    {
                        "value": "SLE",
                        "label": "Sierra Leone",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "SLE",
                        "label": "Sierra Leone",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "SOM",
                        "label": "Somalia",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "SOM",
                        "label": "Somalia",
                        "parent": "IGAD"
                    },
                    {
                        "value": "SOM",
                        "label": "Somalia",
                        "parent": "LDC"
                    },
                    {
                        "value": "SOM",
                        "label": "Somalia",
                        "parent": "NOPC"
                    },
                    {
                        "value": "SOM",
                        "label": "Somalia",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "SOM",
                        "label": "Somalia",
                        "parent": "SAF"
                    },
                    {
                        "value": "SOM",
                        "label": "Somalia",
                        "parent": "SROEA"
                    },
                    {
                        "value": "ZAF",
                        "label": "South Africa",
                        "parent": "SADC"
                    },
                    {
                        "value": "ZAF",
                        "label": "South Africa",
                        "parent": "SROSA"
                    },
                    {
                        "value": "ZAF",
                        "label": "South Africa",
                        "parent": "NOPC"
                    },
                    {
                        "value": "ZAF",
                        "label": "South Africa",
                        "parent": "MRC"
                    },
                    {
                        "value": "ZAF",
                        "label": "South Africa",
                        "parent": "B5"
                    },
                    {
                        "value": "ZAF",
                        "label": "South Africa",
                        "parent": "SAF"
                    },
                    {
                        "value": "SSD",
                        "label": "South Sudan",
                        "parent": "LDC"
                    },
                    {
                        "value": "SSD",
                        "label": "South Sudan",
                        "parent": "SAF"
                    },
                    {
                        "value": "SSD",
                        "label": "South Sudan",
                        "parent": "LLLDC"
                    },
                    {
                        "value": "SSD",
                        "label": "South Sudan",
                        "parent": "SROEA"
                    },
                    {
                        "value": "SSD",
                        "label": "South Sudan",
                        "parent": "EAC"
                    },
                    {
                        "value": "SSD",
                        "label": "South Sudan",
                        "parent": "IGAD"
                    },
                    {
                        "value": "SSD",
                        "label": "South Sudan",
                        "parent": "OPC"
                    },
                    {
                        "value": "SSD",
                        "label": "South Sudan",
                        "parent": "OLDC"
                    },
                    {
                        "value": "SDN",
                        "label": "Sudan",
                        "parent": "IGAD"
                    },
                    {
                        "value": "SDN",
                        "label": "Sudan",
                        "parent": "SRONA"
                    },
                    {
                        "value": "SDN",
                        "label": "Sudan",
                        "parent": "OPC"
                    },
                    {
                        "value": "SDN",
                        "label": "Sudan",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "SDN",
                        "label": "Sudan",
                        "parent": "COMESA"
                    },
                    {
                        "value": "SDN",
                        "label": "Sudan",
                        "parent": "LDC"
                    },
                    {
                        "value": "SDN",
                        "label": "Sudan",
                        "parent": "OLDC"
                    },
                    {
                        "value": "SWZ",
                        "label": "Swaziland",
                        "parent": "SROSA"
                    },
                    {
                        "value": "SWZ",
                        "label": "Swaziland",
                        "parent": "SADC"
                    },
                    {
                        "value": "SWZ",
                        "label": "Swaziland",
                        "parent": "LLC"
                    },
                    {
                        "value": "SWZ",
                        "label": "Swaziland",
                        "parent": "COMESA"
                    },
                    {
                        "value": "SWZ",
                        "label": "Swaziland",
                        "parent": "NOPC"
                    },
                    {
                        "value": "SWZ",
                        "label": "Swaziland",
                        "parent": "SAF"
                    },
                    {
                        "value": "TGO",
                        "label": "Togo",
                        "parent": "SAF"
                    },
                    {
                        "value": "TGO",
                        "label": "Togo",
                        "parent": "SROWA"
                    },
                    {
                        "value": "TGO",
                        "label": "Togo",
                        "parent": "ECOWAS"
                    },
                    {
                        "value": "TGO",
                        "label": "Togo",
                        "parent": "LDC"
                    },
                    {
                        "value": "TGO",
                        "label": "Togo",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "TGO",
                        "label": "Togo",
                        "parent": "NOPC"
                    },
                    {
                        "value": "TGO",
                        "label": "Togo",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "TUN",
                        "label": "Tunisia",
                        "parent": "CENSAD"
                    },
                    {
                        "value": "TUN",
                        "label": "Tunisia",
                        "parent": "AMU"
                    },
                    {
                        "value": "TUN",
                        "label": "Tunisia",
                        "parent": "SRONA"
                    },
                    {
                        "value": "TUN",
                        "label": "Tunisia",
                        "parent": "OPC"
                    },
                    {
                        "value": "UGA",
                        "label": "Uganda",
                        "parent": "IGAD"
                    },
                    {
                        "value": "UGA",
                        "label": "Uganda",
                        "parent": "LLC"
                    },
                    {
                        "value": "UGA",
                        "label": "Uganda",
                        "parent": "LLLDC"
                    },
                    {
                        "value": "UGA",
                        "label": "Uganda",
                        "parent": "SAF"
                    },
                    {
                        "value": "UGA",
                        "label": "Uganda",
                        "parent": "NOPC"
                    },
                    {
                        "value": "UGA",
                        "label": "Uganda",
                        "parent": "SROEA"
                    },
                    {
                        "value": "UGA",
                        "label": "Uganda",
                        "parent": "LDC"
                    },
                    {
                        "value": "UGA",
                        "label": "Uganda",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "UGA",
                        "label": "Uganda",
                        "parent": "EAC"
                    },
                    {
                        "value": "UGA",
                        "label": "Uganda",
                        "parent": "COMESA"
                    },
                    {
                        "value": "TZA",
                        "label": "United Republic of Tanzania",
                        "parent": "MRC"
                    },
                    {
                        "value": "TZA",
                        "label": "United Republic of Tanzania",
                        "parent": "SADC"
                    },
                    {
                        "value": "TZA",
                        "label": "United Republic of Tanzania",
                        "parent": "SAF"
                    },
                    {
                        "value": "TZA",
                        "label": "United Republic of Tanzania",
                        "parent": "SROEA"
                    },
                    {
                        "value": "TZA",
                        "label": "United Republic of Tanzania",
                        "parent": "EAC"
                    },
                    {
                        "value": "TZA",
                        "label": "United Republic of Tanzania",
                        "parent": "NOPC"
                    },
                    {
                        "value": "TZA",
                        "label": "United Republic of Tanzania",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "TZA",
                        "label": "United Republic of Tanzania",
                        "parent": "LDC"
                    },
                    {
                        "value": "ZMB",
                        "label": "Zambia",
                        "parent": "NOLDC"
                    },
                    {
                        "value": "ZMB",
                        "label": "Zambia",
                        "parent": "SADC"
                    },
                    {
                        "value": "ZMB",
                        "label": "Zambia",
                        "parent": "SAF"
                    },
                    {
                        "value": "ZMB",
                        "label": "Zambia",
                        "parent": "MRC"
                    },
                    {
                        "value": "ZMB",
                        "label": "Zambia",
                        "parent": "COMESA"
                    },
                    {
                        "value": "ZMB",
                        "label": "Zambia",
                        "parent": "LLLDC"
                    },
                    {
                        "value": "ZMB",
                        "label": "Zambia",
                        "parent": "NOPC"
                    },
                    {
                        "value": "ZMB",
                        "label": "Zambia",
                        "parent": "SROSA"
                    },
                    {
                        "value": "ZMB",
                        "label": "Zambia",
                        "parent": "LLC"
                    },
                    {
                        "value": "ZMB",
                        "label": "Zambia",
                        "parent": "LDC"
                    },
                    {
                        "value": "ZWE",
                        "label": "Zimbabwe",
                        "parent": "COMESA"
                    },
                    {
                        "value": "ZWE",
                        "label": "Zimbabwe",
                        "parent": "NOPC"
                    },
                    {
                        "value": "ZWE",
                        "label": "Zimbabwe",
                        "parent": "LLC"
                    },
                    {
                        "value": "ZWE",
                        "label": "Zimbabwe",
                        "parent": "MRC"
                    },
                    {
                        "value": "ZWE",
                        "label": "Zimbabwe",
                        "parent": "SROSA"
                    },
                    {
                        "value": "ZWE",
                        "label": "Zimbabwe",
                        "parent": "SADC"
                    },
                    {
                        "value": "ZWE",
                        "label": "Zimbabwe",
                        "parent": "SAF"
                    }
                ]
            }
        },
*/


        "CountryCode": {
            "cl": {"uid": "UNECA_ISO3"},
            "selector": {
                "id": "tree",
                "hideSummary": true,
                "lazy" : true
            },
            "template": {"title": "Country", "hideSwitch": true},
            "format": {"dimension": "CountryCode"}
        },

    }


});