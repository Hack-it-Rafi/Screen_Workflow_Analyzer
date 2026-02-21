import { Link } from "react-router";
import { useState, useEffect } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";

export default function Videos() {
    const [filter, setFilter] = useState("all");
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const axiosSecure = useAxiosSecure();

    // Fetch videos from API
    const fetchVideos = async () => {
        try {
            const response = await axiosSecure.get('/videos');
            setVideos(response.data.data || []);
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchVideos();
    }, []);

    // Auto-refresh for processing videos
    useEffect(() => {
        const hasProcessingVideos = videos.some((v: any) => v.status === 'processing');

        if (hasProcessingVideos) {
            const interval = setInterval(() => {
                fetchVideos();
            }, 5000); // Poll every 5 seconds

            return () => clearInterval(interval);
        }
    }, [videos]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'video/mp4') {
            alert('Please upload an MP4 video file');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('video', file);
        formData.append('caption', file.name);
        console.log(formData);

        try {
            await axiosSecure.post('/videos/create-video', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Refresh videos list
            await fetchVideos();
            alert('Video uploaded successfully! Processing started.');
        } catch (error) {
            console.error('Error uploading video:', error);
            alert('Failed to upload video');
        } finally {
            setIsUploading(false);
            event.target.value = ''; // Reset file input
        }
    };

    const filteredVideos = filter === "all"
        ? videos
        : videos.filter((v: any) => v.status === filter);

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'completed':
                return { label: 'COMPLETED', className: 'bg-green-900/30 text-green-400 border-gray-800' };
            case 'processing':
                return { label: 'PROCESSING', className: 'bg-yellow-900/30 text-yellow-400 border-yellow-500 animate-pulse' };
            case 'failed':
                return { label: 'FAILED', className: 'bg-red-900/30 text-red-400 border-red-500' };
            default:
                return { label: status.toUpperCase(), className: 'bg-gray-900/30 text-gray-400 border-gray-500' };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-green-400 font-mono text-xl animate-pulse">Loading videos...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-green-400 font-mono">[ VIDEO LIBRARY ]</h1>
                        <p className="text-cyan-400 mt-2 font-mono text-sm">// Manage and analyze your video content</p>
                    </div>
                    <label className="mt-4 md:mt-0 bg-green-600 text-black px-6 py-3 rounded font-semibold hover:bg-green-500 transition border border-green-400 font-mono shadow-[0_0_20px_rgba(0,255,0,0.3)] cursor-pointer inline-block">
                        {isUploading ? '⏳ UPLOADING...' : '📤 UPLOAD NEW VIDEO'}
                        <input
                            type="file"
                            accept="video/mp4"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                    </label>
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
                            COMPLETED ({videos.filter((v: any) => v.status === "completed").length})
                        </button>
                        <button
                            onClick={() => setFilter("processing")}
                            className={`px-4 py-2 rounded font-medium transition font-mono ${filter === "processing"
                                ? "bg-yellow-600 text-black border-2 border-yellow-400"
                                : "bg-transparent text-yellow-400 border-2 border-yellow-500/50 hover:border-yellow-500"
                                }`}
                        >
                            PROCESSING ({videos.filter((v: any) => v.status === "processing").length})
                        </button>
                        <button
                            onClick={() => setFilter("failed")}
                            className={`px-4 py-2 rounded font-medium transition font-mono ${filter === "failed"
                                ? "bg-red-600 text-black border-2 border-red-400"
                                : "bg-transparent text-red-400 border-2 border-red-500/50 hover:border-red-500"
                                }`}
                        >
                            FAILED ({videos.filter((v: any) => v.status === "failed").length})
                        </button>
                    </div>
                </div>

                {/* Videos Grid */}
                {filteredVideos.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🎬</div>
                        <p className="text-cyan-400 font-mono text-lg">No videos found</p>
                        <p className="text-gray-500 font-mono text-sm mt-2">Upload your first video to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVideos.map((video: any) => {
                            const statusInfo = getStatusInfo(video.status);
                            return (
                                <Link
                                    key={video._id}
                                    to={`/videos/${video._id}`}
                                    className="bg-black/80 border-2 border-gray-800/30 rounded-lg overflow-hidden hover:border-gray-800 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition group"
                                >
                                    <div className="aspect-video bg-linear-to-br from-green-900/50 to-cyan-900/50 flex items-center justify-center group-hover:from-green-900/70 group-hover:to-cyan-900/70 transition border-b-2 border-gray-800/30">
                                        <span className="text-6xl">
                                            {video.status === 'processing' ? '⏳' : video.status === 'failed' ? '❌' : '🎬'}
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-green-400 mb-2 group-hover:text-cyan-400 transition font-mono truncate">
                                            {video.caption || 'Untitled Video'}
                                        </h3>
                                        <div className="flex items-center justify-between text-sm text-cyan-400 mb-3 font-mono">
                                            <span>📅 {new Date(video.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500 font-mono">
                                                ID: {video._id.slice(0, 8)}...
                                            </span>
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium border font-mono ${statusInfo.className}`}
                                            >
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
