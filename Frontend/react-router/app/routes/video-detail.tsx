import { Link, useParams } from "react-router";
import { useState, useEffect } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";

export default function VideoDetail() {
    const { id } = useParams();
    const [video, setVideo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const axiosSecure = useAxiosSecure();

    // Fetch video details
    const fetchVideo = async () => {
        try {
            const response = await axiosSecure.get(`/videos/${id}`);
            setVideo(response.data.data);
        } catch (error) {
            console.error('Error fetching video:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchVideo();
    }, [id]);

    // Auto-refresh if video is processing
    useEffect(() => {
        if (video?.status === 'processing') {
            const interval = setInterval(() => {
                fetchVideo();
            }, 5000); // Poll every 5 seconds

            return () => clearInterval(interval);
        }
    }, [video?.status]);

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-green-400 font-mono text-xl animate-pulse">Loading video...</div>
            </div>
        );
    }

    if (!video) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <p className="text-red-400 font-mono text-lg">Video not found</p>
                    <Link to="/videos" className="text-cyan-400 hover:text-cyan-300 font-mono mt-4 inline-block">
                        &lt;- Back to videos
                    </Link>
                </div>
            </div>
        );
    }

    const prediction = video.prediction ? JSON.parse(video.prediction) : null;

    const getStatusBadge = () => {
        switch (video.status) {
            case 'completed':
                return <span className="px-3 py-1 bg-green-900/30 text-green-400 border border-green-500 rounded text-sm font-medium font-mono">✓ COMPLETED</span>;
            case 'processing':
                return <span className="px-3 py-1 bg-yellow-900/30 text-yellow-400 border border-yellow-500 rounded text-sm font-medium font-mono animate-pulse">⏳ PROCESSING</span>;
            case 'failed':
                return <span className="px-3 py-1 bg-red-900/30 text-red-400 border border-red-500 rounded text-sm font-medium font-mono">❌ FAILED</span>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center justify-between">
                    <Link to="/videos" className="text-cyan-400 hover:text-cyan-300 font-medium font-mono">
                        &lt;- BACK TO VIDEOS
                    </Link>
                    {getStatusBadge()}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Video Player Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-black/80 border-2 border-gray-800 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.2)]">
                            <div className="aspect-video bg-linear-to-br from-green-900/30 to-cyan-900/30 flex items-center justify-center border-b-2 border-gray-800">
                                <div className="text-center text-green-400">
                                    {video.status === 'processing' ? (
                                        <>
                                            <span className="text-8xl mb-4 block animate-pulse">⏳</span>
                                            <p className="text-xl font-semibold font-mono">[ PROCESSING VIDEO ]</p>
                                            <p className="text-sm mt-2 text-cyan-400 font-mono">// Please wait for analysis to complete</p>
                                        </>
                                    ) : video.status === 'failed' ? (
                                        <>
                                            <span className="text-8xl mb-4 block">❌</span>
                                            <p className="text-xl font-semibold font-mono text-red-400">[ PROCESSING FAILED ]</p>
                                            <p className="text-sm mt-2 text-cyan-400 font-mono">// Video analysis encountered an error</p>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-8xl mb-4 block">▶️</span>
                                            <p className="text-xl font-semibold font-mono">[ VIDEO PLAYER ]</p>
                                            <p className="text-sm mt-2 text-cyan-400 font-mono">// Click to play video</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                <h1 className="text-2xl font-bold text-green-400 mb-4 font-mono">{video.caption || 'Untitled Video'}</h1>
                                <div className="flex flex-wrap gap-4 text-sm text-cyan-400 font-mono">
                                    <span>📅 {new Date(video.createdAt).toLocaleDateString()}</span>
                                    <span>🆔 {video._id}</span>
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <button
                                        className="px-4 py-2 bg-green-600 text-black rounded hover:bg-green-500 transition border border-green-400 font-mono"
                                        disabled={video.status !== 'completed'}
                                    >
                                        📥 DOWNLOAD
                                    </button>
                                    <button className="px-4 py-2 bg-transparent border-2 border-red-500 text-red-400 rounded hover:bg-red-500/10 transition font-mono">
                                        🗑️ DELETE
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Prediction Results */}
                        {video.status === 'completed' && prediction && (
                            <div className="bg-black/80 border-2 border-gray-800 rounded-lg p-6 mt-6">
                                <h2 className="text-xl font-bold text-green-400 mb-4 font-mono">[ PREDICTION RESULTS ]</h2>
                                <div className="bg-gray-900/50 border border-gray-800/30 rounded p-4">
                                    <pre className="text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                                        {JSON.stringify(prediction, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {/* Processing Message */}
                        {video.status === 'processing' && (
                            <div className="bg-yellow-900/20 border-2 border-yellow-500/50 rounded-lg p-6 mt-6">
                                <h2 className="text-xl font-bold text-yellow-400 mb-2 font-mono">⏳ Processing in Progress</h2>
                                <p className="text-gray-400 font-mono text-sm">
                                    Your video is being analyzed by our AI system. This page will automatically update when the analysis is complete.
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-cyan-400 font-mono text-sm">
                                    <span className="animate-pulse">●</span>
                                    <span>Auto-refreshing every 5 seconds...</span>
                                </div>
                            </div>
                        )}

                        {/* Failed Message */}
                        {video.status === 'failed' && (
                            <div className="bg-red-900/20 border-2 border-red-500/50 rounded-lg p-6 mt-6">
                                <h2 className="text-xl font-bold text-red-400 mb-2 font-mono">❌ Processing Failed</h2>
                                <p className="text-gray-400 font-mono text-sm">
                                    The video analysis encountered an error. Please try uploading the video again or contact support if the problem persists.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Video Info Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-black/80 border-2 border-gray-800 rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-bold text-green-400 mb-4 font-mono">[ VIDEO INFO ]</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-cyan-400 font-mono">Status</p>
                                    <p className="font-semibold text-green-400 font-mono">{video.status.toUpperCase()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-cyan-400 font-mono">Upload Date</p>
                                    <p className="font-semibold text-green-400 font-mono">
                                        {new Date(video.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-cyan-400 font-mono">Last Updated</p>
                                    <p className="font-semibold text-green-400 font-mono">
                                        {new Date(video.updatedAt).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-cyan-400 font-mono">File URL</p>
                                    <p className="font-semibold text-green-400 font-mono text-xs break-all">
                                        {video.fileUrl}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Status */}
                        <div className="bg-black/80 border-2 border-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-green-400 mb-4 font-mono">[ ANALYSIS STATUS ]</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-cyan-400 font-mono text-sm">Upload</span>
                                    <span className="text-green-400 font-mono">✓</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-cyan-400 font-mono text-sm">Storage</span>
                                    <span className="text-green-400 font-mono">✓</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-cyan-400 font-mono text-sm">AI Processing</span>
                                    <span className={`font-mono ${video.status === 'completed' ? 'text-green-400' :
                                            video.status === 'processing' ? 'text-yellow-400 animate-pulse' :
                                                'text-red-400'
                                        }`}>
                                        {video.status === 'completed' ? '✓' :
                                            video.status === 'processing' ? '⏳' : '✗'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
