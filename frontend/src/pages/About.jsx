import '../styles/About.css';


const About = () => (
    <div className="about-page">
        <div className="about-card">
            <div className="about-info">
                <h1 className="about-title">Our Story</h1>
                <p className="about-description">
                    Founded in 2024, <strong>E-Mart</strong> started with a simple mission: 
                    to make high-end technology accessible to everyone. What began as a 
                    small tech blog has grown into a leading destination for gadget enthusiasts.
                </p>
                
                <div className="about-points">
                    <h3>Why Choose Us?</h3>
                    <ul>
                        <li><strong>Quality First:</strong> Every product is tested for performance.</li>
                        <li><strong>Global Shipping:</strong> We deliver to over 50 countries.</li>
                        <li><strong>24/7 Support:</strong> Our tech experts are always a click away.</li>
                    </ul>
                </div>
            </div>


            <div className="about-visual">
                <img 
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop" 
                    alt="Our workspace" 
                />
            </div>
        </div>
    </div>
);
export default About;