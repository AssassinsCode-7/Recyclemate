// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Initialize Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBzw1mu3okjUv2Jnfv5Mw2B_g2E7uUKF8E",
    authDomain: "scraplink-5d097.firebaseapp.com",
    databaseURL: "https://scraplink-5d097-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "scraplink-5d097",
    storageBucket: "scraplink-5d097.appspot.com",
    messagingSenderId: "161046137814",
    appId: "1:161046137814:web:dc72edf2682d9a11e83277",
    measurementId: "G-ZWJS09K29C"
};

// Initialize Firebase and Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to add a collector to 'scrapCollectors'
// Function to add a collector to 'scrapCollects'
// function addCollector(collectorId, collectorName, collectorLocation, collectorLat, collectorLon) {
//     set(ref(db, 'scrapCollects/' + collectorId), {
//         collector_id: collectorId,
//         collector_name: collectorName,
//         collector_location: collectorLocation,
//         collector_lat: collectorLat,
//         collector_lon: collectorLon
//     }).then(() => {
//         console.log("Collector added successfully.");
//     }).catch((error) => {
//         console.error("Error adding collector:", error);
//     });
// }

function addCollector(collectorId, collectorName, collectorLocation, collectorLat, collectorLon, collectorCategories) {
    set(ref(db, 'scrapCollects/' + collectorId), {
        collector_id: collectorId,
        collector_name: collectorName,
        collector_location: collectorLocation,
        collector_lat: collectorLat,
        collector_lon: collectorLon,
        collector_categories: collectorCategories  // Array of categories
    }).then(() => {
        console.log("Collector added successfully with categories.");
    }).catch((error) => {
        console.error("Error adding collector:", error);
    });
}

// Example usage:
// addCollector("003", "Collector C", "Karunagappally", 9.0598, 76.5356, ["plastic", "cloths"]);
// addCollector("001", "Collector A", "Kollam", 8.8932, 76.6141,["electronic","metal"]);
// addCollector("002", "Collector B", "Amritapuri", 9.0875, 76.5401,["plastic","metal"]);
// Example usage:
// addCollector("001", "Collector A", "Kollam", 8.8932, 76.6141);
// addCollector("002", "Collector B", "Amritapuri", 9.0875, 76.5401);


// Initialize map centered on South India
const map = L.map('map').setView([12.5, 80.5], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

let initialLocationMarker;
const collectorMarkers = [];
// Function to locate a place and display nearby scrap collectors
async function locatePlace() {
    const query = document.getElementById('search-input').value;

    if (query) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);

                // Remove the initial location marker if it exists
                if (initialLocationMarker) {
                    map.removeLayer(initialLocationMarker);
                }

                // Add marker for the searched location
                initialLocationMarker = L.marker([lat, lon]).addTo(map)
                    .bindPopup(`<b>${data[0].display_name}</b>`)
                    .openPopup();

                map.setView([lat, lon], 13);

                // Fetch and display nearby scrap collectors without clearing the view
                const collectors = await fetchScrapCollectors();
                showNearbyCollectors(lat, lon, collectors);
            } else {
                alert('Location not found. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching location:', error);
            alert('An error occurred while searching for the location.');
        }
    } else {
        alert('Please enter a location name.');
    }
}


// Function to fetch scrap collectors from Firebase
// Function to fetch scrap collectors from Firebase
async function fetchScrapCollectors() {
    const collectorsRef = ref(db, "scrapCollects"); // Corrected path to 'scrapCollects'
    const snapshot = await get(collectorsRef);
    const collectors = [];
     
    if (snapshot.exists()) {
        snapshot.forEach(childSnapshot => {
            const collector = childSnapshot.val();
            collectors.push({
                name: collector.collector_name,
                lat: parseFloat(collector.collector_lat),
                lon: parseFloat(collector.collector_lon),
            });
            
        });
    } else {
        console.log("No data available.");
    }
    return collectors;
}


// Function to display nearby scrap collectors
function showNearbyCollectors(lat, lon, collectors) {
    collectors.forEach(collector => {
        const distance = getDistance(lat, lon, collector.lat, collector.lon);

        if (distance < 30) { // Within 5 km range
            const marker = L.marker([collector.lat, collector.lon]).addTo(map)
                .bindPopup(`<b>${collector.name}</b><br>${distance.toFixed(2)} km away`)
                .openPopup();

            // Store each collector marker for potential management (e.g., removal)
            collectorMarkers.push(marker);
        }
    });
}

// Haversine formula to calculate distance between two coordinates
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// Convert degrees to radians
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Add event listener to the search button
document.getElementById('search-button').addEventListener('click', locatePlace);
