import { useAuth } from "../context/AuthContext";

const AccountPage = () => {
    const { user } = useAuth();

    return (
        <main className="page">
            <section className="section-header">
                <p className="eyebrow">My account</p>
                <h1>Account details</h1>
                <p className="muted">
                    This page is protected and can only be viewed by logged-in users.
                </p>
            </section>

            <section className="details-card">
                <div>
                    <span>Full name</span>
                    <strong>{user?.fullName}</strong>
                </div>
                <div>
                    <span>Email</span>
                    <strong>{user?.email}</strong>
                </div>
                <div>
                    <span>Role</span>
                    <strong className="role-pill">{user?.role}</strong>
                </div>
            </section>
        </main>
    );
};

export default AccountPage;