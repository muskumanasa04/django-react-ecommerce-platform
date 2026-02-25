import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import '../styles/Navbar.css';


const Navbar = () => {
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  useEffect(() => {
    if (token) {
      fetchCartCount();
    }
  }, []);

  const fetchCartCount = async () => {
    try {
      const res = await API.get("cart/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const total = res.data.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      setTotalItems(total);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/home" className="nav-logo">
        <h2>E-Mart</h2>
      </Link>

      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/categories">Categories</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/track-order">Track Order</Link></li>   {/* new link */}
        <li><Link to="/contact">Contact</Link></li>
                   {/* new link */}
      </ul>

      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/cart" className="cart-btn">
          Cart ({totalItems})
        </Link>

        {token ? (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        ) : (
          <Link to="/" className="login-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;