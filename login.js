import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSMQRYlci-KpltYDLtyJmnoT_x0uivvTI",
  authDomain: "secangkirmart-mad.firebaseapp.com",
  projectId: "secangkirmart-mad",
  storageBucket: "secangkirmart-mad.firebasestorage.app",
  messagingSenderId: "861380753037",
  appId: "1:861380753037:web:99b5f883b3719856d414c4",
  measurementId: "G-TYMCJHQKFG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// Variables to track login attempts and lockout time
let loginAttempts = 0;
let lockoutTime = null;
const lockoutDuration = 30000; // 30 seconds lockout duration

// Set persistence for authentication to store user session in the browser's local storage
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Listen for form submission
    document.getElementById("login-form").addEventListener("submit", async function (e) {
      e.preventDefault(); // Prevent default form submission

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      // Check if user is currently locked out
      if (lockoutTime && Date.now() - lockoutTime < lockoutDuration) {
        const timeRemaining = Math.ceil((lockoutDuration - (Date.now() - lockoutTime)) / 1000);
        alert(`Too many failed attempts. Please try again in ${timeRemaining} seconds.`);
        return false; // Prevent form submission and page reload
      }

      try {
        // Query Firestore for the admin with the given username
        const adminRef = collection(db, "Admin");
        const q = query(adminRef, where("username", "==", username));
        const adminSnapshot = await getDocs(q);

        if (adminSnapshot.empty) {
          alert("Username not found.");
          return false; // Prevent form submission and page reload
        }

        let adminData = null;
        adminSnapshot.forEach((doc) => {
          adminData = doc.data(); // Retrieve the admin data from Firestore
        });

        // Validate password
        if (adminData && adminData.pwd === password && adminData.username === username) {
          // Reset login attempts and lockout time on successful login
          loginAttempts = 0;
          lockoutTime = null;

          // Sign in the user using Firebase Authentication
          signInWithEmailAndPassword(auth, adminData.email, password)
            .then((userCredential) => {
              // Redirect to the dashboard after successful login
              window.location.href = "dashboard.html";
            })
            .catch((error) => {
              console.error("Error signing in:", error);
              alert("Failed to sign in. Please try again.");
              return false; // Prevent form submission and page reload
            });
        } else {
          // Increment login attempts
          loginAttempts++;
          if (loginAttempts >= 3) {
            lockoutTime = Date.now(); // Start lockout period
            alert("Too many failed attempts. Please try again in 30 seconds.");
            return false; // Prevent form submission and page reload
          } else {
            alert(`Incorrect username or password. You have ${3 - loginAttempts} attempts left.`);
            return false; // Prevent form submission and page reload
          }
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again.");
        return false; // Prevent form submission and page reload
      }
    });
  })
  .catch((error) => {
    console.error("Error setting persistence:", error); // Handle persistence setting errors
  });

