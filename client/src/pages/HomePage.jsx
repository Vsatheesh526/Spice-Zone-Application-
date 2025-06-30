import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import api from "../api";
import UserInfo from "../pages/UserInfo";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CitiesSection from "../components/CitiesSection";

// Menu categories
const menuCategories = [
  {
    name: "Indian Tiffins",
    image: "https://stunningplans.com/wp-content/uploads/2020/02/south-indian-tiffin-recipes-best-of-south-indian-breakfast-thali-healthy-tiffin-recipes-of-south-indian-tiffin-recipes.jpg",
    description: "Find Indian Tiffin stock images in HD and millions of other royalty-free stock photos.",
    button: ""
  },
  {
    name: "Blended Spices",
    image: "https://www.thespruceeats.com/thmb/qbqn0_YHPSUPpXdVdy4xy1pYDeg=/2000x1333/filters:fill(auto,1)/thanksgiving-dinner-dishes-836012728-5bdda2e6c9e77c00262539e0.jpg",
    description: "Here are the 20 Most Popular adjectives for dinner: Appetizing: Whets the appetite.",
    button: ""
  },
  {
    name: "Organic Spices",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    description: "Healthy and pesticide-free spices.",
    button: ""
  },
  {
    name: "Spice Kits",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    description: "Complete kits for specific cuisines.",
    button: ""
  },
  {
    name: "Spice Accessories",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    description: "Tools and containers for spice storage.",
    button: ""
  }
];



// Navbar component



