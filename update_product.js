// Import the necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, deleteDoc, addDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

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

// Function to fetch and display products
/*const fetchAndDisplayProducts = async () => {
  const productsCollectionRef = collection(db, "Category");  // Collection "Category" in Firestore
  
  try {
    // Fetch the documents from Firestore
    const snapshot = await getDocs(productsCollectionRef);
    
    // Check if snapshot has any documents
    if (snapshot.empty) {
      console.log('No products found.');
      return;
    }

    // Extract data from Firestore documents and get the document ID
    snapshot.docs.forEach(docSnapshot => {
      const product = docSnapshot.data();  // Extract the document data
      const productId = docSnapshot.id;    // Firestore's document ID (this is automatically generated)
      
      console.log('Product:', product);  // Log the product data for debugging
      console.log('Product ID:', productId);  // Log the Firestore document ID for debugging

      // Get the container where the products will be displayed
      const productListContainer = document.getElementById('product-list');
      const productBox = document.createElement('div');
      productBox.classList.add('box');

      // Create and append product elements
      const productImage = document.createElement('img');
      productImage.src = product.image || 'default-image.jpg';  // Fallback image if none is available
      productBox.appendChild(productImage);

      const productName = document.createElement('div');
      productName.classList.add('name');
      productName.textContent = product.name || 'No name'; 
      productBox.appendChild(productName);

      const productPrice = document.createElement('div');
      productPrice.classList.add('price');
      productPrice.innerHTML = "Price: " +`${product.price || 0}`;  // Default to 0 if price is missing
      productBox.appendChild(productPrice);

      const productCategory = document.createElement('div');
      productCategory.classList.add('cat');
      productCategory.textContent = "Category: " + product.cat || 'No category';  
      productBox.appendChild(productCategory);

      const productStatus = document.createElement('div');
      productStatus.classList.add('status');
      productStatus.textContent = "Status: " +product.status || 'No Status';  
      productBox.appendChild(productStatus);

      // Create the buttons for update and delete
      const buttonsContainer = document.createElement('div');
      buttonsContainer.classList.add('flex-btn');

      // Create the update button (optional, can add functionality to update)
      const updateButton = document.createElement('a');
      updateButton.href = `update_product.html?productId=${productId}`;  // Pass the product ID as a query parameter
      updateButton.classList.add('option-btn');
      updateButton.textContent = 'Update';
      buttonsContainer.appendChild(updateButton);

      // Create the delete button
      const deleteButton = document.createElement('a');
      deleteButton.href = "#";  // No link, just an action button
      deleteButton.classList.add('delete-btn');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = async () => {
        if (confirm('Are you sure you want to delete this product?')) {
          try {
            // Get the reference to the document using its ID
            const productDocRef = doc(db, "Category", productId); // Using Firestore's auto-generated document ID
            
            console.log('Deleting document with ID:', productId);  // Log product ID before deletion

            // Delete the product from Firestore
            await deleteDoc(productDocRef);

            // Remove the product box from the UI after successful deletion
            productBox.remove();
            alert("Product deleted successfully.");
          } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete the product.");
          }
        }
      };
      buttonsContainer.appendChild(deleteButton);

      productBox.appendChild(buttonsContainer);

      // Append the product box to the container
      productListContainer.appendChild(productBox);
    });
  } catch (error) {
    console.error("Error getting products: ", error);
  }
};

// Call the function to fetch and display products when the page loads
fetchAndDisplayProducts();*/


  // Fetch product data from Firestore using productId from URL
// Fetch product data from Firestore using productId from URL
// Fetch product data from Firestore using productId from URL
document.addEventListener("DOMContentLoaded", async function() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('productId'); // Get the productId from URL query string

  if (productId) {
      const productDocRef = doc(db, "Category", productId);
      const docSnapshot = await getDoc(productDocRef);

      if (docSnapshot.exists()) {
          const product = docSnapshot.data();

          // Pre-fill the form with the product data
          document.querySelector('input[name="pid"]').value = productId;
          document.querySelector('input[name="old_image"]').value = product.image;
          document.querySelector('img').src = product.image || 'default-image.jpg'; // Set the image URL or use a default image
          document.querySelector('input[name="name"]').value = product.name;
          document.querySelector('input[name="price"]').value = product.price;

            // Check category and status values
            console.log("Category Value:", product.cat);
            console.log("Status Value:", product.status);

            // Set the category dropdown value
            const categorySelect = document.querySelector('select[name="category"]');
            if (product.cat) {
                categorySelect.value = product.cat; // Set to product.cat if it exists
            }
            console.log("Selected Category:", categorySelect.value);  // Log selected category

            // Set the status dropdown value
            const statusSelect = document.querySelector('select[name="status"]');
            if (product.status) {
                statusSelect.value = product.status; // Set to product.status if it exists
            }
            console.log("Selected Status:", statusSelect.value);  // Log selected status

            document.querySelector('input[name="imageUrl"]').value = product.image;


          // Pre-select the categoryId checkboxes based on product data
          const popularCheckbox = document.getElementById("popular");
          const newCheckbox = document.getElementById("new");

          // Set checkboxes based on product's categoryId
          if (product.categoryId === "PopularProduct") {
              popularCheckbox.checked = true;
          } else if (product.categoryId === "NewProduct") {
              newCheckbox.checked = true;
          }
      } else {
          alert("Product not found.");
      }
  }
});

// Handle form submission for updating the product
document.getElementById("update-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const productId = e.target.pid.value;
  const updatedProduct = {
      name: e.target.name.value,
      price: parseFloat(e.target.price.value),
      cat: e.target.category.value,
      status: e.target.status.value,
      image: e.target.imageUrl.value
  };

  // Determine the categoryId based on the checkboxes
  const popularCheckbox = document.getElementById("popular");
  const newCheckbox = document.getElementById("new");

  let categoryId = null;

  // If neither checkbox is checked, categoryId will be null
  if (popularCheckbox.checked) {
      categoryId = "PopularProduct";
  } else if (newCheckbox.checked) {
      categoryId = "NewProduct";
  }

  // Update the categoryId (null if neither checkbox is selected)
  updatedProduct.categoryId = categoryId;

  const productDocRef = doc(db, "Category", productId);

  try {
      // Update the product in Firestore
      await updateDoc(productDocRef, updatedProduct);
      alert("Product updated successfully.");
      window.location.href = "products.html"; // Redirect back to the product list page
  } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update the product.");
  }
});


