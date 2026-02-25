import React from "react";
import API from "../services/api";
import "../styles/ProductCard.css";

const ProductCard = ({ product, onViewDescription }) => {

  const handleAddToCart = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      alert("Please login first");
      return;
    }
    try {
      await API.post(
        "cart/add/",
        { product_id: product.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to Cart ");
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Error adding to cart");
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img src={product.image || "https://via.placeholder.com/150"} alt={product.name} />
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">${product.price}</p>

        <button className="description-btn" onClick={onViewDescription}>
          View Description
        </button>

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;