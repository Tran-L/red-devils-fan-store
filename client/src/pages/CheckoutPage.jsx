import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

const CheckoutPage = () => {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [formData, setFormData] = useState({
        customerName: "Demo User",
        shippingAddress: "15 Broadway, Ultimo NSW 2007",
        paymentMethod: "Demo Card"
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await api.get("/cart");
                setCartItems(response.data.cartItems);
                setTotalAmount(response.data.totalAmount);
            } catch (error) {
                setError(error.response?.data?.message || "Unable to load checkout.");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleChange = (event) => {
        setFormData((current) => ({
            ...current,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const response = await api.post("/orders/checkout", formData);
            navigate(`/orders/${response.data.order.id}`);
        } catch (error) {
            setError(error.response?.data?.message || "Checkout failed.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main className="page">
                <div className="status-card">Loading checkout...</div>
            </main>
        );
    }

    if (cartItems.length === 0) {
        return (
            <main className="page">
                <section className="empty-state">
                    <h2>Your cart is empty</h2>
                    <p>Add products before checking out.</p>
                    <Link to="/products" className="btn btn-primary">
                        Shop products
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="page">
            <section className="section-header">
                <p className="eyebrow">Secure checkout</p>
                <h1>Checkout</h1>
                <p className="muted">
                    Complete this demo checkout to create an order, reduce stock, and clear the cart.
                </p>
            </section>

            {error && <div className="alert alert-error">{error}</div>}

            <section className="checkout-layout">
                <form className="form checkout-form" onSubmit={handleSubmit}>
                    <label>
                        Customer name
                        <input
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Shipping address
                        <input
                            name="shippingAddress"
                            value={formData.shippingAddress}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Payment method
                        <input
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <button className="btn btn-primary full-width" disabled={submitting}>
                        {submitting ? "Placing order..." : "Place order"}
                    </button>
                </form>

                <aside className="summary-card">
                    <h2>Checkout summary</h2>

                    {cartItems.map((item) => (
                        <div className="checkout-item" key={item.id}>
                            <span>
                                {item.productName} × {item.quantity}
                            </span>
                            <strong>${item.subtotal.toFixed(2)}</strong>
                        </div>
                    ))}

                    <div className="summary-row total">
                        <span>Total</span>
                        <strong>${totalAmount.toFixed(2)}</strong>
                    </div>
                </aside>
            </section>
        </main>
    );
};

export default CheckoutPage;