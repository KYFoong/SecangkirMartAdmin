import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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
const auth = getAuth();

// Export logout function
export function logout() {
  console.log("Executing logout...");
  signOut(auth)
    .then(() => {
      console.log("User logged out successfully");
      window.location.href = "admin_login.html";
    })
    .catch((error) => {
      console.error("Error logging out:", error);
      alert("An error occurred while logging out. Please try again.");
    });
}
