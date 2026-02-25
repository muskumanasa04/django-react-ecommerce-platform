import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/CartPage.css";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [invoice, setInvoice] = useState(null);

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");

  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get("cart/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateQuantity = async (id, change) => {
    const item = cart.find((i) => i.id === id);
    const newQty = item.quantity + change;
    if (newQty < 1) return; // prevent zero or negative

    await API.put(
      `cart/update/${id}/`,
      { quantity: newQty },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchCart();
  };

  const removeFromCart = async (id) => {
    await API.delete(`cart/delete/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchCart();
  };

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Handle form input
  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  // Handle Payment
  const handlePayment = async () => {
    // Validation
    if (!userDetails.name || !userDetails.email || !userDetails.address) {
      return alert("Please fill all your details!");
    }
    if (!paymentMethod) return alert("Please select a payment method!");

    try {
      // Simulate API call
      const response = await API.post(
        "order/place/",
        { userDetails, paymentMethod }, // you can send user details
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPaymentSuccess(true);
      setInvoice({
        ...response.data,
        user: userDetails,
        paymentMethod,
      });

      setCart([]); // clear cart visually
      alert("Payment Successful ✅\nOrder Placed!");
    } catch (error) {
      console.log(error);
      alert("Payment Failed");
    }
  };

  // Generate invoice
  const generateInvoice = () => {
    if (!invoice) return alert("No invoice to generate!");
    let text = `INVOICE\nOrder ID: ${invoice.id}\nName: ${invoice.user.name}\nEmail: ${invoice.user.email}\nAddress: ${invoice.user.address}\nPhone: ${invoice.user.phone}\nPayment Method: ${invoice.paymentMethod}\n\nItems:\n`;
    invoice.items?.forEach((item) => {
      text += `${item.product_name} x ${item.quantity} = $${item.price * item.quantity}\n`;
    });
    text += `\nTotal: $${invoice.total_price || totalAmount}`;
    alert(text);
  };

  return (
    <div className="cart-page-container">
      <h2>Your Shopping Cart</h2>

      {cart.length === 0 && !paymentSuccess ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-content">
          {!paymentSuccess && (
            <>
              {/* Cart Items */}
              <div className="cart-items-list">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item-card">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p>Price: ${item.price}</p>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                    </div>
                    <div>
                      <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                      <button onClick={() => removeFromCart(item.id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="cart-summary-section">
                <h3>Order Summary</h3>
                <p>Total Items: {cart.reduce((a, i) => a + i.quantity, 0)}</p>
                <p>Grand Total: ${totalAmount.toFixed(2)}</p>
              </div>

              {/* User Details Form */}
              <div className="user-details-form">
                <h3>Enter Your Details</h3>
                <input type="text" name="name" placeholder="Name" value={userDetails.name} onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" value={userDetails.email} onChange={handleChange} />
                <input type="text" name="address" placeholder="Address" value={userDetails.address} onChange={handleChange} />
                <input type="text" name="phone" placeholder="Phone" value={userDetails.phone} onChange={handleChange} />
              </div>

              
              {/* Payment Method Section */}
<div className="payment-method-section">
  <h3>Select Payment Method</h3>
  
  <label className="radio-label">
    <input type="radio" value="UPI" checked={paymentMethod === "UPI"} onChange={(e) => setPaymentMethod(e.target.value)} />
    UPI
  </label>
  {paymentMethod === "UPI" && (
    <input type="text" placeholder="Enter UPI ID (e.g. name@okaxis)" className="payment-extra-input" />
  )}

  <label className="radio-label">
    <input type="radio" value="Debit Card" checked={paymentMethod === "Debit Card"} onChange={(e) => setPaymentMethod(e.target.value)} />
    Debit Card
  </label>
  {paymentMethod === "Debit Card" && (
    <div className="card-details">
      <input type="text" placeholder="Card Number" className="payment-extra-input" />
      {/* <div className="card-row">
        <input type="text" placeholder="MM/YY" className="payment-extra-input small" />
        <input type="password" placeholder="CVV" className="payment-extra-input small" />
      </div> */}
    </div>
  )}

  <label className="radio-label">
    <input type="radio" value="Cash on Delivery" checked={paymentMethod === "Cash on Delivery"} onChange={(e) => setPaymentMethod(e.target.value)} />
    Cash on Delivery
  </label>
</div>

              {/* Payment Button */}
              <button onClick={handlePayment} className="pay-btn">Pay Now</button>
            </>
          )}

          {/* Payment Success & Invoice */}
          {paymentSuccess && invoice && (
            <div className="invoice-section">
              <h2>Payment Successful ✅</h2>
              <h3>Order Placed Successfully 🎉</h3>
              <div className="invoice-box">
                <p><strong>Order ID:</strong> {invoice.id}</p>
                <p><strong>Name:</strong> {invoice.user.name}</p>
                <p><strong>Email:</strong> {invoice.user.email}</p>
                <p><strong>Address:</strong> {invoice.user.address}</p>
                <p><strong>Phone:</strong> {invoice.user.phone}</p>
                <p><strong>Payment Method:</strong> {invoice.paymentMethod}</p>
                <p><strong>Total:</strong> ${invoice.total_price || totalAmount}</p>

                <h4>Items:</h4>
                {invoice.items?.map((item) => (
                  <div key={item.id}>
                    {item.product_name} × {item.quantity} = ${item.price * item.quantity}
                  </div>
                ))}

                <button onClick={generateInvoice} className="invoice-btn">Generate Invoice</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPage;
