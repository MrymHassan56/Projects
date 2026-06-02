import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-black text-white px-6 py-4 flex flex-wrap gap-4 justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        AdFlow Pro
      </Link>

      <div className="flex flex-wrap gap-4 items-center text-sm">
        <Link to="/ads">Browse Ads</Link>
        <Link to="/packages">Packages</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/contact">Contact</Link>

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            {user.role === "client" && <Link to="/client/dashboard">Dashboard</Link>}
            {[
              "moderator",
              "admin",
              "super_admin",
            ].includes(user.role) && <Link to="/moderator/dashboard">Moderator</Link>}
            {["admin", "super_admin"].includes(user.role) && <Link to="/admin/dashboard">Admin</Link>}
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;