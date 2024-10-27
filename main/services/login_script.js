// Import the necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, setDoc,increment } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
// Handle login form submission
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the default form submission

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in successfully
                const user = userCredential.user;
                console.log('Login successful:', user);
                document.getElementById('auth-message').innerText = 'Login successful! Welcome, ' + user.email;
                window.location.href = '/main/index.html'; // Change this to the path of your index file

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error logging in:', errorCode, errorMessage);
                document.getElementById('auth-message').innerText = errorMessage;
            });
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

const displayUserRewards = async () => {
    const user = auth.currentUser; // Get the current user
    console.log("Current User in displayUserRewards:", user); // Log current user info
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef); // Get the user document

        if (userDoc.exists()) {
            const userData = userDoc.data();
            // Display the rewards in the rewards-display element
            const rewardsDisplay = document.getElementById("rewards-display");
            if (rewardsDisplay) {
                rewardsDisplay.innerText = `Your rewards: ${userData.rewards}`; 
                console.log("hi") // Update rewards display
            }
        } else {
            console.error("No user document found!");
        }
    } else {
        console.log("No user is currently logged in.");
    }
};
const orderPickupBtn = document.getElementById("order-pickup-btn");
if (orderPickupBtn) {
    orderPickupBtn.addEventListener("click", async () => {
        const user = auth.currentUser;
        console.log("Current User:", user); // Log current user info

        if (user) {
            try {
                console.log("Order pickup clicked. User ID:", user.uid);
                // Call the update function
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