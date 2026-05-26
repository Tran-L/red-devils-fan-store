import { useEffect, useState } from "react";
import { Edit, Package, Plus, Save, Trash2, Users, ClipboardList } from "lucide-react";
import api from "../api/api";

const emptyProductForm = {
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: ""
};

const AdminDashboardPage = () => {
    const [activeTab, setActiveTab] = useState("products");

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);

    const [productForm, setProductForm] = useState(emptyProductForm);
    const [editingProductId, setEditingProductId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState("");

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            setError("");

            const [productResponse, orderResponse, userResponse] = await Promise.all([
                api.get("/products"),
                api.get("/orders"),
                api.get("/users")
            ]);

            setProducts(productResponse.data.products);
            setOrders(orderResponse.data.orders);
            setUsers(userResponse.data.users);
        } catch (error) {
            setError(error.response?.data?.message || "Unable to load admin dashboard.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleProductChange = (event) => {
        setProductForm((current) => ({
            ...current,
            [event.target.name]: event.target.value
        }));
    };

    const resetProductForm = () => {
        setProductForm(emptyProductForm);
        setEditingProductId(null);
    };

    const startEditingProduct = (product) => {
        setEditingProductId(product.id);
        setProductForm({
            name: product.name,
            category: product.category,
            description: product.description,
            price: product.price,
            stock: product.stock,
            imageUrl: product.imageUrl
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const submitProduct = async (event) => {
        event.preventDefault();
        setFeedback("");
        setError("");

        try {
            const payload = {
                name: productForm.name,
                category: productForm.category,
                description: productForm.description,
                price: Number(productForm.price),
                stock: Number(productForm.stock),
                imageUrl: productForm.imageUrl
            };

            if (editingProductId) {
                await api.put(`/products/${editingProductId}`, {
                    ...payload,
                    isActive: true
                });

                setFeedback("Product updated successfully.");
            } else {
                await api.post("/products", payload);
                setFeedback("Product created successfully.");
            }

            resetProductForm();
            fetchAdminData();
        } catch (error) {
            setError(error.response?.data?.message || "Unable to save product.");
        }
    };

    const deleteProduct = async (productId) => {
        if (!window.confirm("Delete this product from the shop?")) return;

        try {
            await api.delete(`/products/${productId}`);
            setFeedback("Product deleted successfully.");
            fetchAdminData();
        } catch (error) {
            setError(error.response?.data?.message || "Unable to delete product.");
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await api.put(`/orders/${orderId}/status`, {
                status
            });

            setFeedback("Order status updated successfully.");
            fetchAdminData();
        } catch (error) {
            setError(error.response?.data?.message || "Unable to update order status.");
        }
    };

    const updateUser = async (user, updates) => {
        try {
            await api.put(`/users/${user.id}`, {
                fullName: user.fullName,
                role: updates.role ?? user.role,
                isActive: updates.isActive ?? user.isActive
            });

            setFeedback("User updated successfully.");
            fetchAdminData();
        } catch (error) {
            setError(error.response?.data?.message || "Unable to update user.");
        }
    };

    const deactivateUser = async (userId) => {
        if (!window.confirm("Deactivate this user account?")) return;

        try {
            await api.delete(`/users/${userId}`);
            setFeedback("User deactivated successfully.");
            fetchAdminData();
        } catch (error) {
            setError(error.response?.data?.message || "Unable to deactivate user.");
        }
    };

    if (loading) {
        return (
            <main className="page">
                <div className="status-card">Loading admin dashboard...</div>
            </main>
        );
    }

    return (
        <main className="page">
            <section className="section-header admin-header">
                <div>
                    <p className="eyebrow">Admin area</p>
                    <h1>Dashboard</h1>
                    <p className="muted">
                        Manage products, orders, and users through protected admin-only controls.
                    </p>
                </div>
            </section>

            {feedback && <div className="alert alert-info">{feedback}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <section className="admin-tabs">
                <button
                    className={activeTab === "products" ? "active" : ""}
                    onClick={() => setActiveTab("products")}
                >
                    <Package size={18} />
                    Products
                </button>

                <button
                    className={activeTab === "orders" ? "active" : ""}
                    onClick={() => setActiveTab("orders")}
                >
                    <ClipboardList size={18} />
                    Orders
                </button>

                <button
                    className={activeTab === "users" ? "active" : ""}
                    onClick={() => setActiveTab("users")}
                >
                    <Users size={18} />
                    Users
                </button>
            </section>

            {activeTab === "products" && (
                <section className="admin-section">
                    <form className="admin-form" onSubmit={submitProduct}>
                        <div className="admin-form-title">
                            <div>
                                <p className="eyebrow">{editingProductId ? "Edit product" : "New product"}</p>
                                <h2>{editingProductId ? "Update product" : "Add product"}</h2>
                            </div>

                            {editingProductId && (
                                <button type="button" className="btn btn-outline" onClick={resetProductForm}>
                                    Cancel edit
                                </button>
                            )}
                        </div>

                        <div className="admin-form-grid">
                            <label>
                                Product name
                                <input
                                    name="name"
                                    value={productForm.name}
                                    onChange={handleProductChange}
                                    required
                                />
                            </label>

                            <label>
                                Category
                                <input
                                    name="category"
                                    value={productForm.category}
                                    onChange={handleProductChange}
                                    placeholder="Jerseys"
                                    required
                                />
                            </label>

                            <label>
                                Price
                                <input
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={productForm.price}
                                    onChange={handleProductChange}
                                    required
                                />
                            </label>

                            <label>
                                Stock
                                <input
                                    name="stock"
                                    type="number"
                                    min="0"
                                    value={productForm.stock}
                                    onChange={handleProductChange}
                                    required
                                />
                            </label>

                            <label className="wide-field">
                                Image URL
                                <input
                                    name="imageUrl"
                                    value={productForm.imageUrl}
                                    onChange={handleProductChange}
                                    placeholder="https://..."
                                    required
                                />
                            </label>

                            <label className="wide-field">
                                Description
                                <textarea
                                    name="description"
                                    value={productForm.description}
                                    onChange={handleProductChange}
                                    rows="4"
                                    required
                                />
                            </label>
                        </div>

                        <button className="btn btn-primary">
                            {editingProductId ? <Save size={17} /> : <Plus size={17} />}
                            {editingProductId ? "Save changes" : "Add product"}
                        </button>
                    </form>

                    <div className="admin-table-card">
                        <h2>Product inventory</h2>

                        <div className="admin-table">
                            <div className="admin-table-head product-row">
                                <span>Product</span>
                                <span>Category</span>
                                <span>Price</span>
                                <span>Stock</span>
                                <span>Actions</span>
                            </div>

                            {products.map((product) => (
                                <div className="admin-table-row product-row" key={product.id}>
                                    <span className="admin-product-cell">
                                        <img src={product.imageUrl} alt={product.name} />
                                        <strong>{product.name}</strong>
                                    </span>
                                    <span>{product.category}</span>
                                    <span>${product.price.toFixed(2)}</span>
                                    <span>{product.stock}</span>
                                    <span className="admin-actions">
                                        <button className="icon-button" onClick={() => startEditingProduct(product)}>
                                            <Edit size={17} />
                                        </button>
                                        <button className="icon-button danger" onClick={() => deleteProduct(product.id)}>
                                            <Trash2 size={17} />
                                        </button>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {activeTab === "orders" && (
                <section className="admin-section">
                    <div className="admin-table-card">
                        <h2>Order management</h2>

                        <div className="admin-table">
                            <div className="admin-table-head order-row-admin">
                                <span>Order</span>
                                <span>Customer</span>
                                <span>Total</span>
                                <span>Status</span>
                                <span>Items</span>
                            </div>

                            {orders.map((order) => (
                                <div className="admin-table-row order-row-admin" key={order.id}>
                                    <span>#{order.id}</span>
                                    <span>
                                        <strong>{order.customerName}</strong>
                                        <small>{order.userEmail}</small>
                                    </span>
                                    <span>${order.totalAmount.toFixed(2)}</span>
                                    <span>
                                        <select
                                            value={order.status}
                                            onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Paid">Paid</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </span>
                                    <span>
                                        {order.items.map((item) => (
                                            <small key={item.id}>
                                                {item.productName} × {item.quantity}
                                            </small>
                                        ))}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {activeTab === "users" && (
                <section className="admin-section">
                    <div className="admin-table-card">
                        <h2>User management</h2>

                        <div className="admin-table">
                            <div className="admin-table-head user-row-admin">
                                <span>User</span>
                                <span>Email</span>
                                <span>Role</span>
                                <span>Status</span>
                                <span>Actions</span>
                            </div>

                            {users.map((user) => (
                                <div className="admin-table-row user-row-admin" key={user.id}>
                                    <span>{user.fullName}</span>
                                    <span>{user.email}</span>
                                    <span>
                                        <select
                                            value={user.role}
                                            onChange={(event) => updateUser(user, { role: event.target.value })}
                                        >
                                            <option value="user">user</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    </span>
                                    <span>
                                        <select
                                            value={user.isActive ? "active" : "inactive"}
                                            onChange={(event) =>
                                                updateUser(user, {
                                                    isActive: event.target.value === "active"
                                                })
                                            }
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </span>
                                    <span className="admin-actions">
                                        <button className="btn btn-outline" onClick={() => deactivateUser(user.id)}>
                                            Deactivate
                                        </button>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
};

export default AdminDashboardPage;