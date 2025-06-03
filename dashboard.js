// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSMQRYlci-KpltYDLtyJmnoT_x0uivvTI",
  authDomain: "secangkirmart-mad.firebaseapp.com",
  projectId: "secangkirmart-mad",
  storageBucket: "secangkirmart-mad.firebasestorage.app",
  messagingSenderId: "861380753037",
  appId: "1:861380753037:web:99b5f883b3719856d414c4",
  measurementId: "G-TYMCJHQKFG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Auth
// const auth = getAuth();

// // Check if the user is logged in
// onAuthStateChanged(auth, (user) => {
//   if (!user) {
//     // If no user is logged in, redirect to login page
//     window.location.href = "admin_login.html";
//   } else {
//     // Proceed with loading the dashboard
//     console.log("Admin is logged in!");
//   }
// });


const getAdminName = async () => {
    try {
      const adminCollectionRef = collection(db, "Admin"); // Reference to the Admin collection
      
      // Fetch all documents in the Admin collection
      const querySnapshot = await getDocs(adminCollectionRef);
      
      // Check if the collection is not empty (i.e., it contains the admin document)
      if (!querySnapshot.empty) {
        // Get the first document from the collection (assuming only one admin)
        const adminDoc = querySnapshot.docs[0]; // Get the first document (the only one in this case)
        
        // Access the data of the admin document
        const adminData = adminDoc.data();
        const adminName = adminData.username; // Assuming the admin document has a 'name' field
        
        console.log("Admin Name: ", adminName); // Log the admin name to the console
        document.getElementById('admin-name').textContent = adminName; // Display the admin name in the UI
      } else {
        console.log("No admin document found!");
      }
    } catch (error) {
      console.error("Error fetching admin data: ", error); // Handle any errors
    }
  };
  
  // Call the function to fetch the admin name on page load
  getAdminName();  

// Function to count the number of documents in a collection
const countDocumentsInCollection = async (collectionName) => {
  const collectionRef = collection(db, collectionName);
  
  try {
    const snapshot = await getDocs(collectionRef);
    const documentCount = snapshot.size;  // `size` gives the count of documents in the snapshot
    return documentCount;
  } catch (error) {
    console.error("Error counting documents:", error);
    return 0;
  }
};

// Call the function to count documents and update the UI
const updateDashboard = async () => {
  const feedbackCount = await countDocumentsInCollection("Feedback");  // Count Feedback documents
  const productCount = await countDocumentsInCollection("Category");  // Count Product documents
  const orderCount = await countDocumentsInCollection("Order");  // Count Order documents
  
  // Update the number of feedbacks in the dashboard
  document.getElementById('feedback-count').textContent = feedbackCount;
  
  // Update the number of products in the dashboard
  document.getElementById('product-count').textContent = productCount;
  
  // Update the number of orders in the dashboard
  document.getElementById('order-count').textContent = orderCount;
};

// Call the update function on page load
updateDashboard();
