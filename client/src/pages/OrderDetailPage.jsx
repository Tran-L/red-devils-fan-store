import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";

const OrderDetailPage = () => {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/${id}`);
                setOrder(response.data.order);
            } catch (error) {
                setError(error.response?.data?.message || "Unable to load order.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <main className="page">
                <div className="status-card">Loading order...</div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="page">
                <div className="alert alert-error">{error}</div>
                <Link to="/orders" className="btn btn-outline">
                    Back to orders
                </Link>
            </main>
        );
    }

    return (
        <main className="page">
            <section className="section-header">
                <p className="eyebrow">Order details</p>
                <h1>Order #{order.id}</h1>
                <p className="muted">Status: {order.status}</p>
            </section>

            <section className="details-card order-detail-card">
                <div>
                    <span>Customer</span>
                    <strong>{order.customerName}</strong>
                </div>
                <div>
                    <span>Shipping address</span>
                    <strong>{order.shippingAddress}</strong>
                </div>
                <div>
                    <span>Payment method</span>
                    <strong>{order.paymentMethod}</strong>
                </div>
                <div>
                    <span>Total</span>
                    <strong>${order.totalAmount.toFixed(2)}</strong>
                </div>
            </section>

            <section className="order-table-card">
                <h2>Items</h2>

                {order.items.map((item) => (
                    <div className="order-line" key={item.id}>
                        <span>{item.productName}</span>
                        <span>${item.unitPrice.toFixed(2)}</span>
                        <span>× {item.quantity}</span>
                        <strong>${item.subtotal.toFixed(2)}</strong>
                    </div>
                ))}
            </section>
        </main>
    );
};

export default OrderDetailPage;