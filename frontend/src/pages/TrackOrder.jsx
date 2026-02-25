import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [inputValue, setInputValue] = useState(""); // For the manual search box
  
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);

  // 1. Fetch Order Data (Only runs if orderId exists)
  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      setError("");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/track-order/${orderId}/`);
        setOrder(res.data);
        setError("");
      } catch (err) {
        setOrder(null);
        setError("Order not found. Please check the ID.");
      }
    };

    fetchOrder();
  }, [orderId]);

  // 2. Initialize Map
  useEffect(() => {
    if (order && mapRef.current && !leafletMapRef.current) {
      const lat = order.latitude || 28.6139;
      const lng = order.longitude || 77.2090;

      leafletMapRef.current = L.map(mapRef.current).setView([lat, lng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(leafletMapRef.current);
      L.marker([lat, lng]).addTo(leafletMapRef.current).bindPopup(`Order #${orderId}`).openPopup();
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [order]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      navigate(`/track-order/${inputValue.trim()}`);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", textAlign: "center" }}>
      <h2>Track Your Order</h2>
      
      {/* Search Box: Always visible so user can track a different order */}
      <form onSubmit={handleSearch} style={{ marginBottom: "30px" }}>
        <input 
          type="text" 
          placeholder="Enter Order ID (e.g. 101)" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ padding: "10px", width: "200px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "10px 20px", marginLeft: "10px", cursor: "pointer" }}>
          Track
        </button>
      </form>

      <hr />

      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}

      {!orderId && !error && (
        <p style={{ marginTop: "20px", color: "#666" }}>
          Please enter an Order ID above to see live tracking.
        </p>
      )}

      {order && (
        <div style={{ marginTop: "30px", textAlign: "left", border: "1px solid #ddd", padding: "20px" }}>
          <h3>Order Details</h3>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total Price:</strong> ${order.total_price}</p>
          
          <div ref={mapRef} style={{ height: "400px", width: "100%", marginTop: "20px", background: "#f0f0f0" }}></div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;