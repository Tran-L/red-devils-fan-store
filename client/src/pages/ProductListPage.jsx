import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const ProductListPage = () => {
    const { isAuthenticated } = useAuth();

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const categories = useMemo(() => {
        return [...new Set(products.map((product) => product.category))];
    }, [products]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/products", {
                    params: {
                        search,
                        category
                    }
                });

                setProducts(response.data.products);
            } catch (error) {
                setError("Unable to load products. Please check that the backend is running.");
            } finally {
                setLoading(false);
            }
        };

        const delaySearch = setTimeout(fetchProducts, 300);

        return () => clearTimeout(delaySearch);
    }, [search, category]);

    const handleAddToCart = async (productId) => {
        if (!isAuthenticated) {
            alert("Please login before adding products to cart.");
            return;
        }

        try {
            await api.post("/cart", {
                productId,
                quantity: 1
            });

            alert("Product added to cart.");
        } catch (error) {
            alert(error.response?.data?.message || "Unable to add product to cart.");
        }
    };

    return (
        <main className="page">
            <section className="section-header shop-header">
                <div>
                    <p className="eyebrow">Shop merchandise</p>
                    <h1>Products</h1>
                    <p className="muted">
                        Browse football-inspired fan products from the SQLite database. Search and
                        filtering update without reloading the page.
                    </p>
                </div>
            </section>

            <section className="toolbar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="search"
                        placeholder="Search jerseys, scarves, hoodies..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>

                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                    <option value="">All categories</option>
                    {categories.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </section>

            {loading && <div className="status-card">Loading products...</div>}

            {error && <div className="alert alert-error">{error}</div>}

            {!loading && !error && products.length === 0 && (
                <div className="status-card">No products found. Try another search.</div>
            )}

            <section className="product-grid">
                {products.map((product) => (
                    <article className="product-card" key={product.id}>
                        <Link to={`/products/${product.id}`} className="product-image-wrap">
                            <img src={product.imageUrl} alt={product.name} className="product-image" />
                        </Link>

                        <div className="product-card-body">
                            <div className="product-meta">
                                <span>{product.category}</span>
                                <strong>${product.price.toFixed(2)}</strong>
                            </div>

                            <Link to={`/products/${product.id}`}>
                                <h2>{product.name}</h2>
                            </Link>

                            <p>{product.description}</p>

                            <div className="product-footer">
                                <span className={product.stock > 0 ? "stock-pill" : "stock-pill danger"}>
                                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                                </span>

                                <button
                                    className="btn btn-primary"
                                    disabled={product.stock <= 0}
                                    onClick={() => handleAddToCart(product.id)}
                                >
                                    <ShoppingCart size={17} />
                                    Add
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
};

export default ProductListPage;