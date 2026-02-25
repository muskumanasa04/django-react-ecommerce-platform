import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/CartPage.css";

const AllUsersCartPage = () => {
  const [allCarts, setAllCarts] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchAllCarts();
  }, []);

  const fetchAllCarts = async () => {
    try {
      const res = await API.get("all-carts/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllCarts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch all carts");
    }
  };

  // Group by user
  const userCarts = {};
  allCarts.forEach((item) => {
    if (!userCarts[item.user]) userCarts[item.user] = [];
    userCarts[item.user].push(item);
  });

  return (
    <div className="cart-page-container">
      <h2>All Users Cart Items</h2>

      {Object.entries(userCarts).map(([user, items]) => (
        <div key={user} className="user-cart-section">
          <h3>User: {user}</h3>
          {items.map((item) => (
            <div key={item.id} className="cart-item-card">
              <img src={item.image} alt={item.product} className="cart-item-img" />
              <div className="cart-item-details">
                <h4>{item.product}</h4>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Subtotal: ${item.subtotal}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AllUsersCartPage;