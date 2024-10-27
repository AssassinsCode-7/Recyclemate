import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgC7eK1-jwDwXqHfmHb3MjPNnBlcjQWr8",
    authDomain: "scraplink-9ce04.firebaseapp.com",
    projectId: "scraplink-9ce04",
    storageBucket: "scraplink-9ce04.appspot.com",
    messagingSenderId: "406914882192",
    appId: "1:406914882192:web:3d429db720b3821decd615",
    measurementId: "G-G9M68432JZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginSignupLink = document.getElementById("loginSignupLink");
const profileDropdown = document.getElementById("profileDropdown");
const profileButton = document.querySelector(".profile-btn");
const rewardsDisplay = document.getElementById("rewards-display");

// Toggle dropdown visibility on button click
profileButton.addEventListener("click", () => {
    profileDropdown.classList.toggle("show");
});

// Close dropdown if clicking outside
window.addEventListener("click", (event) => {
    if (!profileDropdown.contains(event.target) && !profileButton.contains(event.target)) {
        profileDropdown.classList.remove("show");
    }
});

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is logged in
        loginSignupLink.style.display = "none";
        profileDropdown.style.display = "inline-block";

        // Fetch and display user rewards
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            rewardsDisplay.innerText = `Rewards: ${userData.rewards} points`;
        } else {
            console.error("No user document found!");
        }
    } else {
        // User is logged out
        loginSignupLink.style.display = "inline-block";
        profileDropdown.style.display = "none";
    }
});

document.getElementById("logoutButton").addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            console.log("User signed out.");
            // Redirect to login page or display logout message if desired
        })
        .catch((error) => {
            console.error("Sign out error:", error);
        });
});

// Slideshow for Hero Section
const images = ['img1.jpg', 'img2.jpg']; // Replace with actual image paths
let currentIndex = 0;

function updateBackground(direction) {
    const heroSection = document.querySelector('.hero');
    heroSection.style.backgroundImage = `linear-gradient(rgba(0, 150, 136, 0.6), rgba(0, 0, 0, 0.6)), url('${images[currentIndex]}')`;

    heroSection.classList.remove('slide-in-left', 'slide-in-right');
    if (direction === 'next') {
        heroSection.classList.add('slide-in-right');
    } else {
        heroSection.classList.add('slide-in-left');
    }
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateBackground('next');
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateBackground('prev');
}

updateBackground('next'); // Initialize the first image

const scrapCollectors = [
    { name: "Collector 1", lat: 8.89, lon: 77.61 }, // Example coordinates
    { name: "Collector 2", lat: 12.60, lon: 80.35 },
    { name: "Collector 3", lat: 12.50, lon: 80.15 }
];

// Initialize the map centered on South India
const map = L.map('map').setView([12.5, 80.5], 6); // Set zoom level to 6

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Function to locate a place based on input and display nearby scrap collectors
function locatePlace() {
    const query = document.getElementById('search-input').value;

    // Check if the input is not empty
    if (query) {
        // Use Nominatim API to get coordinates of the location
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    // latitude and longitude of the first search result
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);

                    // Center map view on the found location and zoom in
                    map.setView([lat, lon], 13); // Set zoom level to 13

                    // Add a marker at the found location
                    L.marker([lat, lon]).addTo(map)
                        .bindPopup(`<b>${data[0].display_name}</b>`)
                        .openPopup();

                    // Show nearby scrap collectors within a certain radius
                    showNearbyCollectors(lat, lon);
                } else {
                    alert('Location not found. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching location:', error);
                alert('An error occurred while searching for the location.');
            });
    } else {
        alert('Please enter a location name.');
    }
}

// Function to display nearby scrap collectors based on distance
function showNearbyCollectors(lat, lon) {
    scrapCollectors.forEach(collector => {
        const distance = getDistance(lat, lon, collector.lat, collector.lon);

        if (distance < 100) {
            const popupContent = `
                <b>${collector.name}</b><br>
                ${distance.toFixed(2)} km away<br>
                Contact: ${collector.contact || 'N/A'}<br>
                Type: ${collector.type || 'General'}
            `;

            L.marker([collector.lat, collector.lon]).addTo(map)
                .bindPopup(popupContent)
                .openPopup();
        }
    });
}

// Function to calculate distance between two coordinates using the Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// // Smooth scrolling for internal links
// document.querySelectorAll('.nav-links a').forEach(link => {
//     link.addEventListener('click', function(e) {
//         e.preventDefault();
//         const targetId = this.getAttribute('href').substring(1);
//         const targetElement = document.getElementById(targetId);
//         if (targetElement) {
//             window.scrollTo({
//                 top: targetElement.offsetTop - 70, // Offset for fixed navbar
//                 behavior: 'smooth'
//             });
//         }
//     });
// });

// Utility function to convert degrees to radians
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Add event listener to the search button
document.getElementById('search-button').addEventListener('click', locatePlace);