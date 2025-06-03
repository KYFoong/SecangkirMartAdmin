import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

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

// Fetch orders and display them on the page
async function fetchOrders() {
  const orderCollection = collection(db, "Order");
  const orderSnapshot = await getDocs(orderCollection);
  const ordersContainer = document.querySelector(".box-container");

  ordersContainer.innerHTML = ""; // Clear existing content

  // Create an array to hold all the order documents
  const ordersArray = [];

  for (const orderDoc of orderSnapshot.docs) {
    const orderData = orderDoc.data();
    const userId = orderData.userId;

    // Convert Firestore Timestamp to readable date
    const placedOnDate = orderData.placedOn.toDate();
    const formattedDate = placedOnDate.toLocaleString("en-US", {
      timeZone: "Asia/Manila",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });

    // Fetch user details
    const userDoc = await getDoc(doc(db, "User", userId));
    const userData = userDoc.exists() ? userDoc.data() : { username: "Unknown", phoneNumber: "Unknown" };

    // Push each order and its ID to the ordersArray
    ordersArray.push({
      id: orderDoc.id,
      data: orderData,
      user: userData,
      formattedDate: formattedDate,
    });
  }

  // Sort ordersArray by orderCode in ascending order
  ordersArray.sort((a, b) => {
    if (a.data.orderCode < b.data.orderCode) return -1;
    if (a.data.orderCode > b.data.orderCode) return 1;
    return 0;
  });

  // Now display the sorted orders
  for (const order of ordersArray) {
    const orderData = order.data;
    const userData = order.user;
    const orderDocId = order.id;
    const formattedDate = order.formattedDate;

    // Create a box for each order
    const orderBox = document.createElement("div");
    orderBox.classList.add("box");

    // Display product names and quantities
    let productDetails = '';
    if (Array.isArray(orderData.products)) {
      productDetails = orderData.products.map(product => {
        return `<p><strong>${product.name}</strong> -<span>${product.quantity}</span></p>`;
      }).join('');
    }

    // Add the order details to the HTML
    orderBox.innerHTML = `
      <p style="text-align: center; font-size: 3rem;"><b>Order Code:</b> <span>${orderData.orderCode}</span></p>
      <p>User ID: <span>${orderData.userId}</span></p>
      <p>Placed On: <span>${formattedDate}</span></p>
      <p>Name: <span>${userData.username}</span></p>
      <p>Phone Number: <span>${userData.phoneNumber}</span></p>
      <p>Total Products: <span>${orderData.totalProducts}</span></p>
      ${productDetails} <!-- Display the product names and quantities -->
      <p>Total Price: <span>$${orderData.totalPrice.toFixed(2)}</span></p>
      <p>Order Status: <span>${orderData.orderStatus}</span></p>
      <form id="update-form-${orderDocId}" class="update-form">
        <input type="hidden" name="order_id" value="${orderDocId}">
        <select name="orderStatus" class="drop-down">
          <option value="Processing" ${orderData.orderStatus.trim() === "Processing" ? "selected" : ""}>Processing</option>
          <option value="Completed" ${orderData.orderStatus.trim() === "Completed" ? "selected" : ""}>Completed</option>
        </select>
        <div class="flex-btn">
          <button type="button" class="btn">Update</button>
          <a href="#" class="delete-btn">Delete</a>
        </div>
      </form>
    `;

    ordersContainer.appendChild(orderBox);

    // Attach event listener for the update button
    const updateButton = orderBox.querySelector(".btn");
    updateButton.addEventListener("click", () => updateOrderStatus(orderDocId));

    // Attach event listener for the delete button
    const deleteButton = orderBox.querySelector(".delete-btn");
    deleteButton.addEventListener("click", () => deleteOrder(orderDocId));
  }
}

// Update order status
async function updateOrderStatus(orderId) {
  const statusSelect = document.querySelector(`#update-form-${orderId} select[name="orderStatus"]`);
  const newStatus = statusSelect.value;

  try {
    await updateDoc(doc(db, "Order", orderId), {
      orderStatus: newStatus,
    });
    alert("Order status updated successfully.");
    fetchOrders(); // Refresh the list after update
  } catch (error) {
    console.error("Error updating order status:", error);
    alert("Failed to update the order status.");
  }
}

// Delete order
async function deleteOrder(orderId) {
  if (confirm("Are you sure you want to delete this order?")) {
    try {
      await deleteDoc(doc(db, "Order", orderId));
      alert("Order deleted successfully.");
      fetchOrders(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete the order.");
    }
  }
}

// Initialize the page
fetchOrders();
