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
        if(kounter > 1){

                map.addSource("route2",getGeoJsonForLines(thismarker).data);// getGeoJsonForLines());
            // for(var i = 0; i < kounter; i++){
            //     map.getSource('route2').setData(getGeoJsonForLines(thismarker).data);
            // }
        }
    });
    closePopup();
    kounter++;
}

function getGeoJsonForLines(thismarker) {

    let gjfl = {
        type: 'geojson',
        data: {
            features: [],
            type: "FeatureCollection"
        }
    };

    for (let i = 0; i < markers.length; i++) {
        if(i == id){console.log('equal', i, id);}
        else{
            gjfl.data.features[i] = {
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
                }
            };
        }
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
