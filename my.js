mapboxgl.accessToken = 'pk.eyJ1Ijoib2tpZWJ1YmJhIiwiYSI6ImNpdHZscGs3ajAwNXYyb284bW4ydWUzbGsifQ.1PoNrSP0F65WolWgqKhV4g';
var map;
var kounter = 0;
var markers = [];
var lonlat = [-97.50732685771766, 35.47461778676444];
var dragAndDropped = false;

$(document).ready(function() {

    map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
        center: lonlat, // starting position
        zoom: 10.14 // starting zoom
    });

    map.on('rotate', function(e) {
        dragAndDropped = true;
    });

    map.on('drag', function(e) {
        dragAndDropped = true;
    });

    // map.on('mouseup', function(e) {
    //     closePopup();
    //     if (dragAndDropped) {
    //         dragAndDropped = false;
    //         // console.log('bailing');
    //         return;
    //     }
    //
    //     console.log('mouseup',e.originalEvent.which);
    //
    //     if (e.originalEvent.which == 1) { // left click
    //         console.log('calling createMarker', e.lngLat.lng, e.lngLat.lat);
    //         createMarker(e.lngLat.lng, e.lngLat.lat);
    //     } else { // not left click
    //         makePopupPicker(e);
    //     }
    //     // console.log(map.getZoom());
    // });

    map.on('mouseup', function(e) {
        closePopup();
        if (dragAndDropped) {
            dragAndDropped = false;
            console.log('bailing');
            return;
        }

        console.log('clickkkk', e.originalEvent.which);

        if (e.originalEvent.which != 1) { // not left click
            // createMarker(e.lngLat.lng, e.lngLat.lat);
        } else { // not left click
            console.log('calling makePopupPicker', e.lngLat.lng, e.lngLat.lat);
            makePopupPicker(e);
        }
        // console.log(map.getZoom());
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.addControl(new mapboxgl.ScaleControl({
        position: 'bottom-right',
        maxWidth: 80,
        unit: 'imperial'
    }));

    var navigationHtml =
        '<button class="mapboxgl-ctrl-icon mapboxgl-ctrl-geolocate" type="button" onclick="flytolocation()" accesskey="h"' +
        ' title="Reset map back to original view. Hot key: <alt> h"><span class="arrow";"></span></button>';
    // adds a navigation button that resets the view back to where it started
    $('.mapboxgl-ctrl-group').append(navigationHtml);

    $('.mapboxgl-ctrl-zoom-in').prop('title', 'Zoom In. Hot key: +  ');
    $('.mapboxgl-ctrl-zoom-out').prop('title', 'Zoom Out. Hot key: -  ');
    $('.mapboxgl-ctrl-compass').prop('title', 'Reset map to north. Hot key: <alt> n');
    $('.mapboxgl-ctrl-compass').attr('accesskey', 'n');
});

function createMarker(lng, lat) {
    console.log('createMarker', lat, lng);
    let marker = getGeoJsonForMarker(lng, lat);
    console.log('marker', marker);
    let randomImg = 'a' + Math.floor((Math.random() * 8) + 1) + '.gif';

    // create a DOM element for the marker
    var el = document.createElement('div');
    el.className = 'marker';
    el.id = 'markerId_' + kounter;
    el.style.backgroundImage = 'url(' + randomImg + ')';
    el.style.width = '50px';
    el.style.height = '50px';

    // el.addEventListener('click', function() {
    //     // window.alert(marker.properties.message);
    //     console.log('click', this);
    // });

    // var popup = new mapboxgl.Popup({
    //         offset: 25
    //     })
    //     .setText('-' + kounter);

    // add marker to map
    let mkr = markers.push(new mapboxgl.Marker(el, {
            offset: [-25, -25]
        })
        .setLngLat([lng, lat])
        // .setPopup(popup)
        .addTo(map));

    $('#markerId_' + kounter).append(
        '<div class="markerLabel" id="markerLabel_' + kounter + '">' + kounter + '</div>');
    $('#markerId_' + kounter).mouseup(function(a, b, c) {
        var id = a.target.innerText;
        var thismarker = markers[id];
        console.log('themarker', thismarker);
        console.log('number of markers', markers.length, markers);
        console.log('lng lat', thismarker._lngLat.lat, thismarker._lngLat.lng);
        if (kounter > 1) {
            var gj = getGeoJsonForLines(thismarker, id);
            console.log('gj', gj);
            map.addLayer(gj);
            // map.addSource("route2", gj.data); // getGeoJsonForLines());
            // for(var i = 0; i < kounter; i++){
            //     map.getSource('route2').setData(getGeoJsonForLines(thismarker).data);
            // }
        }
    });
    closePopup();
    kounter++;
}

