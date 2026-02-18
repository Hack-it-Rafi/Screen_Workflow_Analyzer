import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();

    const stats = [
        { label: "Total Videos", value: "24", icon: "🎬", color: "border-gray-800" },
        { label: "Analyzed", value: "18", icon: "✅", color: "border-cyan-500" },
        { label: "Processing", value: "3", icon: "⚙️", color: "border-yellow-500" },
        { label: "Storage Used", value: "4.2 GB", icon: "💾", color: "border-green-400" },
    ];

    const recentVideos = [
        { id: "1", title: "Product Demo 2024", duration: "5:32", status: "Completed", date: "Feb 14, 2026" },
        { id: "2", title: "Team Meeting Recording", duration: "45:12", status: "Processing", date: "Feb 13, 2026" },
        { id: "3", title: "Marketing Campaign Video", duration: "2:15", status: "Completed", date: "Feb 12, 2026" },
    ];

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-green-400 font-mono">
                        <span className="text-cyan-400">&gt;</span> WELCOME, {user?.name?.toUpperCase()} 👋
                    </h1>
                    <p className="text-cyan-400 mt-2 font-mono text-sm">// System status and activity overview</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className={`bg-black/80 border-2 ${stat.color} rounded-lg p-6 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-cyan-400 text-sm font-mono">{stat.label}</p>
                                    <p className="text-3xl font-bold text-green-400 mt-2 font-mono">{stat.value}</p>
                                </div>
                                <div className="text-3xl">
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-black/80 border-2 border-gray-800 rounded-lg shadow-[0_0_30px_rgba(0,255,0,0.2)] p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-green-400 font-mono">[ QUICK ACTIONS ]</h2>
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-green-600 text-black px-6 py-3 rounded font-semibold hover:bg-green-500 transition border border-green-400 font-mono">
                            📤 UPLOAD VIDEO
                        </button>
                        <Link to="/videos" className="bg-transparent border-2 border-cyan-500 text-cyan-400 px-6 py-3 rounded font-semibold hover:bg-cyan-500/10 transition font-mono">
                            📊 VIEW ALL VIDEOS
                        </Link>
                        <button className="bg-transparent border-2 border-cyan-500 text-cyan-400 px-6 py-3 rounded font-semibold hover:bg-cyan-500/10 transition font-mono">
                            📈 GENERATE REPORT
                        </button>
                    </div>
                </div>

                {/* Recent Videos */}
                <div className="bg-black/80 border-2 border-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-green-400 font-mono">[ RECENT VIDEOS ]</h2>
                        <Link to="/videos" className="text-cyan-400 hover:text-cyan-300 font-medium font-mono">
                            VIEW ALL →
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentVideos.map((video) => (
                            <Link
                                key={video.id}
                                to={`/videos/${video.id}`}
                                className="flex items-center justify-between p-4 border border-gray-800/30 rounded-lg hover:border-gray-800 hover:bg-green-500/5 transition"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-linear-to-br from-green-600 to-cyan-600 rounded flex items-center justify-center text-white text-xl border border-green-400">
                                        🎥
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-green-400 font-mono">{video.title}</h3>
                                        <p className="text-sm text-cyan-400 font-mono">{video.duration} • {video.date}</p>
                                    </div>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded border text-sm font-medium font-mono ${video.status === "Completed"
                                        ? "bg-green-900/30 text-green-400 border-gray-800"
                                        : "bg-yellow-900/30 text-yellow-400 border-yellow-500"
                                        }`}
                                >
                                    {video.status.toUpperCase()}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
