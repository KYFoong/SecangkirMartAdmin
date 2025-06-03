// Import necessary Firebase functions
import {
  getFirestore,
  getDocs,
  collection,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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
const auth = getAuth(app);

// Reference to the form
const updateProfileForm = document.getElementById("update-profile");

// Function to fetch the current admin data
const getAdminData = async () => {
  try {
    const adminCollectionRef = collection(db, "Admin");
    const querySnapshot = await getDocs(adminCollectionRef);

    if (!querySnapshot.empty) {
      const adminDoc = querySnapshot.docs[0];
      const adminData = adminDoc.data();
      updateProfileForm.querySelector('input[name="username"]').value = adminData.username;
    } else {
      console.log("No admin document found!");
    }
  } catch (error) {
    console.error("Error fetching admin data: ", error);
  }
};

// Function to update the admin profile
const updateAdminProfile = async (e) => {
  e.preventDefault();

  const name = updateProfileForm.username.value.trim();
  const oldPass = updateProfileForm.old_pass.value;
  const newPass = updateProfileForm.new_pass.value;
  const confirmPass = updateProfileForm.confirm_pass.value;

  if (!name || !oldPass || !newPass || !confirmPass) {
    alert("Please fill in all the fields.");
    return;
  }

  if (newPass !== confirmPass) {
    alert("New passwords do not match!");
    return;
  }

  try {
    const user = auth.currentUser;

    if (!user) {
      alert("You need to be logged in to update your profile.");
      return;
    }

    // Reauthenticate the user to confirm their identity
    const credential = EmailAuthProvider.credential(user.email, oldPass);
    await reauthenticateWithCredential(user, credential);

    // Update password in Firebase Authentication
    await updatePassword(user, newPass);

    // Update profile in Firestore
    const adminCollectionRef = collection(db, "Admin");
    const querySnapshot = await getDocs(adminCollectionRef);

    if (!querySnapshot.empty) {
      const adminDocRef = querySnapshot.docs[0].ref;
      await updateDoc(adminDocRef, {
        username: name,
        pwd: newPass,
      });

      alert("Profile updated successfully!");
      updateProfileForm.reset();
      getAdminData();
    } else {
      console.log("No admin document found!");
    }
  } catch (error) {
    if (error.code === "auth/wrong-password") {
      alert("Incorrect old password!");
    } else if (error.code === "auth/weak-password") {
      alert("Password is too weak. Please choose a stronger password.");
    } else {
      console.error("Error updating admin profile:", error);
      alert("An error occurred while updating the profile. Please try again.");
    }
  }
};

// Call getAdminData to populate form fields
getAdminData();

// Add event listener to the form to handle the profile update
updateProfileForm.addEventListener("submit", updateAdminProfile);
