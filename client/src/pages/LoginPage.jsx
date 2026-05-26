import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "user@redstore.com",
        password: "User123!"
    });

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (event) => {
        setFormData((current) => ({
            ...current,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login(formData);
            navigate("/products");
        } catch (error) {
            setError(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const useDemoAccount = (type) => {
        if (type === "admin") {
            setFormData({
                email: "admin@redstore.com",
                password: "Admin123!"
            });
        } else {
            setFormData({
                email: "user@redstore.com",
                password: "User123!"
            });
        }
    };

    return (
        <main className="page page-centered">
            <section className="auth-card">
                <p className="eyebrow">Welcome back</p>
                <h1>Login</h1>
                <p className="muted">
                    Login to manage your cart, checkout, and view your order history.
                </p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="form">
                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <button className="btn btn-primary full-width" disabled={submitting}>
                        {submitting ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="demo-buttons">
                    <button className="btn btn-light" onClick={() => useDemoAccount("user")}>
                        Use demo user
                    </button>
                    <button className="btn btn-light" onClick={() => useDemoAccount("admin")}>
                        Use admin
                    </button>
                </div>

                <p className="auth-switch">
                    No account yet? <Link to="/register">Create one</Link>
                </p>
            </section>
        </main>
    );
};

export default LoginPage;