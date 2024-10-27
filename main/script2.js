// Import the necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, setDoc, increment } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgC7eK1-jwDwXqHfmHb3MjPNnBlcjQWr8",
    authDomain: "scraplink-9ce04.firebaseapp.com",
    projectId: "scraplink-9ce04",
    storageBucket: "scraplink-9ce04.appspot.com",
    messagingSenderId: "406914882192",
    appId: "1:406914882192:web:3d429db720b3821decd615",
    measurementId: "G-G9M68432JZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Get the Firebase Auth instance
const db = getFirestore(app);

const displayUserRewards = async () => {
    const user = auth.currentUser; // Get the current user
    console.log("Current User in displayUserRewards:", user); // Log current user info
    if (user) {
        const userRef = doc(db, "users", user.uid);
        console.log("Fetching user document from:", userRef.path); // Log the document path
        const userDoc = await getDoc(userRef); // Get the user document

        if (userDoc.exists()) {
            const userData = userDoc.data();
            // Display the rewards in the rewards-display element
            const rewardsDisplay = document.getElementById("rewards-display");
            if (rewardsDisplay) {
                rewardsDisplay.innerText = `Rewards: ${userData.rewards}`; 
                console.log("Rewards display updated:", userData.rewards); // Update rewards display
            }
        } else {
            console.error("No user document found for user ID:", user.uid); // More specific error logging
        }
    } else {
        console.log("No user is currently logged in.");
    }
};


// Function to update user rewards
const updateUserRewards = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef); // Check if the user document exists

    if (userDoc.exists()) {
        try {
            await updateDoc(userRef, { rewards: increment(100) }); // Increment rewards
            console.log("User rewards updated!");
        } catch (error) {
            console.error("Error updating rewards:", error);
        }
    } else {
        console.error("No user document found for ID:", userId);
    }
};

// Function to log scrap details and update impact
function logScrap() {
    const scrapType = document.getElementById('scrap-type').value;
    const scrapWeight = parseFloat(document.getElementById('scrap-weight').value);
    const scrapVolume = parseFloat(document.getElementById('scrap-volume').value);

    if (isNaN(scrapWeight) || isNaN(scrapVolume)) {
        alert("Please enter valid numbers for weight and volume.");
        return;
    }

    co2Saved += scrapWeight * 0.1; // Example CO₂ savings per kg
    resourcesConserved += scrapVolume * 0.05; // Example resources savings per liter

    document.getElementById('co2-saved').innerText = co2Saved.toFixed(2);
    document.getElementById('resources-conserved').innerText = resourcesConserved.toFixed(2);

    const progressPercent = Math.min((co2Saved / goal) * 100, 100);
    document.getElementById('progress-bar').style.width = progressPercent + '%';

    document.getElementById('scrap-type').value = '';
    document.getElementById('scrap-weight').value = '';
    document.getElementById('scrap-volume').value = '';

    alert(`Scrap logged: ${scrapType} - ${scrapWeight} kg, ${scrapVolume} liters`);
}

// Function to confirm order with delay and redirect
function confirmOrder() {
    alert("Order confirmed! You have selected items to be recycled.");
    
    // Redirect to the home page after 3 seconds
    setTimeout(() => {
        window.location.href = "index.html";
    }, 2000);
}

// Wait until DOM is fully loaded before attaching event listeners
document.addEventListener("DOMContentLoaded", () => {
    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the default form submission

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log('Login successful:', user);
                document.getElementById('auth-message').innerText = 'Login successful! Welcome, ' + user.email;

                // Directly call displayUserRewards to show rewards without needing a page reload
                await displayUserRewards();

                // Redirect to the main page after displaying rewards
                window.location.href = 'index.html'; // Change this to the path of your index file
            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error logging in:', errorCode, errorMessage);
                document.getElementById('auth-message').innerText = errorMessage;
            }
        });
    }

    // Handle signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the default form submission

            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log('Signup successful:', user);

                // Create user document in Firestore
                await setDoc(doc(db, "users", user.uid), {
                    rewards: 0 // Initialize rewards to 0
                });

                document.getElementById('auth-message').innerText = 'Signup successful! Welcome, ' + user.email;
                signupForm.reset();
            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error signing up:', errorCode, errorMessage);
                document.getElementById('auth-message').innerText = `Error: ${errorMessage}`;
            }
        });
    }

    // Auth state observer
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("User is logged in:", user.uid);
            await displayUserRewards(); // Display rewards on page load if user is logged in
        } else {
            console.log("No user is logged in.");
        }
    });

    // Check for order-pickup-btn and attach event listener if it exists
    const orderPickupBtn = document.getElementById("order-pickup-btn");
    if (orderPickupBtn) {
        orderPickupBtn.addEventListener("click", async () => {
            const user = auth.currentUser;
            console.log("Current User:", user); // Log current user info

            if (user) {
                try {
                    console.log("Order pickup clicked. User ID:", user.uid);
                    await updateUserRewards(user.uid);
                    console.log("Rewards updated, now displaying..."); // Log before displaying
                    await displayUserRewards(); // Call to display updated rewards
                } catch (error) {
                    console.error("Error updating rewards:", error);
                }
            } else {
                console.log("User not logged in.");
            }
        });
    }

    // Check for log-scrap-btn and attach event listener if it exists
    const logScrapButton = document.getElementById("log-scrap-btn");
    if (logScrapButton) {
        logScrapButton.addEventListener("click", logScrap);
    }

    // Confirm order event listener
    orderPickupBtn?.addEventListener("click", confirmOrder);
});