const MainNavbar = ({ cartCount, onLogout, onOpenCart, onOpenProfile, onShowOrders, searchTerm, setSearchTerm }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="main-navbar">
        <div className="main-navbar-group main-navbar-left">
          <img
            src="https://cdnl.iconscout.com/lottie/premium/thumb/fire-6279885-5219743.gif"
            alt="SpiceZone Logo"
            className="main-navbar-logo"
          />
          <span className="main-navbar-title">SpiceZone</span>
          
          {/* Hamburger menu for mobile */}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          
          <ul className={`main-navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <li><a href="#home">Home</a></li>
            <li><a href="#menu">Menu</a></li>
            <li>
              <a
                href="#orders"
                onClick={e => {
                  e.preventDefault();
                  onShowOrders();
                  setMobileMenuOpen(false);
                }}
              >MyOrders</a>
            </li>
            <li><a href="#offers">Offers</a></li>
            <li><a href="#support" onClick={e => {
              e.preventDefault();
              const footer = document.querySelector('.main-homepage-footer');
              if (footer) {
                footer.scrollIntoView({ behavior: 'smooth' });
                footer.classList.add('footer-highlight');
                setTimeout(() => footer.classList.remove('footer-highlight'), 1200);
              }
              setMobileMenuOpen(false);
            }}>Support</a></li>
          </ul>
        </div>
        
        <div className="main-navbar-group main-navbar-center">
          <input
            type="text"
            className="main-navbar-search"
            placeholder="Search spices, products...                              🔍"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="main-navbar-group main-navbar-right">
          <button className="main-navbar-cart-btn" onClick={onOpenCart}>
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="Profile" onClick={onOpenProfile}>👤</button>
          <button className="main-logout-nav-btn" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      {/* Mobile bottom bar - only visible on mobile */}
      <div className="mobile-bottom-bar">
        <button className="mobile-bottom-btn" onClick={onOpenCart}>
          🛒
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
        <button className="mobile-bottom-btn" onClick={onOpenProfile}>👤 Profile</button>
        <button className="mobile-bottom-btn logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </>
  );
};

// Main HomePage component
const HomePage = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [products, setProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState({ name: '', email: '', image: '' });

  // Fetch user info from localStorage on modal open
  useEffect(() => {
    if (showProfile) {
      const userName = localStorage.getItem('userName') || '';
      const userEmail = localStorage.getItem('userEmail') || '';
      let profileImageUrl = localStorage.getItem('profileImageUrl') || '';
      // If the image URL is a relative path, prepend the server address
      if (profileImageUrl && profileImageUrl.startsWith('/uploads/')) {
        profileImageUrl = 'http://localhost:5000' + profileImageUrl;
      }
      setProfile({ name: userName, email: userEmail, image: profileImageUrl });
    }
  }, [showProfile]);

  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [userOrders, setUserOrders] = useState([]);

  const fetchUserOrders = async () => {
    const userEmail = localStorage.getItem("userEmail") || profile.email;
    const res = await api.get(`/orders?user=${encodeURIComponent(userEmail)}`);
    setUserOrders(res.data);
  };

  // Poll for order status updates every 5 seconds while the orders modal is open
  useEffect(() => {
    let interval;
    if (showOrdersModal) {
      fetchUserOrders(); // Fetch immediately when modal opens
      interval = setInterval(fetchUserOrders, 5000);
    }
    return () => clearInterval(interval);
  }, [showOrdersModal]);

  const [orderCount, setOrderCount] = useState(0);
   const fetchProfile = async () => {
    const res = await api.get("/user/profile?userId=guest");
    if (res.data && res.data.profile) setProfile(res.data.profile);
    setOrderCount(res.data.orderCount || 0);
  };
  useEffect(() => {
    if (showProfile) fetchProfile();
  }, [showProfile]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };



const handleProfileSave = async () => {
  await api.post("/user/profile", {
    userId: "guest", // or the logged-in user's ID
    name: profile.name,
    email: profile.email,
    address: profile.address,
    image: profile.image
  });
  alert("Profile updated!");
  setShowProfile(false);
};

  const handleProfileDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      await api.delete("/user/profile?userId=guest");
      alert("Profile deleted!");
      setShowProfile(false);
    }
  };

  // Fetch products from backend
  useEffect(() => {
    api.get("/products").then(res => {
      setProducts(res.data);
      // Initialize quantities for each product
      const initialQuantities = {};
      res.data.forEach(product => {
        initialQuantities[product.name] = 1;
      });
      setProductQuantities(initialQuantities);
    });
  }, []);



    const handleOrder = async () => {
    if (cart.length === 0) return;
    const userEmail = localStorage.getItem("userEmail") || profile.email;
    await api.post("/orders", {
      user: userEmail,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
      status: "Pending",
      date: new Date()
    });
    alert("Order placed successfully!");
    setCart([]); // Clear cart after order
    setShowCart(false);
    };


    
    



  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  
  const handleAddToCart = async (product) => {
    const quantity = productQuantities[product.name] || 1;
    const existingItem = cart.find(item => item.name === product.name);
    let newCart;
    if (existingItem) {
      newCart = cart.map(item =>
        item.name === product.name ? { ...item, qty: item.qty + quantity } : item
      );
    } else {
      newCart = [...cart, { ...product, qty: quantity }];
    }
    setCart(newCart);
  
    // Save to MongoDB (replace "guest" with real user id if you have auth)
    await api.post("/cart", {
      userId: "guest",
      cart: newCart
    });
  };

  
  useEffect(() => {
    api.get("/cart?userId=guest").then(res => {
      if (res.data && res.data.cart) setCart(res.data.cart);
    });
  }, []);

   const handleRemoveFromCart = async (productName) => {
    const newCart = cart.filter(item => item.name !== productName);
    setCart(newCart);
  
    // Update cart in MongoDB
    await api.post("/cart", {
      userId: "guest", // or your real user id
      cart: newCart

    });
  };

  const increaseQuantity = (productName) => {
    setProductQuantities({
      ...productQuantities,
      [productName]: (productQuantities[productName] || 1) + 1
    });
  };

  const decreaseQuantity = (productName) => {
    if (productQuantities[productName] > 1) {
      setProductQuantities({
        ...productQuantities,
        [productName]: productQuantities[productName] - 1
      });
    }
  };
  const [offers, setOffers] = useState([]);
    useEffect(() => {
    api.get("/offers").then(res => setOffers(res.data));
  }, []);

  // New state for search term
  const [searchTerm, setSearchTerm] = useState("");

  // Filter and sort products by search term
  const filteredProducts = products
    .slice()
    .sort((a, b) => {
      if (!searchTerm) return 0;
      const aMatch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
      const bMatch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    })
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div id="home">
      <MainNavbar
        cartCount={cart.length}
        onLogout={handleLogout}
        onOpenCart={() => setShowCart(true)}
        onOpenProfile={() => setShowProfile(true)}
        onShowOrders={() => {
    fetchUserOrders();
    setShowOrdersModal(true);
  }}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <div style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
        <h1 style={{
          color:"#ede7e3"
        }}>✨Welcome to <span className="main-brand-name">SpiceZone</span>!</h1>
        <p className="homepara">Discover a rich variety of premium spices handpicked for authentic flavors.
          From traditional masalas to organic blends — spice up your meals effortlessly.
          Browse, explore, and add your favorites to the cart today!
        </p>
      </div>

      <div className="main-homepage-products">
        <div className="main-product-list">
          {filteredProducts.length === 0 ? (
            <p>No products available.</p>
          ) : (
            filteredProducts.map((product, index) => (
              <div key={index} className="main-product-card">
                <img src={product.image} alt={product.name} className="main-product-image" />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>₹{product.price}</p>
                <div className="quantity-selector">
                  <div className="quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => decreaseQuantity(product.name)}
                    >
                    -
                  </button>
                  <span className="quantity-value">{productQuantities[product.name] || 1}</span>
                 
                  <button
                    className="quantity-btn"
                    onClick={() => increaseQuantity(product.name)}
                  >
                    +
                  </button>
                </div>
                  
               
               
                  <button
                    className="main-add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="main-homepage-menu" id="menu">
        <h2>Menu Categories</h2>
        <button className="menu-scroll-btn left" onClick={() => {
          document.querySelector('.main-menu-list').scrollBy({ left: -300, behavior: 'smooth' });
        }}>&lt;</button>
        <button className="menu-scroll-btn right" onClick={() => {
          document.querySelector('.main-menu-list').scrollBy({ left: 300, behavior: 'smooth' });
        }}>&gt;</button>
        <div className="main-menu-list">
          {menuCategories.map((cat, idx) => (
            <div className="main-menu-item" key={idx}>
              <img src={cat.image} alt={cat.name} className="main-menu-img" />
              <div className="main-menu-info">
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
                <button className="main-menu-btn">{cat.button}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
<h1 style={{ textAlign: 'center', margin: '20px 0', fontWeight: 'bold', fontSize: '2.5em' }}>
  <span style={{ color: '#BFD7EA' }}>🔥 OFFERES</span>
  
</h1>
 <hr style={{ width: '80%', border: '2px solid #CC3042', margin: '0px auto' }} />



{offers.length > 0 && (
  <div className="offer-maim">
    <div className="main-homepage-offer-banners offer-sprinkle-bg" id="offers">
      <div className="offer-scroll-wrapper">
        {offers.map((offer, idx) => (
          <div key={idx} className="main-homepage-offer-banner">
            <div className="offer-banner-img">
              <img src={offer.image} alt="Offer" />
           
              <div className="offer-banner-title">
                <span className="offer-food-label">{offer.label}</span>
                <div className="offer-banner-main">{offer.mainText}</div>
                <div className="offer-banner-sub">{offer.subText}</div>
                              <button className="offer-banner-btn" onClick={() => {
                // Add offer to cart with specific money (offer.price or a default value)
                const offerProduct = {
                  name: offer.label || offer.mainText || `Offer ${idx + 1}`,
                  price: offer.price || 99, // Use offer.price if available, else default 99
                  image: offer.image,
                  qty: 1,
                  description: offer.subText || offer.mainText || 'Special offer'
                };
                handleAddToCart(offerProduct);
                alert('Offer added to cart!');
              }}>
                {offer.buttonText || 'Order Now'}
              </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="offer-left"></div>
  </div>
)}



      {/* --- Cities Section --- */}
      <CitiesSection />

      {showCart && (
        <div className="cart-modal-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-modal" onClick={e => e.stopPropagation()}>
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul className="cart-list">
                {cart.map((item, idx) => (
                  <li key={idx} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div>
                      <strong>{item.name}</strong>
                      <div>Qty: {item.qty}</div>
                      <div>Price: {item.price}</div>
                    </div>
                    <button className="cart-remove-btn" onClick={() => handleRemoveFromCart(item.name)}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
                        <button className="cart-order-btn" disabled={cart.length === 0} onClick={handleOrder}>
              Proceed to Order
            </button>
            <button className="cart-close-btn" onClick={() => setShowCart(false)}>Close</button>
          </div>
        </div>
      )}




            
      
      {showProfile && (
  <div className="profile-overlay" onClick={() => setShowProfile(false)}>
    <div className="profile-card" onClick={(e) => e.stopPropagation()}>
      <h2>Profile</h2>
      <div style={{ marginBottom: 16, textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <img
            src={profile.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.name)}
            alt="Profile"
            style={{ width: 80, height: 80, borderRadius: '', objectFit: 'cover', marginRight: 16 }}
          />
          <div>
            <div style={{ marginBottom: 8 }}><strong>Name:</strong> {profile.name}</div>
            <div style={{ marginBottom: 8 }}><strong>Email:</strong> {profile.email}</div>
          </div>
        </div>
      </div>
      <div className="profile-btn-group">
        <button onClick={() => setShowProfile(false)} style={{ background: 'red', color: '#333', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 600 }}>Close</button>
      </div>
    </div>
  </div>
)}

{showOrdersModal && (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <div style={{
      background: '#fff', borderRadius: 12, width: '90vw', maxWidth: 900, minHeight: 500, maxHeight: '90vh',
      overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', position: 'relative', padding: 32
    }}
      onClick={e => e.stopPropagation()}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Your Orders</h2>
      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <button onClick={() => {
          const doc = new jsPDF();
          doc.text("My Orders", 14, 16);
          autoTable(doc, {
            head: [["Date", "Status", "Total", "Items"]],
            body: userOrders.slice().reverse().map(order => [
              order.date ? new Date(order.date).toLocaleString() : 'N/A',
              order.status,
              typeof order.total === 'number' ? `₹${order.total.toLocaleString()}` : `₹${parseFloat(order.total || 0).toLocaleString()}`,
              order.items.map(item => `${item.name} x ${item.qty}`).join(", ")
            ]),
            startY: 22,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [0, 123, 255] }
          });
          doc.save("my-orders.pdf");
        }} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Download as PDF</button>
      </div>
      {userOrders.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No orders found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f9f9f9' }}>
          <thead>
            <tr style={{ background: '#007bff', color: '#fff' }}>
              <th style={{ padding: 12, border: '1px solid #e0e0e0' }}>Date</th>
              <th style={{ padding: 12, border: '1px solid #e0e0e0' }}>Status</th>
              <th style={{ padding: 12, border: '1px solid #e0e0e0' }}>Total</th>
              <th style={{ padding: 12, border: '1px solid #e0e0e0' }}>Items</th>
            </tr>
          </thead>
          <tbody>
            {userOrders.slice().reverse().map((order, idx) => (
              <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#f3f7fa' }}>
                <td style={{ padding: 10, border: '1px solid #e0e0e0' }}>{order.date ? new Date(order.date).toLocaleString() : 'N/A'}</td>
                <td style={{ padding: 10, border: '1px solid #e0e0e0' }}>{order.status}</td>
                <td style={{ padding: 10, border: '1px solid #e0e0e0' }}>₹{typeof order.total === 'number' ? order.total.toLocaleString() : parseFloat(order.total || 0).toLocaleString()}</td>
                <td style={{ padding: 10, border: '1px solid #e0e0e0' }}>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {order.items.map((item, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>{item.name} x {item.qty}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button onClick={() => setShowOrdersModal(false)} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 28px', fontWeight: 600, fontSize: 18, cursor: 'pointer' }}>Close</button>
      </div>
    </div>
  </div>
)}

      {/* App Download Block - wrapped in a div for valid JSX */}
      <div
        className="appavilable"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 0",
          background: "#2a9d8f"
        }}
      >
        <div
          className="appcontiner"
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "40px",
            alignItems: "center",
            textAlign: "center",
            backgroundColor: "#fff",
            padding: "40px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <div>
            <h1>Download the app now!</h1>
            <h3 style={{ fontSize: "20px", marginBottom: "20px", color: "#333" }}>Experience seamless and convenient online ordering with just a few taps — exclusively on the Spicezone app. Enjoy fast, reliable service and explore a wide variety of delicious options delivered right to your door.</h3>
            <div className="app-icons" style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
              <a
                href="https://play.google.com/store/apps/details?id=com.spicezone"
                target="_blank"
                rel="noopener noreferrer"
                style={{ transition: "transform 0.3s" }}
                onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                <img
                  src="https://logos-world.net/wp-content/uploads/2020/11/Google-Play-Logo-2012-2015.png"
                  alt="Google Play Store"
                  style={{ height: "60px" }}
                />
              </a>
              <a
                href="https://apps.apple.com/app/spicezone/id1234567890"
                target="_blank"
                rel="noopener noreferrer"
                style={{ transition: "transform 0.3s" }}
                onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={e => (e.currentTarget.style.transform = "scale(1)" )}
              >
                <img
                  src="https://static.vecteezy.com/system/resources/previews/002/520/835/original/download-application-button-apple-app-store-free-vector.jpg"
                  alt="Apple App Store"
                  style={{ height: "60px", borderRadius: "10px" }}
                />
              </a>
            </div>
          </div>
          <div className="appqrcode" style={{ textAlign: "center" }}>
            <img
              src="https://clipground.com/images/qr-code-sample-png-3.png"
              alt="QR Code"
              style={{
                border: "2px dashed #ccc",
                borderRadius: "10px",
                padding: "10px",
                transition: "transform 0.3s",
                width: "200px",
              }}
              onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
            />
            <p style={{ marginTop: "10px", color: "#666" }}>Scan to download</p>
          </div>
        </div>
      </div>


      <div className="main-homepage-footer" id="support">
        <p>&copy; 2023 SpiceZone. All rights reserved.</p>
        <p>
          <Link to="/privacy-policy">Privacy Policy</Link> | <Link to="/terms-of-service">Terms of Service</Link>
        </p>
      </div>
    </div>
  );
};

export default HomePage;

