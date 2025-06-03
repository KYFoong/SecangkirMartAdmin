import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBSMQRYlci-KpltYDLtyJmnoT_x0uivvTI",
    authDomain: "secangkirmart-mad.firebaseapp.com",
    projectId: "secangkirmart-mad",
    storageBucket: "secangkirmart-mad.firebasestorage.app",
    messagingSenderId: "861380753037",
    appId: "1:861380753037:web:99b5f883b3719856d414c4",
    measurementId: "G-TYMCJHQKFG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Check if the user is authenticated
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Redirect to login if no user is signed in
    window.location.href = "admin_login.html";
  } else {
    console.log("User is logged in:", user);
  }
});