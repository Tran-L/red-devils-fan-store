import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get("/orders/my-orders");
                setOrders(response.data.orders);
            } catch (error) {
                setError(error.response?.data?.message || "Unable to load orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <main className="page">
                <div className="status-card">Loading orders...</div>
            </main>
        );
    }

    return (
        <main className="page">
            <section className="section-header">
                <p className="eyebrow">Order history</p>
                <h1>My orders</h1>
                <p className="muted">View previous orders created through the checkout flow.</p>
            </section>

            {error && <div className="alert alert-error">{error}</div>}

            {orders.length === 0 ? (
                <section className="empty-state">
                    <h2>No orders yet</h2>
                    <p>Your completed checkouts will appear here.</p>
                    <Link to="/products" className="btn btn-primary">
                        Shop products
                    </Link>
                </section>
            ) : (
                <section className="order-list">
                    {orders.map((order) => (
                        <article className="order-card" key={order.id}>
                            <div className="order-card-header">
                                <div>
                                    <span>Order #{order.id}</span>
                                    <h2>${order.totalAmount.toFixed(2)}</h2>
                                </div>

                                <strong className="status-pill">{order.status}</strong>
                            </div>

                            <p>{order.shippingAddress}</p>

                            <div className="order-items-preview">
                                {order.items.map((item) => (
                                    <span key={item.id}>
                                        {item.productName} × {item.quantity}
                                    </span>
                                ))}
                            </div>

                            <Link to={`/orders/${order.id}`} className="btn btn-outline">
                                View details
                            </Link>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
};

export default OrderHistoryPage;