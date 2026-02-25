import React, { useState, useEffect } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import '../styles/Home.css';

const Home = ({ showSidebar }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // State for Popup/Modal
  const [activeProduct, setActiveProduct] = useState(null);

  useEffect(() => {
    API.get("categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    API.get("products/")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <>
      <div className="home-layout">
        {showSidebar && (
          <aside className="sidebar">
            <h3>Filter by Category</h3>
            <ul>
              <li 
                className={selectedCategory === "All" ? "active-li" : ""} 
                onClick={() => setSelectedCategory("All")}
              >
                All Products
              </li>
              {categories.map((cat) => (
                <li 
                  key={cat.id} 
                  className={selectedCategory === cat.id ? "active-li" : ""}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </aside>
        )}

        <div className="home-container">
          {/* HERO BANNER - Image Left, Matter Right */}
          <section className="hero-banner">
            <div className="hero-image">
              <img src="https://www.shutterstock.com/image-photo/create-banner-gadget-store-flat-260nw-2553356023.jpg" alt="Banner" />
            </div>
            <div className="hero-content">
              <div className="hero-text-wrapper">
                <h1>Upgrade Your Tech</h1>
                <p>Exclusive deals on the latest smartphones and gadgets.</p>
                <button className="shop-now-btn">Shop Now</button>
              </div>
            </div>
          </section>

          {/* PRODUCT DISPLAY */}
          <div className="all-categories-wrapper">
            {categories
              .filter((cat) => selectedCategory === "All" || selectedCategory === cat.id)
              .map((cat) => {
                const categoryProducts = filteredProducts.filter((p) => p.category === cat.id);
                if (categoryProducts.length === 0) return null;

                return (
                  <section key={cat.id} className="product-display">
                    <div className="section-header">
                      <h2 className="section-title">{cat.name}</h2>
                    </div>
                    <div className="product-grid">
                      {categoryProducts.map((item) => (
                        <ProductCard
                          key={item.id}
                          product={item}
                          onViewDescription={() => setActiveProduct(item)} 
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
          </div>
        </div>
      </div>


      {/* POPUP MODAL */}
      {activeProduct && (
        <div className="modal-overlay" onClick={() => setActiveProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setActiveProduct(null)}>&times;</button>
            <div className="modal-body">
              <img src={activeProduct.image} alt={activeProduct.name} />
              <div className="modal-info">
                <h2>{activeProduct.name}</h2>
                <p className="modal-price">${activeProduct.price}</p>
                <p>{activeProduct.description || "No description available."}</p>
                <button className="add-to-cart-modal">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;