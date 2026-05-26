import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Search, ShoppingCart } from "lucide-react";

const HomePage = () => {
    return (
        <main>
            <section className="hero">
                <div className="hero-content">
                    <p className="eyebrow">Manchester United football fan merchandise store</p>
                    <h1>Matchday gear, supporter style, and football-inspired essentials.</h1>
                    <p className="hero-text">
                        Red Devils Fan Store is a single-page e-commerce application where fans can
                        browse products, search in real time, manage a cart, and place orders through
                        a secure checkout flow.
                    </p>

                    <div className="hero-actions">
                        <Link to="/products" className="btn btn-primary">
                            Shop products
                            <ArrowRight size={18} />
                        </Link>
                        <Link to="/login" className="btn btn-outline">
                            Login as demo user
                        </Link>
                    </div>
                </div>

                <div className="hero-card">
                    <span className="hero-badge">Focused features</span>
                    <h2>Full-stack e-commerce</h2>
                    <p>
                        React, Express, SQLite, JWT authentication, protected routes, admin access,
                        cart logic, and order management.
                    </p>
                </div>
            </section>

            <section className="feature-grid">
                <article className="feature-card">
                    <Search size={28} />
                    <h3>Live product search</h3>
                    <p>Users can search products instantly without reloading the page.</p>
                </article>

                <article className="feature-card">
                    <ShoppingCart size={28} />
                    <h3>Shopping cart flow</h3>
                    <p>Authenticated users can add products, update quantities, and checkout.</p>
                </article>

                <article className="feature-card">
                    <ShieldCheck size={28} />
                    <h3>Secure access</h3>
                    <p>Passwords are hashed and protected routes use JWT authentication.</p>
                </article>
            </section>
        </main>
    );
};

export default HomePage;