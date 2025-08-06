function showmap() {
    map = L.map('mapdiv');
    map.setView([53.8043, -1.5548], 12);

    //Load tiles from open street map
    L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data ©OpenStreetMap contributors, CC-BY-SA, Imagery 		©CloudMade',
        maxZoom: 18
    }).addTo(map); //add the basetiles to the map object
}

//create a object for storing the markers picture. 
const crimeIcons = {
    'Anti-social behaviour': L.icon({
        iconUrl: "images/anti-social.png",
        iconSize: [30, 30]
    }),
    'Bicycle theft': L.icon({
        iconUrl: "images/mountain.png",
        iconSize: [30, 30]
    }),
    'Burglary': L.icon({
        iconUrl: "images/thief.png",
        iconSize: [30, 30]
    }),
    'Criminal damage and arson': L.icon({
        iconUrl: "images/violent-criminal.png",
        iconSize: [30, 30]
    }),
    'Drugs': L.icon({
        iconUrl: "images/drug.png",
        iconSize: [30, 30]
    }),
    'Other crime': L.icon({
        iconUrl: "images/hacker.png",
        iconSize: [30, 30]
    }),
    'Public order': L.icon({
        iconUrl: "images/society.png",
        iconSize: [30, 30]
    }),
    'Robbery': L.icon({
        iconUrl: "images/robbery.png",
        iconSize: [30, 30]
    }),
    'Shoplifting': L.icon({
        iconUrl: "images/goods.png",
        iconSize: [30, 30]
    }),
    'Vehicle crime': L.icon({
        iconUrl: "images/police-car.png",
        iconSize: [30, 30]
    }),
    'Violence and sexual offences': L.icon({
        iconUrl: "images/violence.png",
        iconSize: [30, 30]
    }),
    'Other theft': L.icon({
        iconUrl: "images/robbery.png",
        iconSize: [30, 30]
    }),
    'Theft from the person': L.icon({
        iconUrl: "images/goods.png",
        iconSize: [30, 30]
    }),
    'Possession of weapons': L.icon({
        iconUrl: "images/rifle.png",
        iconSize: [30, 30]
    })
}

//other marker for when generate heat map
const Icon2 = L.icon({
    iconUrl: "point1.png",
    iconSize: [7, 7]
});

//create a variable to link crimeSelector in html
const selectElement = document.querySelector('#crimeSelector')

//create a few temporary variables for storing data or selecting
let currentCrimeType = ''
let markers = []
let heatLayer = null
let description = ''
let count = 0

//this is a function for counting the number of current selected crime type
function countcrime() {
    count = 0
    for (let i = 0; i < crimedata.length; i++) {
        if (crimedata[i]['Crime type'] === currentCrimeType) {
            count++
        }
    }
}

//this is a function for cleaning the markers of current crime type was selected (learned from chatgpt3.5)
function cleanMarker() {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
}

//this is a function for clean heat map (learned from chatgpt3.5)
function cleanHeat() {
    if (heatLayer) {
        map.removeLayer(heatLayer);
        heatLayer = null;
    }
}

//this is the main cleaning function, which can reset the everything
const clean = function () {
    cleanHeat();
    cleanMarker();
    markers = [];
    count = 0;
    document.querySelector("#crimeCountText").textContent = `Number of this type of crime: ${count}`;
};

//link to html, when click the "clean" button, execute the clean function
document.querySelector('#cleanButton').addEventListener('click', clean);

//when click "show" button, execute the function which contains following contents
document.querySelector('#showButton').addEventListener('click', function () {
    clean()

    //Pass the current selection in html to CurrentCrimeType
    currentCrimeType = selectElement.value;

    //execute counting funciton
    countcrime();
    document.querySelector("#crimeCountText").textContent = `Number of this type of crime: ${count}`;

    //pass relevant data to temporary variables and show this markers by location, then storing selecting data all together in a array "markers"
    for (let i = 0; i < crimedata.length; i++) {
        if (crimedata[i]['Crime type'] === currentCrimeType) {
            let lon = crimedata[i].Longitude, lat = crimedata[i].Latitude, loc = crimedata[i].Location, state = crimedata[i]['Last outcome category']
            description = `${currentCrimeType}, happened ${loc}, state: ${state}`
            const marker = L.marker([lat, lon], { icon: crimeIcons[currentCrimeType] }).addTo(map).bindPopup(`${description}`)
            markers.push({ lat, lon, description });//the information of every selected event was stored as an new object in the "markers"
        }
    }
})

//when click "generate heat map",execute following function
document.querySelector('#heatButton').addEventListener('click', function () {
    const selectedType = selectElement.value;

    if (selectedType !== currentCrimeType) {//a alert for wrong selecting
        alert('!oops: Please select crime type and click "show" button to generate marker first, then click "generate heat map" to show heat map')
        return
    } else {
        const heatData = markers.map(marker => [marker.lat, marker.lon]);// Extract latitude and longitude for next step
        cleanMarker();
        cleanHeat();
        heatLayer = L.heatLayer(heatData, {//learn from chatgpt3.5: creating heat map
            radius: 25,
            blur: 15,
            maxZoom: 18,
            gradient: {
                0.1: 'blue',
                0.2: 'lime',
                0.3: 'yellow',
                0.4: 'orange',
                0.5: 'red',
            }
        }).addTo(map);

        for (let i = 0; i < heatData.length; i++) {
            L.marker(heatData[i], { icon: Icon2 }).addTo(map).bindPopup(`${markers[i].description}`);
        }//the new marker when generate heat map
    }
})