import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AuthPages.css";
import img1 from "../assets/bg-image.jpg";


const products = [
  { name: "Garam Masala", price: "₹120", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
  { name: "Turmeric Powder", price: "₹80", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
  { name: "Red Chilli", price: "₹90", image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80" },
    { name: "Garam Masala", price: "₹120", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
  { name: "Turmeric Powder", price: "₹80", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
  { name: "Red Chilli", price: "₹90", image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80" },
    { name: "Garam Masala", price: "₹120", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
  { name: "Turmeric Powder", price: "₹80", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" }
 
];

const services = [
  { title: "Fast Delivery", desc: "Get your spices delivered quickly and safely.", icon: "🚚" },
  { title: "Quality Guarantee", desc: "Only the freshest and best quality products.", icon: "✅" },
  { title: "24/7 Support", desc: "We are here to help you anytime.", icon: "📞" }
];

const reviews = [
  { name: "Amit", img: "https://randomuser.me/api/portraits/men/32.jpg", review: "The spices are so fresh and flavorful! Highly recommend." },
  { name: "Priya", img: "https://randomuser.me/api/portraits/women/44.jpg", review: "Loved the packaging and quick delivery. Will order again!" },
  { name: "Rahul", img: "https://randomuser.me/api/portraits/men/65.jpg", review: "Great customer service and amazing products." }
];

const Navbar = ({ onLoginClick }) => (
  <nav className="navbar">
    <div className="navbar-section navbar-left">
      <img
        src="https://cdnl.iconscout.com/lottie/premium/thumb/fire-6279885-5219743.gif"
        alt="Logo"
        className="navbar-logo"
      />
      <span className="navbar-title">SpiceZone</span>
    </div>
    <ul className="navbar-section navbar-center">
      <li><Link to="/">Home</Link></li>
      <li><a href="#services">Services</a></li>
      <li><a href="#reviews">Customer Review</a></li>
      <li><a href="#about">About</a></li>
    </ul>
    <div className="navbar-section navbar-right">
      <button className="login-nav-btn" onClick={onLoginClick}>Login</button>
    </div>
  </nav>
);

const LoginPage = ({setIsLoggedIn}) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [loginClosed, setLoginClosed] = useState(false);
  const [loading, setLoading] = useState(true); // loading state
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading for 1.2s, or until all data is loaded
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

   const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Login successful!");
      localStorage.setItem("userEmail", form.email);
      // Save userName if available in response
      if (data.name) localStorage.setItem("userName", data.name);
      if (data.token) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        navigate("/home");
      } else {
        setMessage("Login failed: No token received");
      }
    } else {
      setMessage(data.error || "Login failed");
    }
  } catch (err) {
    setMessage("Login failed");
  }
};

  const handleClose = () => {
    setLoginClosed(true);
  };

  const handleLoginNavClick = () => {
    setLoginClosed(false);
    setShowLogin(true);
  };

  return (
    <div>
      {loading ? (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
          <div className="loader" style={{ border: '6px solid #f3f3f3', borderTop: '6px solid #007bff', borderRadius: '50%', width: 60, height: 60, animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          <Navbar onLoginClick={handleLoginNavClick} />
          <div className="homepage">
            {/* Background Video */}
            <div className="bg-image">
              <img src={img1} alt="" className="bg-img" />
            </div>
            {/* Overlay Content */}
            <div className="homepage-content">
              {/* Welcome Heading */}
              <header className="welcome-header">
                <h1>Welcome to <span className="brand-name">SpiceZone</span>!</h1>
                <p>Discover the finest spices for your kitchen.SpiceZone is your one-stop shop for the freshest, highest-quality spices delivered right to your door.</p>
              </header>
              {/* Products */}
              <section className="products-section" id="products">
                <div className="products-list">
                  {products.map((p, i) => (
                    <div className="product-card" key={i}>
                      <img src={p.image} alt={p.name} />
                      <h3>{p.name}</h3>
                      <p className="product-price">{p.price}</p>
                    </div>
                  ))}
                </div>
              </section>
              {/* Services */}
              <section className="services-section" id="services">
                <h2 className="services-title">Our Services</h2>
                <div className="services-list">
                  {services.map((s, i) => (
                    <div className="service-card" key={i}>
                      <div className="service-icon">{s.icon}</div>
                      <h3>{s.title}</h3>
                      <p>{s.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
              {/* Customer Reviews */}
              <section className="reviews-section" id="reviews">
                <h2 className="services-title">Customer Reviews</h2>
                <div className="reviews-list">
                  {reviews.map((r, i) => (
                    <div className="review-card" key={i}>
                      <div>
                        <img src={r.img} alt={r.name} className="review-img" />
                        <h4><u>{r.name}</u></h4>
                      </div>
                      <div>
                        <p className="review-text">Rating: ⭐⭐⭐⭐⭐</p>
                        <p>"{r.review}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              {/* About */}
              <section className="about-section" id="about">
                <h2>About SpiceZone</h2>
                <hr className="hr"/>
                <p>
                  SpiceZone is your one-stop shop for the freshest, highest-quality spices delivered right to your door.
                  Our mission is to bring authentic flavors to your kitchen and make every meal memorable! Explore our wide range of handpicked spices and elevate your cooking experience every day.
                </p>
                <div>
                  <ul style={{ textAlign:"left", listStyle:"circle" }}>
                    <li>Contact: +91 9876541234</li>
                    <li>Email: helpspicezone@gmail.com</li>
                  </ul>
                  <ul style={{ display:"flex", gap:"10px", listStyle:"none" }}>
                    <li style={{ border:"1.5px solid white", padding:"5px" }}><a href="#linkdin" style={{ textDecoration:"none" }}>linkdin</a></li>
                    <li style={{ border:"1.5px solid white", padding:"5px", color:"white" }}><a href="#insta" style={{ textDecoration:"none" }}>Instagram</a></li>
                  </ul>
                </div>
              </section>
            </div>
            <div className="center-container">
              {showLogin && !loginClosed && (
                <div className="auth-container" style={{ position: "relative" }}>
                  <button
                    className="close-btn"
                    onClick={handleClose}
                    title="Close"
                    style={{ position: "absolute", top: 8, right: 8, background: "transparent", border: "none", fontSize: 20, cursor: "pointer" }}
                  >
                    ×
                  </button>
                  <h2><u>Login</u></h2>
                  <form className="auth-form" onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                    />
                    <label>Password:</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      required
                    />
                    <button type="submit">Login</button>
                  </form>
                  {message && <p className="auth-message">{message}</p>}
                  <p className="auth-link">
                    No account? <Link to="/signup">Go to Signup</Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginPage;