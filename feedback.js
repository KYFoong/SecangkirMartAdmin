// Import the necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, deleteDoc, addDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
// Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Function to fetch and display feedback
const fetchAndDisplayfeedback = async () => {
  const feedbackCollectionRef = collection(db, "Feedback");  // Collection "Email" in Firestore
  
  try {
    // Fetch the documents from Firestore
    const snapshot = await getDocs(feedbackCollectionRef);
    
    // Check if snapshot has any documents
    if (snapshot.empty) {
      console.log('No feedback found.');
      return;
    }

    // Extract data from Firestore documents and get the document ID
    snapshot.docs.forEach(docSnapshot => {
      const feedback = docSnapshot.data();  // Extract the document data
      const feedbackId = docSnapshot.id;    // Firestore's document ID (this is automatically generated)
      
      console.log('feedback:', feedback);  // Log the feedback data for debugging
      console.log('feedback ID:', feedbackId);  // Log the Firestore document ID for debugging

      // Get the container where the feedback will be displayed
      const feedbackListContainer = document.getElementById('message-list');
      const feedbackBox = document.createElement('div');
      feedbackBox.classList.add('box');

      const feedbackName = document.createElement('div');
      feedbackName.classList.add('name');
      feedbackName.textContent = "Name: "+feedback.name || 'Anonymous'; 
      feedbackBox.appendChild(feedbackName);

      const feedbackNumber = document.createElement('div');
      feedbackNumber.classList.add('phoneNumber');
      feedbackNumber.textContent = "Number: " +feedback.phoneNumber|| '-';  // Default to 0 if NumberfeedbackNumber is missing
      feedbackBox.appendChild(feedbackNumber);

      const feedbackEmail = document.createElement('div');
      feedbackEmail.classList.add('email');
      feedbackEmail.textContent = "Email: " + feedback.email || '-';  
      feedbackBox.appendChild(feedbackEmail);

        // Add a custom text above the message part
      const customText = document.createElement('div');
      customText.classList.add('custom-text');
      customText.textContent = "Message:";  // Custom text above the message
      feedbackBox.appendChild(customText);

      const feedbackMessage= document.createElement('div');
      feedbackMessage.classList.add('feedback');
      feedbackMessage.textContent = feedback.feedback|| '-';  
      feedbackBox.appendChild(feedbackMessage);

      // Create the buttons for update and delete
      const buttonsContainer = document.createElement('div');
      buttonsContainer.classList.add('flex-btn');

      // Create the delete button
      const deleteButton = document.createElement('a');
      deleteButton.href = "#";  // No link, just an action button
      deleteButton.classList.add('delete-btn');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = async () => {
        if (confirm('Are you sure you want to delete this feedback?')) {
          try {
            // Get the reference to the document using its ID
            const feedbackDocRef = doc(db, "Feedback", feedbackId); // Using Firestore's auto-generated document ID
            
            console.log('Deleting document with ID:', feedbackId);  // Log feedback ID before deletion

            // Delete the feedback from Firestore
            await deleteDoc(feedbackDocRef);

            // Remove the feedback box from the UI after successful deletion
            feedbackBox.remove();
            alert("feedback deleted successfully.");
          } catch (error) {
            console.error("Error deleting feedback:", error);
            alert("Failed to delete the feedback.");
          }
        }
      };
      buttonsContainer.appendChild(deleteButton);

      feedbackBox.appendChild(buttonsContainer);

      // Append the feedback box to the container
      feedbackListContainer.appendChild(feedbackBox);
    });
  } catch (error) {
    console.error("Error getting feedback: ", error);
  }
};

// Call the function to fetch and display feedback when the page loads
fetchAndDisplayfeedback();

  