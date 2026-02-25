import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import CartPage from './pages/CartPage';
import About from './pages/About';
import Login from './pages/Login';
import TrackOrder from './pages/TrackOrder';
import Contact from './pages/Contact';

import './styles/global.css';


/* ... imports ... */

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* 1. Absolute Top Level Routes */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />

            {/* 2. Main Site Wrapper */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <div className="main-content">
                    <Routes>
                      {/* Standard Pages */}
                      <Route path="home" element={<Home showSidebar={false} />} />
                      <Route path="categories" element={<Home showSidebar={true} />} />
                      <Route path="cart" element={<CartPage />} />
                      <Route path="about" element={<About />} />
                      <Route path="contact" element={<Contact />} />
                      
                      {/* FIX: Ensure this is reachable under the /* path */}
                      <Route path="track-order/:orderId?" element={<TrackOrder />} />
                      {/* Redirect unknown sub-paths to home */}
                      <Route path="*" element={<Navigate to="/home" />} />

                    </Routes>
                  </div>
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

 export default App;
