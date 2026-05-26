import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import api from "../api/api";

const CartPage = () => {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState("");

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/cart");
            setCartItems(response.data.cartItems);
            setTotalAmount(response.data.totalAmount);
        } catch (error) {
            setError(error.response?.data?.message || "Unable to load cart.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (item, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            await api.put(`/cart/${item.id}`, {
                quantity: newQuantity
            });

            setFeedback("Cart updated.");
            fetchCart();
        } catch (error) {
            setFeedback(error.response?.data?.message || "Unable to update cart.");
        }
    };

    const removeItem = async (itemId) => {
        try {
            await api.delete(`/cart/${itemId}`);
            setFeedback("Item removed from cart.");
            fetchCart();
        } catch (error) {
            setFeedback(error.response?.data?.message || "Unable to remove item.");
        }
    };

    const clearCart = async () => {
        if (!window.confirm("Clear all items from your cart?")) return;

        try {
            await api.delete("/cart");
            setFeedback("Cart cleared.");
            fetchCart();
        } catch (error) {
            setFeedback(error.response?.data?.message || "Unable to clear cart.");
        }
    };

    if (loading) {
        return (
            <main className="page">
                <div className="status-card">Loading cart...</div>
            </main>
        );
    }

    return (
        <main className="page">
            <section className="section-header cart-header">
                <div>
                    <p className="eyebrow">Shopping cart</p>
                    <h1>Your cart</h1>
                    <p className="muted">
                        Review your selected items, update quantities, or proceed to checkout.
                    </p>
                </div>

                {cartItems.length > 0 && (
                    <button className="btn btn-outline" onClick={clearCart}>
                        Clear cart
                    </button>
                )}
            </section>

            {error && <div className="alert alert-error">{error}</div>}
            {feedback && <div className="alert alert-info">{feedback}</div>}

            {cartItems.length === 0 ? (
                <section className="empty-state">
                    <ShoppingBag size={44} />
                    <h2>Your cart is empty</h2>
                    <p>Start shopping and add some fan products to your cart.</p>
                    <Link to="/products" className="btn btn-primary">
                        Shop products
                    </Link>
                </section>
            ) : (
                <section className="cart-layout">
                    <div className="cart-list">
                        {cartItems.map((item) => (
                            <article className="cart-item" key={item.id}>
                                <img src={item.imageUrl} alt={item.productName} />

                                <div className="cart-item-info">
                                    <span>{item.category}</span>
                                    <h2>{item.productName}</h2>
                                    <p>${item.price.toFixed(2)} each</p>
                                    <small>{item.stock} available</small>
                                </div>

                                <div className="quantity-control">
                                    <button onClick={() => updateQuantity(item, item.quantity - 1)}>
                                        <Minus size={16} />
                                    </button>
                                    <strong>{item.quantity}</strong>
                                    <button onClick={() => updateQuantity(item, item.quantity + 1)}>
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <strong className="cart-subtotal">${item.subtotal.toFixed(2)}</strong>

                                <button className="icon-button danger" onClick={() => removeItem(item.id)}>
                                    <Trash2 size={18} />
                                </button>
                            </article>
                        ))}
                    </div>

                    <aside className="summary-card">
                        <h2>Order summary</h2>

                        <div className="summary-row">
                            <span>Items</span>
                            <strong>{cartItems.length}</strong>
                        </div>

                        <div className="summary-row total">
                            <span>Total</span>
                            <strong>${totalAmount.toFixed(2)}</strong>
                        </div>

                        <button className="btn btn-primary full-width" onClick={() => navigate("/checkout")}>
                            Continue to checkout
                        </button>
                    </aside>
                </section>
            )}
        </main>
    );
};

export default CartPage;