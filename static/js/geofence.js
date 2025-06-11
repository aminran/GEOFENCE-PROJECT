//Defining mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicmF2aTIwMjMiLCJhIjoiY2xqd241azUxMGNmdjNkbnY5dXA3YW43MyJ9.XyhT8ZFgHLBDwB5XmFEvRg';

console.log("start of javascript file");


const INITIAL_CENTER = [87.634138, 25.245063]; //25.245063, 87.634138
const INITIAL_ZOOM = 17;
//var mapStyle = 'mapbox://styles/mapbox/streets-v11'
//var mapStyle = 'mapbox://styles/mapbox/outdoors-v12'
var mapStyle = [
    'mapbox://styles/mapbox/streets-v11',
    'mapbox://styles/mapbox/streets-v12',
    'mapbox://styles/mapbox/outdoors-v12',
    'mapbox://styles/mapbox/satellite-streets-v12',
    'mapbox://styles/mapbox/satellite-v9'
]

// Create a new map instance
var map = new mapboxgl.Map({
    container: 'map',
    style: mapStyle[2],
    center: INITIAL_CENTER, //Longitude, Latitude
    zoom: INITIAL_ZOOM,
});

// Add markers to the map
var marker1 = new mapboxgl.Marker().setLngLat(INITIAL_CENTER).addTo(map);






const goefenceArea = [

    [87.634481, 25.245208], //25.245208, 87.634481 map format
    [87.634459, 25.245146],
    [87.634429, 25.245024],
    [87.634404, 25.244815],
    [87.634188, 25.244837],
    [87.633963, 25.244865],
    [87.633770, 25.244891],
    [87.633763, 25.245055],
    [87.633803, 25.245276],

    [87.634065,25.245365],
    [87.634302,25.245325],
];

var lineCoordinates = [INITIAL_CENTER];
var trkLineCoordinates = [];
let pathData1 = null;
let pathData2 = null;

map.on('load', () => {

    //Draw Geofence Area
    map.addLayer({
        id: 'geofence',
        type: 'fill',
        source: {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                type: 'Polygon',
                coordinates: [goefenceArea],
                },
            },
        },
        paint: {
        'fill-color': '#008080',
        'fill-opacity': 0.5,
        },
    });


    //Draw Lines
    map.addSource('source1', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': lineCoordinates
                    }
                }
            });

    map.addSource('source2', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': trkLineCoordinates
            }
        }
    });

    map.addLayer({
        id: 'path1',
        type: 'line',
        source: 'source1',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': "#0000ff",
            'line-width': 3
        }
    });

    map.addLayer({
        id: 'path2',
        type: 'line',
        source: 'source2',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': "#ff0000",
            'line-width': 3
        }
    });
});

map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
map.addControl(new mapboxgl.NavigationControl(), 'top-right');

var previousMarker = null;




// var satellites_inView_lable = document.getElementById('satellites-inView');
// var satellites_inUse_lable = document.getElementById('satellites-inUse');
var gpsFixStatus_lable = document.getElementById('gps-fix-status');
var gpsCoordinates_lable = document.getElementById('gps-coordinates');
var address_lable = document.getElementById('address');
var speed_label_lable = document.getElementById('speed');
var altitude_label = document.getElementById('altitude');
var distance_label = document.getElementById('distance-value');
var degree_label = document.getElementById('degree');
var moving_direction_lable = document.getElementById('moving-direction');
var status_in_out_lable = document.getElementById('status');
var local_datetime_lable = document.getElementById('local-datetime');
var tracking_datetime_lable = document.getElementById('tracking-datetime');
var trace_device_lable = document.getElementById('trace-your-device');
var utc_datetime_lable = document.getElementById('utc-datetime');
var h_dop_lable = document.getElementById('hdop');
var v_dop_lable = document.getElementById('vdop');
var p_dop_lable = document.getElementById('pdop');
var t_dop_lable = document.getElementById('tdop');
var g_dop_lable = document.getElementById('gdop');
var x_dop_lable = document.getElementById('xdop');
var y_dop_lable = document.getElementById('ydop');

