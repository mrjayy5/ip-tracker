// Initialize LeafletJS map
const mymap = L.map("map", { zoomControl: false,}).setView([0, 0], 1);

// TitleLayer for the map
const tileLayer = L.tileLayer('https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 3,
	maxZoom: 22,
    subdomains: 'abcd',
	accessToken: 'UJfFAr4nT4ZdiSdIHrVJhfjlGoKDxene5NVwJVQRdgXi6h4WvuGgquwKAmGUmscf'
}).addTo(mymap);

// Custom Icon for the marker
const myIcon = L.icon({
    iconUrl: '/images/icon-location.svg',
    iconSize: [45, 55],
    iconAnchor: [22, 94],
    popupAnchor: [200, -76]
});

// Initialize the marker
const marker = L.marker([43.731477, 7.415162], {icon: myIcon}).addTo(mymap);

// IPG API by IPify
const api_url = "https://geo.ipify.org/api/v1?";
const api_key = "apiKey=at_FKgfoJ2HCtbaLE6tCvqwdlYrLR4Tv";

// Elements form dom
const form = document.getElementById("ip_search");
const ipPlaceholder = document.getElementById("ip");
const locationPlaceholder = document.getElementById("location");
const timezonePlaceholer = document.getElementById("timezone");
const ispPlaceholder = document.getElementById("isp");

// Listener for submit event
form.addEventListener("submit", getLocation);

// Start with initial user IP
loading();
loadIp();

function loading() {
    ipPlaceholder.innerHTML = `
    <div class="load">
        <img src="/images/load.gif">
    </div>`;
    locationPlaceholder.innerHTML = `
    <div class="load">
        <img src="/images/load.gif">
    </div>`;
    timezonePlaceholer.innerHTML = `
    <div class="load">
        <img src="/images/load.gif">
    </div>`;
    ispPlaceholder.innerHTML = `
    <div class="load">
        <img src="/images/load.gif">
    </div>`;
}

// Set initial value to the user IP
async function loadIp() {
    await fetch(api_url + api_key + "&domain")
        .then((res) => res.json())
        .then((data) => {
        setLocation(data);
    });
}

// Function that is called on submit
async function getLocation(e) {
    // Prevent page refresh on submit
    e.preventDefault();

    // Input data
    const input = document.getElementById("input_ip_search").value;

    // API call
    const seatch = await fetch(api_url + api_key + "&domain=" + input)
        .then((res) => {
            if(res.status != 200) {
                document.getElementById("input_ip_search").setAttribute("class", "error");
            } else {
                loading();
                document.getElementById("input_ip_search").removeAttribute("class", "error");
                return res.json();
            }
        })
        .then((data) => {
            setLocation(data);
        })
        .catch((error) => {
            console.log(error);
        });
}

// Function to change the map to search IP Address
function setLocation(results) {

    const {ip, location, isp } = results;

    mymap.flyTo([location.lat, location.lng], 15, { duration: 4 });
    marker.setLatLng([location.lat, location.lng]).bindPopup(location.city);

    ipPlaceholder.innerHTML = ip;
    locationPlaceholder.innerHTML = location.city + ", " + location.country + " " + location.postalCode;
    timezonePlaceholer.innerHTML = "UTC " + location.timezone;
    ispPlaceholder.innerHTML = isp;

    // Quick fix for mobile version
    document.querySelector(".leaflet-pane").style.transform = "translate3d(0, 150px, 0)";
}