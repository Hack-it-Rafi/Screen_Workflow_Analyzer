import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();

    const stats = [
        { label: "Total Videos", value: "24", icon: "🎬", color: "bg-blue-500" },
        { label: "Analyzed", value: "18", icon: "✅", color: "bg-green-500" },
        { label: "Processing", value: "3", icon: "⚙️", color: "bg-yellow-500" },
        { label: "Storage Used", value: "4.2 GB", icon: "💾", color: "bg-purple-500" },
    ];

    const recentVideos = [
        { id: "1", title: "Product Demo 2024", duration: "5:32", status: "Completed", date: "Feb 14, 2026" },
        { id: "2", title: "Team Meeting Recording", duration: "45:12", status: "Processing", date: "Feb 13, 2026" },
        { id: "3", title: "Marketing Campaign Video", duration: "2:15", status: "Completed", date: "Feb 12, 2026" },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}! 👋</h1>
                <p className="text-gray-600 mt-2">Here's what's happening with your videos today</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                            </div>
                            <div className={`${stat.color} text-white text-3xl w-14 h-14 rounded-full flex items-center justify-center`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-md p-8 mb-8 text-white">
                <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                        📤 Upload Video
                    </button>
                    <Link to="/videos" className="bg-white/20 px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition">
                        📊 View All Videos
                    </Link>
                    <button className="bg-white/20 px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition">
                        📈 Generate Report
                    </button>
                </div>
            </div>

            {/* Recent Videos */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Recent Videos</h2>
                    <Link to="/videos" className="text-purple-600 hover:text-purple-700 font-medium">
                        View All →
                    </Link>
                </div>
                <div className="space-y-4">
                    {recentVideos.map((video) => (
                        <Link
                            key={video.id}
                            to={`/videos/${video.id}`}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center text-white text-xl">
                                    🎥
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{video.title}</h3>
                                    <p className="text-sm text-gray-600">{video.duration} • {video.date}</p>
                                </div>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${video.status === "Completed"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                {video.status}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