function getGeoJsonForLines(thismarker, id) {

    let gjfl = {
        id: 'route2',
        type: 'line',
        source: {
            type: "geojson",
            data: {
                features: [],
                type: "FeatureCollection"
            },
        },
        layout: {
            'line-join': "round",
            'line-cap': "round"
        },
        paint: {
            'line-color': "#888",
            'line-width': 8
        }
    };

    for (let i = 0; i < markers.length; i++) {
        if (i == id) {
            console.log('equal', i, id);
        } else {
            gjfl.source.data.features[i] = {
                type: 'Feature',
                geometry: {
                    type: "LineString",
                    coordinates: [
                        thismarker._lngLat.lng, thismarker._lngLat.lat,
                        markers[i]._lngLat.lng, markers[i]._lngLat.lat
                    ]
                },
                "properties": {
                    title: 'aaa'
                    // iidd: siteComlinks[i].id
                },
            }
        };
    }


return gjfl;
}

function getGeoJsonForMarker(lng, lat) {
    console.log('lng', lng, 'lat', lat);
    var geojson = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            // "properties": {
            //     "title": "Small astronaut",
            //     "message": "Foo"
            // },
            "geometry": {
                "type": "Point",
                "coordinates": [lng, lat]
            }
        }]
    };
    return geojson;
}

function closePopup() {
    $('#popupmain').remove();
}

function makePopupPicker(e) {
    closePopup();
    console.log(e.point.x, e.point.y, e);
    let lng = e.lngLat.lng;
    let lat = e.lngLat.lat;
    let x = e.point.x;
    if (x > 150) x = x - 150;

    let theHtml = '';
    theHtml += "<div id='popupmain' class='popupmain' ";
    theHtml += " style='left: " + x + "px; top: " + e.point.y + "px;'>";
    // theHtml += '<div class="sometext">some text goes here</div>';
    theHtml += "<button class='buttonx' onclick='createMarker(" + lng + "," + lat + ")'>Add Marker</button>"
    theHtml += "<button class='buttonx' onclick='closePopup()'>Close</button>"
    theHtml += "<br></div>";

    $('#popup').append(theHtml);
}


function flytolocation() {

    map.flyTo({
        center: lonlat,
        pitch: 0,
        bearing: 0,
        zoom: 10.14
    });
}




// map.on('load', function () {
//
//     map.addLayer({
//         "id": "route",
//         "type": "line",
//         "source": {
//             "type": "geojson",
//             "data": {
//                 "type": "Feature",
//                 "properties": {},
//                 "geometry": {
//                     "type": "LineString",
//                     "coordinates": [
//                         [-122.48369693756104, 37.83381888486939],
//                         [-122.48348236083984, 37.83317489144141],
//                         [-122.48339653015138, 37.83270036637107],
//                         [-122.48356819152832, 37.832056363179625],
//                         [-122.48404026031496, 37.83114119107971],
//                         [-122.48404026031496, 37.83049717427869],
//                         [-122.48348236083984, 37.829920943955045],
//                         [-122.48356819152832, 37.82954808664175],
//                         [-122.48507022857666, 37.82944639795659],
//                         [-122.48610019683838, 37.82880236636284],
//                         [-122.48695850372314, 37.82931081282506],
//                         [-122.48700141906738, 37.83080223556934],
//                         [-122.48751640319824, 37.83168351665737],
//                         [-122.48803138732912, 37.832158048267786],
//                         [-122.48888969421387, 37.83297152392784],
//                         [-122.48987674713133, 37.83263257682617],
//                         [-122.49043464660643, 37.832937629287755],
//                         [-122.49125003814696, 37.832429207817725],
//                         [-122.49163627624512, 37.832564787218985],
//                         [-122.49223709106445, 37.83337825839438],
//                         [-122.49378204345702, 37.83368330777276]
//                     ]
//                 }
//             }
//         },
//         "layout": {
//             "line-join": "round",
//             "line-cap": "round"
//         },
//         "paint": {
//             "line-color": "#888",
//             "line-width": 8
//         }
//     });
// });