// //Line Draw
function addLineBetweenCoordinates(lineCoordinates,trkLineCoordinates) {
    map.getSource('source1').setData({
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': lineCoordinates
                    }
                });

    var len1 = lineCoordinates.length;
    var len2 = trkLineCoordinates.length;

    if(len2>0){
        map.getSource('source2').setData({
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': [lineCoordinates[len1-1],trkLineCoordinates[len2-1]]
            }
        });
    }

}

//Finding distance between two GPS
function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radius of the earth in kilometers

    // Convert latitude and longitude to radians
    const latRad1 = degreesToRadians(lat1);
    const lonRad1 = degreesToRadians(lon1);
    const latRad2 = degreesToRadians(lat2);
    const lonRad2 = degreesToRadians(lon2);

    // Calculate the differences between coordinates
    const latDiff = latRad2 - latRad1;
    const lonDiff = lonRad2 - lonRad1;

    // Apply the Haversine formula
    const a =
    Math.sin(latDiff / 2) ** 2 +
    Math.cos(latRad1) * Math.cos(latRad2) * Math.sin(lonDiff / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Calculate the distance
    const distance = earthRadius * c;

    return distance;
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}


trackingID = null;
var trackingLineCoordinates = [];
var isClicked = false;

function traceMe(){
    isClicked = true;
    if ("geolocation" in navigator) {
        // Get the user's location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Retrieve the latitude and longitude from the position object
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                trackingID = [longitude,latitude];

                console.log("your lat/long: "+trackingID);
                },

                (error) => {
                    // Handle any errors that may occur while trying to get the location
                    document.getElementById('trace-your-device').innerText = "Sorry! Couldn't find your location..";
                    console.error("Error getting location:", error.message);
            }
        );
    }
    else {
        // Geolocation API is not available in the browser
        console.error("Geolocation is not supported in this browser.");
    }
}

function calculateBearing(origin, destination) {
    const lon1 = origin[0];
    const lat1 = origin[1];
    const lon2 = destination[0];
    const lat2 = destination[1];

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    bearing = (bearing + 360) % 360; // Ensure the result is between 0 and 360 degrees
    return bearing;
}

function getCardinalDirection(angle) {
        const directions = ['North', 'North East', 'East', 'South East', 'South', 'South West', 'West', 'North West'];
        const index = Math.round(angle / 45) % 8;
        return directions[index];
    }

var distanceInkm = null;
var distanceInMeter = null;
let popup = null;

var initialCoordinate = INITIAL_CENTER;
var newCrd = null;
var newTrkCrd = null;
var trackingMarker = null;
var isCrossed = false;




const firebaseConfig = {
  apiKey: "AIzaSyA9YJFjZJmmJ1GhoMsmij7TGdbtpC4kS2M",
  authDomain: "tracking-gps-9832b.firebaseapp.com",
  databaseURL: "https://tracking-gps-9832b-default-rtdb.firebaseio.com",
  projectId: "tracking-gps-9832b",
  storageBucket: "tracking-gps-9832b.firebasestorage.app",
  messagingSenderId: "651526296916",
  appId: "1:651526296916:web:249fee9a5f099e83d024c1"
};

firebase.initializeApp(firebaseConfig);
var ref = firebase.database().ref();

//Fetching data from firebase


// ref.on("value", function (snapshot) {
//     var data = snapshot.val()['geofenceData'];
//     gpsCoordinates_lable.innerText = "Lat: "+data.latitude+"\nLong :"+data.longitude;
//     // gpsCoordinates_lable.innerText="test"
//     // speed_label_lable=1000
// });

