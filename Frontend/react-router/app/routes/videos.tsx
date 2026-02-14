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
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Video Library</h1>
                    <p className="text-gray-600 mt-2">Manage and analyze your video content</p>
                </div>
                <button className="mt-4 md:mt-0 bg-linear-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition">
                    📤 Upload New Video
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === "all"
                                ? "bg-purple-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        All Videos ({videos.length})
                    </button>
                    <button
                        onClick={() => setFilter("completed")}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === "completed"
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        Completed ({videos.filter(v => v.status === "Completed").length})
                    </button>
                    <button
                        onClick={() => setFilter("processing")}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === "processing"
                                ? "bg-yellow-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        Processing ({videos.filter(v => v.status === "Processing").length})
                    </button>
                    <button
                        onClick={() => setFilter("failed")}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === "failed"
                                ? "bg-red-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        Failed ({videos.filter(v => v.status === "Failed").length})
                    </button>
                </div>
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                    <Link
                        key={video.id}
                        to={`/videos/${video.id}`}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
                    >
                        <div className="aspect-video bg-linear-to-br from-purple-400 to-blue-500 flex items-center justify-center group-hover:from-purple-500 group-hover:to-blue-600 transition">
                            <span className="text-6xl">🎬</span>
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition">
                                {video.title}
                            </h3>
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                                <span>⏱️ {video.duration}</span>
                                <span>👁️ {video.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{video.date} • {video.size}</span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${video.status === "Completed"
                                            ? "bg-green-100 text-green-700"
                                            : video.status === "Processing"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {video.status}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
