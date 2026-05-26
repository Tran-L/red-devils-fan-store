import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, ShoppingCart, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="navbar">
            <Link to="/" className="navbar-brand">
                <div className="brand-icon">
                    <ShoppingBag size={22} />
                </div>
                <div>
                    <span>Red Devils</span>
                    <small>Fan Store</small>
                </div>
            </Link>

            <nav className="navbar-links">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/products">Shop</NavLink>

                {isAuthenticated && (
                    <>
                        <NavLink to="/cart">
                            <ShoppingCart size={18} />
                            Cart
                        </NavLink>
                        <NavLink to="/orders">Orders</NavLink>
                    </>
                )}

                {isAdmin && <NavLink to="/admin">Admin</NavLink>}
            </nav>

            <div className="navbar-actions">
                {isAuthenticated ? (
                    <>
                        <Link to="/account" className="user-chip">
                            <User size={16} />
                            {user?.fullName}
                        </Link>
                        <button className="btn btn-outline" onClick={handleLogout}>
                            <LogOut size={16} />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-outline">
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-primary">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Navbar;