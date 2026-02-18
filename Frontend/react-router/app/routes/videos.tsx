import { Link } from "react-router";
import { useState } from "react";

export default function Videos() {
    const [filter, setFilter] = useState("all");

    const videos = [
        { id: "1", title: "Product Demo 2024", duration: "5:32", status: "Completed", date: "Feb 14, 2026", views: 1234, size: "125 MB" },
        { id: "2", title: "Team Meeting Recording", duration: "45:12", status: "Processing", date: "Feb 13, 2026", views: 89, size: "890 MB" },
        { id: "3", title: "Marketing Campaign Video", duration: "2:15", status: "Completed", date: "Feb 12, 2026", views: 3456, size: "78 MB" },
        { id: "4", title: "Training Session Q1", duration: "1:23:45", status: "Completed", date: "Feb 11, 2026", views: 567, size: "1.2 GB" },
        { id: "5", title: "Customer Testimonial", duration: "3:42", status: "Completed", date: "Feb 10, 2026", views: 2341, size: "95 MB" },
        { id: "6", title: "Product Launch Event", duration: "32:18", status: "Failed", date: "Feb 9, 2026", views: 0, size: "450 MB" },
    ];

    const filteredVideos = filter === "all"
        ? videos
        : videos.filter(v => v.status.toLowerCase() === filter);

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-green-400 font-mono">[ VIDEO LIBRARY ]</h1>
                        <p className="text-cyan-400 mt-2 font-mono text-sm">// Manage and analyze your video content</p>
                    </div>
                    <button className="mt-4 md:mt-0 bg-green-600 text-black px-6 py-3 rounded font-semibold hover:bg-green-500 transition border border-green-400 font-mono shadow-[0_0_20px_rgba(0,255,0,0.3)]">
                        📤 UPLOAD NEW VIDEO
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-black/80 border-2 border-gray-800 rounded-lg p-4 mb-6">
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-2 rounded font-medium transition font-mono ${filter === "all"
                                ? "bg-green-600 text-black border-2 border-green-400"
                                : "bg-transparent text-green-400 border-2 border-gray-800/50 hover:border-gray-800"
                                }`}
                        >
                            ALL ({videos.length})
                        </button>
                        <button
                            onClick={() => setFilter("completed")}
                            className={`px-4 py-2 rounded font-medium transition font-mono ${filter === "completed"
                                ? "bg-green-600 text-black border-2 border-green-400"
                                : "bg-transparent text-green-400 border-2 border-gray-800/50 hover:border-gray-800"
                                }`}
                        >
                            COMPLETED ({videos.filter(v => v.status === "Completed").length})
                        </button>
                        <button
                            onClick={() => setFilter("processing")}
                            className={`px-4 py-2 rounded font-medium transition font-mono ${filter === "processing"
                                ? "bg-yellow-600 text-black border-2 border-yellow-400"
                                : "bg-transparent text-yellow-400 border-2 border-yellow-500/50 hover:border-yellow-500"
                                }`}
                        >
                            PROCESSING ({videos.filter(v => v.status === "Processing").length})
                        </button>
                        <button
                            onClick={() => setFilter("failed")}
                            className={`px-4 py-2 rounded font-medium transition font-mono ${filter === "failed"
                                ? "bg-red-600 text-black border-2 border-red-400"
                                : "bg-transparent text-red-400 border-2 border-red-500/50 hover:border-red-500"
                                }`}
                        >
                            FAILED ({videos.filter(v => v.status === "Failed").length})
                        </button>
                    </div>
                </div>

                {/* Videos Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.map((video) => (
                        <Link
                            key={video.id}
                            to={`/videos/${video.id}`}
                            className="bg-black/80 border-2 border-gray-800/30 rounded-lg overflow-hidden hover:border-gray-800 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition group"
                        >
                            <div className="aspect-video bg-linear-to-br from-green-900/50 to-cyan-900/50 flex items-center justify-center group-hover:from-green-900/70 group-hover:to-cyan-900/70 transition border-b-2 border-gray-800/30">
                                <span className="text-6xl">🎬</span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-green-400 mb-2 group-hover:text-cyan-400 transition font-mono">
                                    {video.title}
                                </h3>
                                <div className="flex items-center justify-between text-sm text-cyan-400 mb-3 font-mono">
                                    <span>⏱️ {video.duration}</span>
                                    <span>👁️ {video.views.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 font-mono">{video.date} • {video.size}</span>
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium border font-mono ${video.status === "Completed"
                                            ? "bg-green-900/30 text-green-400 border-gray-800"
                                            : video.status === "Processing"
                                                ? "bg-yellow-900/30 text-yellow-400 border-yellow-500"
                                                : "bg-red-900/30 text-red-400 border-red-500"
                                            }`}
                                    >
                                        {video.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
