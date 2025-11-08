import React, { useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect } from 'react-konva';

export default function ImageWithMarkers() {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [markers, setMarkers] = useState([
  {
    "class": 11,
    "id": "6509628510908",
    "x": 2560,
    "y": 1950,
    "width": 173,
    "height": 175,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509645782647",
    "x": 1810,
    "y": 2190,
    "width": 172,
    "height": 174,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509657270731",
    "x": 2115,
    "y": 2073,
    "width": 168,
    "height": 172,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509668758815",
    "x": 1696,
    "y": 1808,
    "width": 168,
    "height": 172,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509679613073",
    "x": 1406,
    "y": 2224,
    "width": 170,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509690546559",
    "x": 1900,
    "y": 2331,
    "width": 170,
    "height": 172,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509705441454",
    "x": 2479,
    "y": 1805,
    "width": 166,
    "height": 164,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509716216484",
    "x": 1942,
    "y": 1786,
    "width": 172,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509727070742",
    "x": 2529,
    "y": 2527,
    "width": 173,
    "height": 172,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509737925000",
    "x": 1908,
    "y": 2057,
    "width": 170,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6509748858487",
    "x": 1066,
    "y": 1033,
    "width": 79,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509759712745",
    "x": 2461,
    "y": 2091,
    "width": 172,
    "height": 173,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509770408547",
    "x": 2266,
    "y": 2370,
    "width": 172,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509781817402",
    "x": 2212,
    "y": 1933,
    "width": 168,
    "height": 172,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509792592433",
    "x": 1145,
    "y": 2077,
    "width": 172,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509803446691",
    "x": 1494,
    "y": 2081,
    "width": 170,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509815014003",
    "x": 2132,
    "y": 2772,
    "width": 171,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509825947489",
    "x": 1316,
    "y": 2366,
    "width": 172,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509836722519",
    "x": 1322,
    "y": 2079,
    "width": 169,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6509847418321",
    "x": 819,
    "y": 3304,
    "width": 103,
    "height": 98,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6509858114123",
    "x": 1038,
    "y": 3254,
    "width": 101,
    "height": 99,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509868809925",
    "x": 2309,
    "y": 1794,
    "width": 168,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509879664183",
    "x": 2122,
    "y": 3058,
    "width": 169,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509891231495",
    "x": 1269,
    "y": 3337,
    "width": 167,
    "height": 176,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509902402666",
    "x": 1594,
    "y": 1944,
    "width": 172,
    "height": 168,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509913256924",
    "x": 2384,
    "y": 1942,
    "width": 168,
    "height": 168,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509924111182",
    "x": 889,
    "y": 1930,
    "width": 168,
    "height": 169,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509935044669",
    "x": 781,
    "y": 3243,
    "width": 175,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6509947404262",
    "x": 2084,
    "y": 2691,
    "width": 100,
    "height": 94,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509958258520",
    "x": 1729,
    "y": 2043,
    "width": 172,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509969350463",
    "x": 1714,
    "y": 2327,
    "width": 169,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509980204721",
    "x": 884,
    "y": 2219,
    "width": 169,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6509991058980",
    "x": 1961,
    "y": 2770,
    "width": 172,
    "height": 169,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510001992466",
    "x": 2239,
    "y": 2640,
    "width": 168,
    "height": 172,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510016174307",
    "x": 872,
    "y": 3083,
    "width": 173,
    "height": 179,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6510027979303",
    "x": 800,
    "y": 2699,
    "width": 120,
    "height": 121,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510038754333",
    "x": 1952,
    "y": 3055,
    "width": 170,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510049687820",
    "x": 2042,
    "y": 2912,
    "width": 171,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510060462850",
    "x": 2447,
    "y": 2378,
    "width": 172,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510071950934",
    "x": 1613,
    "y": 3042,
    "width": 167,
    "height": 173,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510083042876",
    "x": 2021,
    "y": 1932,
    "width": 173,
    "height": 172,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510093897135",
    "x": 1791,
    "y": 2760,
    "width": 169,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510105385218",
    "x": 1975,
    "y": 2481,
    "width": 171,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6510116081020",
    "x": 1397,
    "y": 3262,
    "width": 85,
    "height": 87,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510126776822",
    "x": 1700,
    "y": 2901,
    "width": 169,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6510137551852",
    "x": 2607,
    "y": 3280,
    "width": 117,
    "height": 115,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510149039936",
    "x": 2029,
    "y": 3193,
    "width": 172,
    "height": 178,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6510160131878",
    "x": 802,
    "y": 3286,
    "width": 131,
    "height": 124,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510170827680",
    "x": 2591,
    "y": 2959,
    "width": 172,
    "height": 172,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6510181523482",
    "x": 2146,
    "y": 3417,
    "width": 97,
    "height": 96,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510192219284",
    "x": 1862,
    "y": 3195,
    "width": 171,
    "height": 174,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6510203073543",
    "x": 2319,
    "y": 3125,
    "width": 97,
    "height": 100,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510213848573",
    "x": 1623,
    "y": 2468,
    "width": 174,
    "height": 169,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510224861287",
    "x": 1828,
    "y": 1908,
    "width": 172,
    "height": 173,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510235715545",
    "x": 2052,
    "y": 2627,
    "width": 172,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510247282857",
    "x": 2113,
    "y": 3353,
    "width": 171,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6510259087853",
    "x": 1302,
    "y": 1308,
    "width": 83,
    "height": 78,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510270021340",
    "x": 2001,
    "y": 2196,
    "width": 170,
    "height": 173,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510280717142",
    "x": 2509,
    "y": 2812,
    "width": 172,
    "height": 172,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510292363682",
    "x": 964,
    "y": 2940,
    "width": 170,
    "height": 173,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510303138712",
    "x": 1356,
    "y": 3184,
    "width": 171,
    "height": 177,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510313834514",
    "x": 2193,
    "y": 2220,
    "width": 168,
    "height": 173,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510324609544",
    "x": 1802,
    "y": 2468,
    "width": 170,
    "height": 172,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510337444506",
    "x": 2351,
    "y": 2516,
    "width": 171,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510348298764",
    "x": 2457,
    "y": 3362,
    "width": 172,
    "height": 179,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6510359073794",
    "x": 1006,
    "y": 1374,
    "width": 80,
    "height": 82,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510369848825",
    "x": 2157,
    "y": 2495,
    "width": 171,
    "height": 173,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510380544627",
    "x": 1945,
    "y": 3350,
    "width": 169,
    "height": 173,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510391319657",
    "x": 1781,
    "y": 3044,
    "width": 169,
    "height": 174,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510402015459",
    "x": 2622,
    "y": 2388,
    "width": 172,
    "height": 172,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510412869717",
    "x": 1140,
    "y": 2653,
    "width": 172,
    "height": 168,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510424278572",
    "x": 1697,
    "y": 3192,
    "width": 166,
    "height": 172,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510435925112",
    "x": 1002,
    "y": 3190,
    "width": 175,
    "height": 174,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6510446858599",
    "x": 2134,
    "y": 3402,
    "width": 119,
    "height": 116,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510457633629",
    "x": 1230,
    "y": 2509,
    "width": 168,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6510468329431",
    "x": 781,
    "y": 1545,
    "width": 84,
    "height": 85,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510479104461",
    "x": 2215,
    "y": 2919,
    "width": 171,
    "height": 173,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6510490117175",
    "x": 1121,
    "y": 3089,
    "width": 127,
    "height": 124,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510500971434",
    "x": 1445,
    "y": 3040,
    "width": 168,
    "height": 174,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510512459517",
    "x": 1882,
    "y": 2621,
    "width": 172,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6510523551460",
    "x": 1138,
    "y": 947,
    "width": 80,
    "height": 84,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6510534405718",
    "x": 1375,
    "y": 3236,
    "width": 127,
    "height": 122,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510545101520",
    "x": 2540,
    "y": 2240,
    "width": 172,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6510555955778",
    "x": 2068,
    "y": 3270,
    "width": 97,
    "height": 94,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510566651580",
    "x": 1051,
    "y": 2799,
    "width": 172,
    "height": 173,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6510579407314",
    "x": 1388,
    "y": 3250,
    "width": 103,
    "height": 102,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510590182345",
    "x": 1452,
    "y": 2465,
    "width": 171,
    "height": 169,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6510600957375",
    "x": 939,
    "y": 3385,
    "width": 131,
    "height": 125,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510611653177",
    "x": 2363,
    "y": 2231,
    "width": 167,
    "height": 167,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6510622428207",
    "x": 1647,
    "y": 3413,
    "width": 100,
    "height": 97,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510633282465",
    "x": 1542,
    "y": 2324,
    "width": 168,
    "height": 169,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510646038199",
    "x": 1631,
    "y": 2180,
    "width": 169,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510657288598",
    "x": 1870,
    "y": 2903,
    "width": 171,
    "height": 173,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6510668855910",
    "x": 810,
    "y": 2714,
    "width": 101,
    "height": 99,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6510679551712",
    "x": 2075,
    "y": 2675,
    "width": 118,
    "height": 116,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6510690326742",
    "x": 872,
    "y": 1442,
    "width": 84,
    "height": 85,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510701101772",
    "x": 1058,
    "y": 2220,
    "width": 172,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510711797574",
    "x": 1186,
    "y": 2898,
    "width": 174,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510722414148",
    "x": 1528,
    "y": 3192,
    "width": 169,
    "height": 175,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510733189178",
    "x": 2202,
    "y": 3205,
    "width": 173,
    "height": 176,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510743964208",
    "x": 2481,
    "y": 3084,
    "width": 172,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510754580782",
    "x": 1092,
    "y": 3339,
    "width": 174,
    "height": 182,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6510765197356",
    "x": 803,
    "y": 2988,
    "width": 129,
    "height": 121,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510777398493",
    "x": 1364,
    "y": 2606,
    "width": 170,
    "height": 173,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6510788252751",
    "x": 1967,
    "y": 3400,
    "width": 119,
    "height": 116,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6510799027781",
    "x": 1064,
    "y": 1175,
    "width": 79,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510809802811",
    "x": 967,
    "y": 2654,
    "width": 171,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510820577841",
    "x": 1143,
    "y": 2365,
    "width": 171,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510831352871",
    "x": 1232,
    "y": 2221,
    "width": 172,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6510842286358",
    "x": 1352,
    "y": 1453,
    "width": 81,
    "height": 85,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510852982160",
    "x": 1775,
    "y": 3346,
    "width": 169,
    "height": 178,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510863757190",
    "x": 1607,
    "y": 3345,
    "width": 166,
    "height": 174,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510874373763",
    "x": 1062,
    "y": 1932,
    "width": 169,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6510884990337",
    "x": 981,
    "y": 2991,
    "width": 128,
    "height": 119,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510897191474",
    "x": 1449,
    "y": 2750,
    "width": 168,
    "height": 172,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6510907966504",
    "x": 1479,
    "y": 3122,
    "width": 85,
    "height": 85,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6510918741534",
    "x": 1978,
    "y": 3415,
    "width": 96,
    "height": 96,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6510929358108",
    "x": 1020,
    "y": 3238,
    "width": 130,
    "height": 123,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510940053910",
    "x": 2078,
    "y": 2348,
    "width": 168,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6510950749712",
    "x": 1477,
    "y": 2816,
    "width": 99,
    "height": 97,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6510963030077",
    "x": 1295,
    "y": 2804,
    "width": 118,
    "height": 112,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6510973963564",
    "x": 977,
    "y": 946,
    "width": 80,
    "height": 85,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6510984659366",
    "x": 2296,
    "y": 3070,
    "width": 172,
    "height": 168,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6510995275939",
    "x": 986,
    "y": 1031,
    "width": 80,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511005971741",
    "x": 1361,
    "y": 2900,
    "width": 169,
    "height": 168,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511016746772",
    "x": 1392,
    "y": 2973,
    "width": 85,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511027521802",
    "x": 2433,
    "y": 2665,
    "width": 170,
    "height": 176,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511038138375",
    "x": 784,
    "y": 2941,
    "width": 171,
    "height": 175,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6511048754949",
    "x": 1212,
    "y": 2958,
    "width": 98,
    "height": 100,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511059609207",
    "x": 1135,
    "y": 3408,
    "width": 89,
    "height": 86,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511070305009",
    "x": 851,
    "y": 1232,
    "width": 82,
    "height": 82,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6511081000811",
    "x": 1299,
    "y": 3105,
    "width": 98,
    "height": 98,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511092409667",
    "x": 790,
    "y": 1450,
    "width": 83,
    "height": 85,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511103026241",
    "x": 2289,
    "y": 3362,
    "width": 168,
    "height": 164,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6511113722042",
    "x": 955,
    "y": 3397,
    "width": 104,
    "height": 107,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511124417844",
    "x": 780,
    "y": 1065,
    "width": 84,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6511135034418",
    "x": 1067,
    "y": 2847,
    "width": 126,
    "height": 122,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511145730220",
    "x": 1143,
    "y": 1028,
    "width": 79,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6511156267566",
    "x": 1306,
    "y": 2816,
    "width": 99,
    "height": 97,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511167121824",
    "x": 1096,
    "y": 3043,
    "width": 173,
    "height": 175,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511177817626",
    "x": 879,
    "y": 2798,
    "width": 170,
    "height": 175,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511188434200",
    "x": 2402,
    "y": 2939,
    "width": 172,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6511200239196",
    "x": 1565,
    "y": 2659,
    "width": 119,
    "height": 114,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6511213391071",
    "x": 2709,
    "y": 2867,
    "width": 120,
    "height": 117,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6511224245329",
    "x": 2617,
    "y": 3293,
    "width": 97,
    "height": 96,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6511235020359",
    "x": 1468,
    "y": 3413,
    "width": 98,
    "height": 98,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6511245636933",
    "x": 1297,
    "y": 3400,
    "width": 102,
    "height": 104,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511256332735",
    "x": 931,
    "y": 1494,
    "width": 82,
    "height": 84,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511267503906",
    "x": 1086,
    "y": 1374,
    "width": 71,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6511283111854",
    "x": 2378,
    "y": 2558,
    "width": 122,
    "height": 122,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6511294362253",
    "x": 899,
    "y": 2863,
    "width": 100,
    "height": 100,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511305058055",
    "x": 1275,
    "y": 1453,
    "width": 79,
    "height": 84,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511315753857",
    "x": 1282,
    "y": 2753,
    "width": 164,
    "height": 168,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511326370431",
    "x": 1184,
    "y": 3183,
    "width": 172,
    "height": 179,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6511337145461",
    "x": 1635,
    "y": 3398,
    "width": 120,
    "height": 117,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511347762035",
    "x": 1373,
    "y": 947,
    "width": 82,
    "height": 84,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6511359408574",
    "x": 2312,
    "y": 3114,
    "width": 119,
    "height": 118,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511370104376",
    "x": 2379,
    "y": 3219,
    "width": 170,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511381037863",
    "x": 1437,
    "y": 3334,
    "width": 170,
    "height": 176,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6511391733665",
    "x": 998,
    "y": 3006,
    "width": 103,
    "height": 100,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511402350238",
    "x": 790,
    "y": 1153,
    "width": 88,
    "height": 78,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6511413046040",
    "x": 2161,
    "y": 2836,
    "width": 98,
    "height": 95,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6511423662614",
    "x": 1287,
    "y": 3390,
    "width": 125,
    "height": 120,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511434279188",
    "x": 1538,
    "y": 2608,
    "width": 169,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511444895762",
    "x": 1530,
    "y": 2896,
    "width": 170,
    "height": 173,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6511455591564",
    "x": 1080,
    "y": 2864,
    "width": 102,
    "height": 100,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511466128909",
    "x": 857,
    "y": 1100,
    "width": 82,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511476745483",
    "x": 827,
    "y": 3312,
    "width": 87,
    "height": 86,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6511487282829",
    "x": 822,
    "y": 3005,
    "width": 102,
    "height": 99,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511497978631",
    "x": 1733,
    "y": 2976,
    "width": 87,
    "height": 86,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511508515976",
    "x": 906,
    "y": 2875,
    "width": 85,
    "height": 82,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511519132550",
    "x": 2651,
    "y": 3376,
    "width": 170,
    "height": 173,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511531096003",
    "x": 1308,
    "y": 3118,
    "width": 82,
    "height": 82,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6511542029489",
    "x": 2278,
    "y": 2704,
    "width": 97,
    "height": 100,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6511552804519",
    "x": 1577,
    "y": 2671,
    "width": 97,
    "height": 97,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511563500321",
    "x": 1180,
    "y": 1244,
    "width": 80,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511574116895",
    "x": 904,
    "y": 1037,
    "width": 82,
    "height": 81,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511584733469",
    "x": 785,
    "y": 1626,
    "width": 83,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511597093062",
    "x": 1101,
    "y": 1244,
    "width": 80,
    "height": 84,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511607947320",
    "x": 857,
    "y": 1526,
    "width": 84,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511618643122",
    "x": 1047,
    "y": 3262,
    "width": 87,
    "height": 87,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511629418152",
    "x": 2653,
    "y": 1812,
    "width": 172,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511640113954",
    "x": 1231,
    "y": 1363,
    "width": 81,
    "height": 86,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511650730528",
    "x": 1222,
    "y": 1172,
    "width": 81,
    "height": 82,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511661426330",
    "x": 1146,
    "y": 1787,
    "width": 168,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511672280588",
    "x": 1302,
    "y": 1170,
    "width": 81,
    "height": 81,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511682897162",
    "x": 1465,
    "y": 1019,
    "width": 83,
    "height": 85,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511693513736",
    "x": 1218,
    "y": 3256,
    "width": 87,
    "height": 89,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511704051081",
    "x": 1054,
    "y": 940,
    "width": 83,
    "height": 84,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511714746883",
    "x": 2650,
    "y": 1457,
    "width": 80,
    "height": 85,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511725363457",
    "x": 2287,
    "y": 2082,
    "width": 170,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6511735980031",
    "x": 2060,
    "y": 3254,
    "width": 118,
    "height": 115,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511746675833",
    "x": 1219,
    "y": 1020,
    "width": 83,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511757371635",
    "x": 1671,
    "y": 2829,
    "width": 83,
    "height": 85,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511768146665",
    "x": 1215,
    "y": 940,
    "width": 80,
    "height": 84,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511778842467",
    "x": 1576,
    "y": 2973,
    "width": 85,
    "height": 85,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6511789538269",
    "x": 2268,
    "y": 2690,
    "width": 117,
    "height": 116,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511800154842",
    "x": 1182,
    "y": 1099,
    "width": 80,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511810692188",
    "x": 1273,
    "y": 3038,
    "width": 170,
    "height": 174,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6511821387990",
    "x": 2250,
    "y": 2981,
    "width": 99,
    "height": 100,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511832083792",
    "x": 1140,
    "y": 3111,
    "width": 90,
    "height": 89,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511844284929",
    "x": 1066,
    "y": 1497,
    "width": 82,
    "height": 85,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6511855139187",
    "x": 1288,
    "y": 3091,
    "width": 120,
    "height": 117,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511865914217",
    "x": 2116,
    "y": 1797,
    "width": 172,
    "height": 169,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511876610019",
    "x": 1089,
    "y": 2877,
    "width": 84,
    "height": 84,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511887226593",
    "x": 774,
    "y": 1220,
    "width": 83,
    "height": 80,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511897843167",
    "x": 1140,
    "y": 1533,
    "width": 83,
    "height": 81,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511908538969",
    "x": 972,
    "y": 2075,
    "width": 173,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511924939198",
    "x": 1143,
    "y": 1173,
    "width": 79,
    "height": 84,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6511936664966",
    "x": 1465,
    "y": 2804,
    "width": 119,
    "height": 114,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511947439997",
    "x": 909,
    "y": 3163,
    "width": 84,
    "height": 84,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6511958056570",
    "x": 1197,
    "y": 3233,
    "width": 127,
    "height": 125,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6511968910829",
    "x": 2564,
    "y": 3233,
    "width": 170,
    "height": 168,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511979527402",
    "x": 1633,
    "y": 1167,
    "width": 81,
    "height": 82,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6511990143976",
    "x": 1218,
    "y": 2971,
    "width": 85,
    "height": 84,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6512000681322",
    "x": 1457,
    "y": 3397,
    "width": 119,
    "height": 117,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512011297896",
    "x": 971,
    "y": 1306,
    "width": 83,
    "height": 81,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6512021914469",
    "x": 2674,
    "y": 3105,
    "width": 167,
    "height": 174,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6512032451815",
    "x": 2535,
    "y": 3148,
    "width": 97,
    "height": 94,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6512043147617",
    "x": 2632,
    "y": 2099,
    "width": 170,
    "height": 172,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512053764191",
    "x": 1104,
    "y": 1103,
    "width": 79,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6512064380764",
    "x": 2153,
    "y": 2822,
    "width": 118,
    "height": 115,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512075076566",
    "x": 863,
    "y": 1610,
    "width": 84,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512085693140",
    "x": 1454,
    "y": 945,
    "width": 84,
    "height": 82,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512096309714",
    "x": 2834,
    "y": 1462,
    "width": 86,
    "height": 85,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6512107005516",
    "x": 1210,
    "y": 3245,
    "width": 105,
    "height": 106,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6512117542862",
    "x": 2322,
    "y": 3424,
    "width": 94,
    "height": 95,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6512128238663",
    "x": 799,
    "y": 1782,
    "width": 168,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6512138934465",
    "x": 1053,
    "y": 2509,
    "width": 171,
    "height": 173,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6512149630267",
    "x": 1619,
    "y": 2752,
    "width": 173,
    "height": 173,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6512161831404",
    "x": 1711,
    "y": 2613,
    "width": 168,
    "height": 167,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512172685663",
    "x": 999,
    "y": 1538,
    "width": 82,
    "height": 84,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512183381465",
    "x": 1262,
    "y": 1098,
    "width": 80,
    "height": 84,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6512194156495",
    "x": 886,
    "y": 2847,
    "width": 123,
    "height": 123,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6512204852297",
    "x": 1731,
    "y": 2661,
    "width": 118,
    "height": 115,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512215468870",
    "x": 831,
    "y": 1855,
    "width": 86,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512226085444",
    "x": 1217,
    "y": 1559,
    "width": 83,
    "height": 82,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6512238603494",
    "x": 1739,
    "y": 2672,
    "width": 98,
    "height": 99,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512249220068",
    "x": 1093,
    "y": 1736,
    "width": 87,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6512259915870",
    "x": 1813,
    "y": 3414,
    "width": 101,
    "height": 100,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6512270690900",
    "x": 1134,
    "y": 3101,
    "width": 105,
    "height": 105,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6512281307473",
    "x": 1905,
    "y": 3262,
    "width": 96,
    "height": 98,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512291924047",
    "x": 2690,
    "y": 1380,
    "width": 83,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512302619849",
    "x": 1127,
    "y": 1449,
    "width": 85,
    "height": 87,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6512313315651",
    "x": 1644,
    "y": 3111,
    "width": 100,
    "height": 99,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512323852997",
    "x": 942,
    "y": 1113,
    "width": 83,
    "height": 80,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512334469570",
    "x": 935,
    "y": 1578,
    "width": 81,
    "height": 82,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512345006916",
    "x": 924,
    "y": 1369,
    "width": 82,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6512355623490",
    "x": 1662,
    "y": 2815,
    "width": 101,
    "height": 103,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512367349258",
    "x": 1388,
    "y": 1036,
    "width": 82,
    "height": 82,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6512378045060",
    "x": 1723,
    "y": 3259,
    "width": 100,
    "height": 101,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6512388740862",
    "x": 2311,
    "y": 3411,
    "width": 117,
    "height": 113,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6512399278207",
    "x": 1407,
    "y": 1938,
    "width": 172,
    "height": 167,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6512409815553",
    "x": 901,
    "y": 3150,
    "width": 102,
    "height": 102,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512420511355",
    "x": 782,
    "y": 1706,
    "width": 85,
    "height": 85,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6512431127929",
    "x": 1918,
    "y": 2681,
    "width": 99,
    "height": 101,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6512441744503",
    "x": 2429,
    "y": 2987,
    "width": 121,
    "height": 116,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6512452361076",
    "x": 2521,
    "y": 3134,
    "width": 119,
    "height": 114,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512463056878",
    "x": 1149,
    "y": 1362,
    "width": 82,
    "height": 87,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6512474782646",
    "x": 882,
    "y": 2508,
    "width": 170,
    "height": 174,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6512485795361",
    "x": 966,
    "y": 2364,
    "width": 173,
    "height": 169,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512496491163",
    "x": 1292,
    "y": 1531,
    "width": 85,
    "height": 78,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512507186965",
    "x": 782,
    "y": 1293,
    "width": 85,
    "height": 85,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512517961995",
    "x": 1020,
    "y": 1248,
    "width": 82,
    "height": 80,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6512528657797",
    "x": 2692,
    "y": 2824,
    "width": 169,
    "height": 170,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6512539353599",
    "x": 1818,
    "y": 2825,
    "width": 97,
    "height": 99,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6512554010809",
    "x": 920,
    "y": 3345,
    "width": 174,
    "height": 172,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512565023523",
    "x": 1262,
    "y": 1239,
    "width": 81,
    "height": 81,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512575719325",
    "x": 1553,
    "y": 1172,
    "width": 81,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6512586573584",
    "x": 2716,
    "y": 2883,
    "width": 97,
    "height": 94,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6512597190157",
    "x": 1234,
    "y": 1936,
    "width": 173,
    "height": 165,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6512607885959",
    "x": 1564,
    "y": 3261,
    "width": 99,
    "height": 99,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512618581761",
    "x": 1024,
    "y": 1106,
    "width": 80,
    "height": 82,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512629198335",
    "x": 1385,
    "y": 1305,
    "width": 79,
    "height": 79,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6512639814909",
    "x": 2438,
    "y": 3001,
    "width": 98,
    "height": 97,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512650510711",
    "x": 1008,
    "y": 1622,
    "width": 82,
    "height": 82,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512661127285",
    "x": 1146,
    "y": 1612,
    "width": 84,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512671743858",
    "x": 1290,
    "y": 928,
    "width": 85,
    "height": 86,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6512682360432",
    "x": 1166,
    "y": 2716,
    "width": 99,
    "height": 98,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512693056234",
    "x": 2576,
    "y": 1160,
    "width": 80,
    "height": 86,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6512703752036",
    "x": 975,
    "y": 1787,
    "width": 168,
    "height": 167,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512714368610",
    "x": 1007,
    "y": 3019,
    "width": 88,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512724985183",
    "x": 2571,
    "y": 1449,
    "width": 82,
    "height": 84,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512735680985",
    "x": 1470,
    "y": 1172,
    "width": 83,
    "height": 82,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512746376787",
    "x": 1176,
    "y": 1858,
    "width": 87,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6512757072589",
    "x": 1652,
    "y": 2806,
    "width": 120,
    "height": 115,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 8,
    "id": "6512767609935",
    "x": 2619,
    "y": 3020,
    "width": 97,
    "height": 98,
    "stroke": "teal",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512778305737",
    "x": 1374,
    "y": 1614,
    "width": 85,
    "height": 81,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512790189961",
    "x": 1649,
    "y": 3122,
    "width": 86,
    "height": 85,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6512802153414",
    "x": 2602,
    "y": 2675,
    "width": 173,
    "height": 174,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 11,
    "id": "6512812849216",
    "x": 792,
    "y": 2365,
    "width": 170,
    "height": 171,
    "stroke": "gray",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512823465790",
    "x": 1158,
    "y": 1690,
    "width": 83,
    "height": 84,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512834161591",
    "x": 1302,
    "y": 1024,
    "width": 84,
    "height": 84,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512845015850",
    "x": 1290,
    "y": 1605,
    "width": 84,
    "height": 82,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512855711652",
    "x": 2775,
    "y": 1518,
    "width": 83,
    "height": 84,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512868942755",
    "x": 1482,
    "y": 2826,
    "width": 86,
    "height": 85,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512879797013",
    "x": 834,
    "y": 1005,
    "width": 81,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 0,
    "id": "6512890492815",
    "x": 1636,
    "y": 3098,
    "width": 118,
    "height": 116,
    "stroke": "blue",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512901188617",
    "x": 2729,
    "y": 1454,
    "width": 84,
    "height": 85,
    "stroke": "magenta",
    "strokeWidth": 2
  },
  {
    "class": 7,
    "id": "6512911884419",
    "x": 1429,
    "y": 1105,
    "width": 81,
    "height": 83,
    "stroke": "magenta",
    "strokeWidth": 2
  }
]);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.src = reader.result;
      img.onload = () => {
        setImage(img);
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
    };
    reader.readAsDataURL(file);
  };

  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      setMarkers([
        ...markers,
        {
          id: `marker-${markers.length + 1}`,
          x: pointer.x,
          y: pointer.y,
          width: 80,
          height: 80,
        },
      ]);
    }
  };

  return (
    <div className="p-4">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => fileInputRef.current?.click()}
      >
        Upload Image
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <div
        className="overflow-auto border border-gray-400"
        style={{
          width: '100%',
          maxHeight: '80vh',
        }}
      >
        {image && (
          <Stage
            width={imageSize.width}
            height={imageSize.height}
            onMouseDown={handleStageClick}
            style={{ background: '#f5f5f5' }}
          >
            <Layer>
              <KonvaImage image={image} width={imageSize.width} height={imageSize.height} />
              {markers.map((m) => (
                <Rect
                  key={m.id}
                  x={m.x}
                  y={m.y}
                  width={m.width}
                  height={m.height}
                  stroke="red"
                  strokeWidth={2}
                  draggable
                />
              ))}
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
}
