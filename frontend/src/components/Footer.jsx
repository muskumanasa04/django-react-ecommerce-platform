import '../styles/Footer.css';

const Footer = () => (
    <footer className="footer">
        <div className="footer-grid">
            <div className="footer-column">
                <h3>E-Mart</h3>
                <p>Your one-stop shop for the latest in mobile, laptop, and accessory technology.</p>
            </div>
            <div className="footer-column">
                <h4>Quick Links</h4>
                <ul>
                    <li>Privacy Policy</li>
                    <li>Terms of Service</li>
                    <li>Return Policy</li>
                    <li>Shipping Info</li>
                </ul>
            </div>
            <div className="footer-column">
                <h4>Contact Us</h4>
                <p>Email: support@emart.com</p>
                <p>Phone: +1 (555) 000-1234</p>
                <p>Address: 123 Tech Lane, Silicon Valley, CA</p>
            </div>
            <div className="footer-column">
                <h4>Newsletter</h4>
                <p>Subscribe to get special offers and tech updates.</p>
                <input type="email" placeholder="Enter your email" className="footer-input" />
                <button className="footer-btn">Subscribe</button>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; 2026 E-Mart Electronics. All rights reserved.</p>
        </div>
    </footer>
);

export default Footer;