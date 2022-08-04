'use strict'
////////////////////////////////////////////////////////////////////////////////////////////////////
const Icons = {
    1:L.icon({
        iconUrl: 'assets/img/marker.png',
        iconSize: [48, 48],
        iconAnchor: [22, 60],
        popupAnchor: [-3, -76],
    }),
    2: L.icon({
        iconUrl: 'assets/img/marker2.png',
        iconSize: [48, 48],
        iconAnchor: [22, 60],
        popupAnchor: [-3, -76],
    }),
    3: L.icon({
        iconUrl: 'assets/img/marker3.png',
        iconSize: [48, 48],
        iconAnchor: [22, 60],
        popupAnchor: [-3, -76],
    })
}
/////////////// /////////////////////////////////////////////////////////////////////////////////
const addressPoints = [
    {
        lat: 50.387273,
        lng: 30.624084,
        img: 'assets/img/abstract.jpg',
        descr: 'This is my place of residence.<br> Not for spread.',
        type: 1,
    },
    {
        lat: 50.401849382118435,
        lng: 30.632636297957657,
        img: 'assets/img/blue.jpg',
        descr: 'Here they sell the most delicious fish in the city.<br> I\'m often there.',
        type: 2,
    },
    {
        lat: 50.346753332881136,
        lng: 30.48959863146808,
        img: 'assets/img/green.jpg',
        descr: 'Here they sell the most delicious fish in the city.<br> I\'m often there.',
        type: 3,
    }
];
/////////////////////////////////////////////////////////////////////////////////////////////
function initMap() {
let tiles = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png\'', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
}),
    latlng = L.latLng(50.387273, 30.624084);
let map = L.map('map', {center: latlng, zoom: 13, layers: [tiles]});
    
    
    let markers = L.markerClusterGroup();
    addressPoints.forEach(el=>{
    let marker = L.marker(L.latLng(el.lat, el.lng), { title: el.descr, icon: Icons[el.type] }).bindPopup(el.descr);
    markers.addLayer(marker);
})
    map.addLayer(markers);
}

document.getElementById('load-map-link').addEventListener('click', function(){
    document.getElementById('map').innerHTML = '';
    initMap();
})




