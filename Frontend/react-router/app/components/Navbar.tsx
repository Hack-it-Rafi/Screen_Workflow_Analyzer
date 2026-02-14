import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/dashboard" className="text-xl font-bold hover:text-gray-200 transition">
                            📹 Video Analyzer
                        </Link>
                        <div className="hidden md:flex space-x-4">
                            <Link
                                to="/dashboard"
                                className="px-3 py-2 rounded-md hover:bg-white/20 transition"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/videos"
                                className="px-3 py-2 rounded-md hover:bg-white/20 transition"
                            >
                                Videos
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="hidden md:inline text-sm">
                            Welcome, {user?.name}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-white/20 rounded-md hover:bg-white/30 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
