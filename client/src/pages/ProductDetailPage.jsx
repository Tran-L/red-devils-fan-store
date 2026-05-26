import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const ProductDetailPage = () => {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/products/${id}`);
                setProduct(response.data.product);
            } catch (error) {
                setError(error.response?.data?.message || "Unable to load product.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            setFeedback("Please login before adding products to cart.");
            return;
        }

        try {
            await api.post("/cart", {
                productId: product.id,
                quantity
            });

            setFeedback("Product added to cart successfully.");
        } catch (error) {
            setFeedback(error.response?.data?.message || "Unable to add product to cart.");
        }
    };

    if (loading) {
        return (
            <main className="page">
                <div className="status-card">Loading product...</div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="page">
                <div className="alert alert-error">{error}</div>
                <Link to="/products" className="btn btn-outline back-link">
                    <ArrowLeft size={18} />
                    Back to shop
                </Link>
            </main>
        );
    }

    return (
        <main className="page">
            <Link to="/products" className="back-link">
                <ArrowLeft size={18} />
                Back to products
            </Link>

            <section className="product-detail">
                <div className="product-detail-image">
                    <img src={product.imageUrl} alt={product.name} />
                </div>

                <div className="product-detail-info">
                    <p className="eyebrow">{product.category}</p>
                    <h1>{product.name}</h1>
                    <p className="product-detail-description">{product.description}</p>

                    <div className="detail-price-row">
                        <strong>${product.price.toFixed(2)}</strong>
                        <span className={product.stock > 0 ? "stock-pill" : "stock-pill danger"}>
                            {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                        </span>
                    </div>

                    <div className="quantity-row">
                        <label htmlFor="quantity">Quantity</label>
                        <input
                            id="quantity"
                            type="number"
                            min="1"
                            max={product.stock}
                            value={quantity}
                            onChange={(event) => setQuantity(Number(event.target.value))}
                        />
                    </div>

                    <button
                        className="btn btn-primary detail-add-btn"
                        disabled={product.stock <= 0}
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart size={18} />
                        Add to cart
                    </button>

                    {feedback && <div className="alert alert-info">{feedback}</div>}
                </div>
            </section>
        </main>
    );
};

export default ProductDetailPage;