import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExpensive, setShowExpensive] = useState(false);
  const [cart, setCart] = useState(() => {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  }
  return [];
});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://dummyjson.com/products");
        setProducts(res.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    fetchProducts();
  }, [cart]);
  
  const removeFromCart = (id) => {
  setCart(cart.filter(item => item.id !== id));
};

  const filteredProducts = showExpensive
    ? products.filter((product) => product.price > 100)
    : products;


  const addToCart = (product) => {
    // Prevent duplicates
    if (!cart.find(item => item.id === product.id)) {
      setCart([...cart, product]);
    }
  };
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  const handleCheckout = () => {
  alert("Order placed successfully!");
  setCart([]);
};

  if (loading) return <p>Loading...</p>;
return (
  <div className="container">
    <p>Cart Items: {cart.length}</p>
    <p>Total: ${totalPrice.toFixed(2)}</p>

    <button onClick={() => setShowExpensive(!showExpensive)}>
      {showExpensive ? "Show All" : "Show Expensive"}
    </button>

    <div className="products">
      {filteredProducts.map((item) => (
        <div key={item.id} className="card">
          <img src={item.thumbnail} />
          <p>{item.title}</p>
          <p>${item.price}</p>
          <button onClick={() => addToCart(item)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>

    {/* 👇 MOVE CART HERE */}
    <h2>🛒 Cart</h2>

{cart.length === 0 ? (
  <p>Your cart is empty</p>
) : (
  <>
    {cart.map((item) => (
      <div key={item.id} className="card">
        <p>{item.title}</p>
        <p>${item.price}</p>
        <button onClick={() => removeFromCart(item.id)}>
          Remove
        </button>
      </div>
    ))}

    <h3>Total: ${totalPrice.toFixed(2)}</h3>

    <button onClick={handleCheckout}>
      Checkout
    </button>
  </>
)}
  </div>
);
}

export default App;