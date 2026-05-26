import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: ""
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
            await register(formData);
            navigate("/products");
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="page page-centered">
            <section className="auth-card">
                <p className="eyebrow">Create your account</p>
                <h1>Register</h1>
                <p className="muted">
                    Create an account to start shopping and save your order history.
                </p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="form">
                    <label>
                        Full name
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </label>

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
                            minLength="8"
                            required
                        />
                    </label>

                    <button className="btn btn-primary full-width" disabled={submitting}>
                        {submitting ? "Creating account..." : "Register"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </section>
        </main>
    );
};

export default RegisterPage;