ref.on("value", function (snapshot) {
    var data = snapshot.val()['geofenceData'];

    const currentDate = new Date();
    curr_utcDatetime = currentDate.toISOString();
    prev_utcDatetime = data.server_datetime;

    const date1 = new Date(curr_utcDatetime);
    const date2 = new Date(prev_utcDatetime);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = Math.abs(date1.getTime() - date2.getTime());
    const diffInMinute =  parseInt(differenceInMilliseconds/(1000*60));

    //check in your console for any error
    console.log("currentDatetime: "+date1);
    console.log("prevDatetime: "+date2);
    console.log("differenceInMilliseconds: "+differenceInMilliseconds);
    console.log("diffInMinute: "+diffInMinute);

    if(diffInMinute < 10 ){
        // console.log("Satellite:"+data.satellite)
        // if (data.satellite == "") {
        //     satellites_inView_lable.innerText = "N/A";
        // } else {
        //     satellites_inView_lable.innerText = data.satellite;
        // }
        // if (data.userSatellite == "") {
        //     satellites_inUse_lable.innerText = "N/A";
        // } else {
        //     satellites_inUse_lable.innerText = data.userSatellite;
        // }
        if (data.mode == "") {
            gpsFixStatus_lable.innerText = "N/A";
        } else {
            gpsFixStatus_lable.innerText = data.mode+"D Fix";
        }

        //Get new-coordinates, distance, status
        if(data.latitude && data.longitude) {
            gpsCoordinates_lable.innerText = "Lat: "+data.latitude+"\nLong :"+data.longitude;

            //remove marker
            if (previousMarker) {
                previousMarker.remove();
            }

            // Get the coordinates of the markers
            var startCoord = marker1.getLngLat().toArray();

            // Create a new marker at the random coordinate
            distanceInkm = (calculateDistance(startCoord[1], startCoord[0], data.latitude, data.longitude)).toPrecision(2);
            distanceInMeter = distanceInkm*1000;

            if(distanceInMeter < 28){
                var marker2 = new mapboxgl.Marker({color: '#009900'}).setLngLat([data.longitude, data.latitude]).addTo(map);

                distance_label.innerText = distanceInkm+" km\n"+distanceInMeter+" meter";
                document.getElementById("status").innerHTML = '<span style="color:#00ff00; font-weight:bold;">Inside</span>';

            }else{
                var marker2 = new mapboxgl.Marker({color: '#990000'}).setLngLat([data.longitude, data.latitude]).addTo(map);
                // distance_label.innerText = distanceInkm+"\n"+distanceInMeter;
                if (isCrossed != true) {

                    if ([data.local_date, data.local_time] == "") {
                        tracking_datetime_lable.innerText = "N/A";
                    } else {
                        tracking_datetime_lable.innerText = data.local_date+" / "+data.local_time;
                    }

                    isCrossed = true;
                }
                distance_label.innerText = distanceInkm+" km ("+distanceInMeter+" meter)";
                document.getElementById("status").innerHTML = '<span style="color:#ff0000;font-weight:bold;">Outside</span>';

            }

            newCrd = marker2.getLngLat().toArray();
            lineCoordinates.push([newCrd[0], newCrd[1]]);

            //Start Tracking me
            if (isClicked == true){
                traceMe();
            }
            if(trackingID != null){

                if (trackingMarker) {
                    trackingMarker.remove();
                }

                distanceInkm = (calculateDistance(trackingID[1], trackingID[0], data.latitude, data.longitude)).toFixed(2);
                distanceInMeter = distanceInkm*1000;

                var marker3 = new mapboxgl.Marker({color: 'black'}).setLngLat(trackingID).addTo(map);

                document.getElementById("trace-your-device").innerText = distanceInkm+" km from you.";
                document.getElementById("distance_in_meter").innerText = distanceInMeter+" meter from you.";

                newTrkCrd = marker3.getLngLat().toArray();

                trkLineCoordinates.push([newTrkCrd[0], newTrkCrd[1]]);

                }

            addLineBetweenCoordinates(lineCoordinates,trkLineCoordinates);

            // Store the current marker as the previous marker
            previousMarker = marker2;
            trackingMarker = marker3;
        } 
        else {
            gpsCoordinates_lable.innerText = "N/A"
        }

        if (data.address == "") {
            address_lable.innerText = "N/A";
        } else {
            address_lable.style.height="40px";
            address_lable.style.margin = "-5px";
            address_lable.innerText = data.address;
        }
        if (data.speed == "") {
            speed_label_lable.innerText = "N/A";
        } else {
            speed_label_lable.innerText = data.speed;
        }
        if (data.altitude == "") {
            altitude_label.innerText = "N/A";
        } else {
            altitude_label.innerText = data.altitude + " meter";
        }
        if (data.degree == "") {
            degree_label.innerText = "N/A";
        } else {
            degree_label.innerText = data.degree;
        }
        if (data.direction == "") {
            moving_direction_lable.innerText = "N/A";
        } else {
            moving_direction_lable.innerText = "Moving Towards "+data.direction;
        }

        var div_dir = [INITIAL_CENTER, [newCrd[0], newCrd[1]]]
        const bearing1 = calculateBearing(INITIAL_CENTER, [newCrd[0], newCrd[1]]);
        const cardinalDirection1 = getCardinalDirection(bearing1);
        document.getElementById("device-direction").innerText = "Moving Towards "+cardinalDirection1;

        if(trackingID != null){
            const bearing2 = calculateBearing(trackingID, [newCrd[0], newCrd[1]]);
            const cardinalDirection2 = getCardinalDirection(bearing2);
            document.getElementById("tracking-direction").innerText = "Towards "+cardinalDirection2;            }

        if ([data.local_date, data.local_time] == "") {
            local_datetime_lable.innerText = "N/A";
        } else {
            console.log("Local_Date: "+data.local_date);
            console.log("Local_Time: "+data.local_time);
            local_datetime_lable.innerText = data.local_date+" / "+data.local_time;
        }
        if ([data.utc_date,data.utc_time] == "") {
            utc_datetime_lable.innerText = "N/A";
        } else {
            utc_datetime_lable.innerText = data.utc_date+" / "+data.utc_time;
        }
        if (data.hdop == "") {
            h_dop_lable.innerText = "N/A";
        } else {
            h_dop_lable.innerText = data.hdop;
        }
        if (data.vdop == "") {
            v_dop_lable.innerText = "N/A";
        } else {
            v_dop_lable.innerText = data.vdop;
        }
        if (data.pdop == "") {
            p_dop_lable.innerText = "N/A";
        } else {
            p_dop_lable.innerText = data.pdop;
        }
        if (data.tdop == "") {
            t_dop_lable.innerText = "N/A";
        } else {
            t_dop_lable.innerText = data.tdop;
        }
        if (data.gdop == "") {
            g_dop_lable.innerText = "N/A";
        } else {
            g_dop_lable.innerText = data.gdop;
        }
        if (data.xdop == "") {
            x_dop_lable.innerText = "N/A";
        } else {
            x_dop_lable.innerText = data.xdop;
        }
        if (data.ydop == "") {
            y_dop_lable.innerText = "N/A";
        } else {
            y_dop_lable.innerText = data.ydop;
        }
    }

    else{

        console.log("Sorry! The backend server is currently Inactive. Kindly re-check the connection.");

        // satellites_inView_lable.innerText = "N/A";
        // satellites_inUse_lable.innerText = "N/A";
        gpsFixStatus_lable.innerText = "N/A";
        gpsCoordinates_lable.innerText = "N/A";
        distance_label.innerText = "N/A";
        document.getElementById("status").innerHTML = "N/A";
        tracking_datetime_lable.innerText = "N/A";
        document.getElementById("trace-your-device").innerText = "N/A";
        document.getElementById("distance_in_meter").innerText = "N/A";
        // address_lable.style.height = "40px";
        address_lable.innerText = "N/A";
        speed_label_lable.innerText = "N/A";
        altitude_label.innerText = "N/A";
        degree_label.innerText = "N/A";
        moving_direction_lable.innerText = "N/A";
        document.getElementById("device-direction").innerText = "N/A";
        document.getElementById("tracking-direction").innerText = "";
        document.getElementById("trace-your-device").innerText = "";
        document.getElementById("distance_in_meter").innerText = "";
        local_datetime_lable.innerText = "N/A";
        utc_datetime_lable.innerText = "N/A";
        h_dop_lable.innerText = "N/A";
        v_dop_lable.innerText = "N/A";
        p_dop_lable.innerText = "N/A";
        t_dop_lable.innerText = "N/A";
        g_dop_lable.innerText = "N/A";
        x_dop_lable.innerText = "N/A";
        y_dop_lable.innerText = "N/A";

        //Server Not Running Message
        function showToastMessage(message) {
            toastr.options = {
              closeButton: true,
              positionClass: "toast-bottom-right",
              timeOut: 10000, // Time in milliseconds to auto-close the notification
            };

            toastr.success(message);

        }

        showToastMessage("Sorry! The backend server is currently Inactive. Kindly re-check the connection.");

    }
});



