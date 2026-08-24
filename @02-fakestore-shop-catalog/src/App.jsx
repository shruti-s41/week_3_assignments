import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getData() {
      try {
        const productsRes = await fetch("https://fakestoreapi.com/products");
        const categoriesRes = await fetch(
          "https://fakestoreapi.com/products/categories"
        );

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error("Failed to load products");
        }

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);

  function addToCart(product) {
    const found = cart.find((item) => item.id === product.id);

    if (found) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }

  function increase(id) {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decrease(id) {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  let filteredProducts = products;

  if (category !== "all") {
    filteredProducts = products.filter(
      (product) => product.category === category
    );
  }

  filteredProducts = [...filteredProducts];

  if (sort === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (sort === "rating") {
    filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (loading) {
    return <h2 className="message">Loading...</h2>;
  }

  if (error) {
    return <h2 className="message">{error}</h2>;
  }

  return (
    <div>
      <header>
        <h1>FakeStore</h1>

        <div className="cart">
          🛒 Cart: {cartCount}
        </div>
      </header>

      <main>
        <div className="controls">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>

            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="low">Price Low to High</option>
            <option value="high">Price High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        <div className="products">
          {filteredProducts.map((product) => (
            <div className="card" key={product.id}>
              <img src={product.image} alt={product.title} />

              <h3>{product.title}</h3>

              <p>${product.price}</p>

              <small>
                ⭐ {product.rating.rate}
              </small>

              <button onClick={() => addToCart(product)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <section className="cart-section">
          <h2>Cart</h2>

          {cart.length === 0 && <p>Your cart is empty</p>}

          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <span>{item.title}</span>

              <div>
                <button onClick={() => decrease(item.id)}>
                  -
                </button>

                <span> {item.quantity} </span>

                <button onClick={() => increase(item.id)}>
                  +
                </button>
              </div>

              <strong>
                ${(item.price * item.quantity).toFixed(2)}
              </strong>
            </div>
          ))}

          <h3>Total: ${cartTotal.toFixed(2)}</h3>
        </section>
      </main>
    </div>
  );
}

export default App;