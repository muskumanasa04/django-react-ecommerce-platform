import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Show the success popup
    setShowPopup(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => {
      setShowPopup(false);
    }, 4000);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", position: "relative" }}>
      
      {/* SUCCESS POPUP */}
      {showPopup && (
        <div style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "15px 30px",
          borderRadius: "5px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          zIndex: 1000,
          fontWeight: "bold"
        }}>
           Message successfully submitted!
        </div>
      )}

      <h2 style={{ textAlign: "center" }}>Contact Us</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ padding: "10px", width: "100%", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ padding: "10px", width: "100%", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Message</label>
          <textarea
            rows="5"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            style={{ padding: "10px", width: "100%", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
            required
          />
        </div>

        <button 
          type="submit" 
          style={{ 
            padding: "12px 24px", 
            width: "100%", 
            backgroundColor: "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;