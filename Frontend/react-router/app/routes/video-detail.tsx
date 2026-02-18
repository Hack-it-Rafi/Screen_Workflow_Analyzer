import { Link, useParams } from "react-router";

export default function VideoDetail() {
    const { id } = useParams();

    // Mock data - replace with actual API call
    const video = {
        id,
        title: "Product Demo 2024",
        duration: "5:32",
        uploadDate: "Feb 14, 2026",
        size: "125 MB",
        resolution: "1920x1080",
        fps: "30",
        format: "MP4",
        views: 1234,
    };

    const analysisResults = {
        sentimentScore: 85,
        keyObjects: ["person", "laptop", "product", "presentation", "screen"],
        transcription: "Welcome to our product demo. Today we'll be showcasing the amazing features of our new platform...",
        scenes: [
            { time: "0:00", description: "Introduction and welcome", confidence: 95 },
            { time: "1:23", description: "Feature demonstration", confidence: 92 },
            { time: "3:45", description: "Use case examples", confidence: 88 },
            { time: "5:10", description: "Conclusion and call to action", confidence: 94 },
        ],
        faces: 2,
        emotions: { happy: 65, neutral: 25, surprised: 10 },
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link to="/videos" className="text-cyan-400 hover:text-cyan-300 font-medium font-mono">
                        &lt;- BACK TO VIDEOS
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Video Player Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-black/80 border-2 border-gray-800 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.2)]">
                            <div className="aspect-video bg-linear-to-br from-green-900/30 to-cyan-900/30 flex items-center justify-center border-b-2 border-gray-800">
                                <div className="text-center text-green-400">
                                    <span className="text-8xl mb-4 block">▶️</span>
                                    <p className="text-xl font-semibold font-mono">[ VIDEO PLAYER ]</p>
                                    <p className="text-sm mt-2 text-cyan-400 font-mono">// Click to play video</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <h1 className="text-2xl font-bold text-green-400 mb-4 font-mono">{video.title}</h1>
                                <div className="flex flex-wrap gap-4 text-sm text-cyan-400 font-mono">
                                    <span>⏱️ {video.duration}</span>
                                    <span>👁️ {video.views.toLocaleString()} views</span>
                                    <span>📅 {video.uploadDate}</span>
                                    <span>💾 {video.size}</span>
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <button className="px-4 py-2 bg-green-600 text-black rounded hover:bg-green-500 transition border border-green-400 font-mono">
                                        📥 DOWNLOAD
                                    </button>
                                    <button className="px-4 py-2 bg-transparent border-2 border-cyan-500 text-cyan-400 rounded hover:bg-cyan-500/10 transition font-mono">
                                        ✏️ EDIT
                                    </button>
                                    <button className="px-4 py-2 bg-transparent border-2 border-cyan-500 text-cyan-400 rounded hover:bg-cyan-500/10 transition font-mono">
                                        🔄 RE-ANALYZE
                                    </button>
                                    <button className="px-4 py-2 bg-transparent border-2 border-red-500 text-red-400 rounded hover:bg-red-500/10 transition font-mono">
                                        🗑️ DELETE
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Transcription */}
                        <div className="bg-black/80 border-2 border-gray-800 rounded-lg p-6 mt-6">
                            <h2 className="text-xl font-bold text-green-400 mb-4 font-mono">[ TRANSCRIPTION ]</h2>
                            <p className="text-gray-400 leading-relaxed font-mono text-sm">{analysisResults.transcription}</p>
                            <button className="mt-4 text-cyan-400 hover:text-cyan-300 font-medium font-mono">
                                VIEW FULL TRANSCRIPTION →
                            </button>
                        </div>

                        {/* Scene Detection */}
                        <div className="bg-black/80 border-2 border-gray-800 rounded-lg p-6 mt-6">
                            <h2 className="text-xl font-bold text-green-400 mb-4 font-mono">[ SCENE DETECTION ]</h2>
                            <div className="space-y-3">
                                {analysisResults.scenes.map((scene, index) => (
                                    <div key={index} className="flex items-start gap-4 p-3 border border-gray-800/30 rounded-lg hover:border-gray-800 transition bg-green-900/10">
                                        <span className="font-mono text-sm text-cyan-400 font-semibold">{scene.time}</span>
                                        <div className="flex-1">
                                            <p className="text-green-400 font-mono text-sm">{scene.description}</p>
                                            <p className="text-xs text-gray-500 mt-1 font-mono">Confidence: {scene.confidence}%</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Analysis Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Video Info */}
                        <div className="bg-black/80 border-2 border-gray-800 rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-bold text-green-400 mb-4 font-mono">[ VIDEO INFO ]</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-cyan-400 font-mono">Resolution</p>
                                    <p className="font-semibold text-green-400 font-mono">{video.resolution}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-cyan-400 font-mono">Frame Rate</p>
                                    <p className="font-semibold text-green-400 font-mono">{video.fps} FPS</p>
                                </div>
                                <div>
                                    <p className="text-sm text-cyan-400 font-mono">Format</p>
                                    <p className="font-semibold text-green-400 font-mono">{video.format}</p>
                                </div>
                            </div>
                        </div>

                        {/* Sentiment Analysis */}
                        <div className="bg-black/80 border-2 border-gray-800 rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-bold text-green-400 mb-4 font-mono">[ SENTIMENT ]</h2>
                            <div className="text-center mb-4">
                                <div className="text-4xl font-bold text-green-400 font-mono">{analysisResults.sentimentScore}%</div>
                                <p className="text-sm text-cyan-400 mt-1 font-mono">Positive Sentiment</p>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <div className="flex justify-between text-sm mb-1 font-mono">
                                        <span className="text-cyan-400">😊 Happy</span>
                                        <span className="text-green-400">{analysisResults.emotions.happy}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-2 border border-gray-800/30">
                                        <div className="bg-green-500 h-2 rounded-full shadow-[0_0_10px_rgba(0,255,0,0.5)]" style={{ width: `${analysisResults.emotions.happy}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1 font-mono">
                                        <span className="text-cyan-400">😐 Neutral</span>
                                        <span className="text-cyan-400">{analysisResults.emotions.neutral}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-2 border border-gray-800/30">
                                        <div className="bg-cyan-500 h-2 rounded-full shadow-[0_0_10px_rgba(0,255,255,0.5)]" style={{ width: `${analysisResults.emotions.neutral}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1 font-mono">
                                        <span className="text-cyan-400">😲 Surprised</span>
                                        <span className="text-yellow-400">{analysisResults.emotions.surprised}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-2 border border-gray-800/30">
                                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${analysisResults.emotions.surprised}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Object Detection */}
                        <div className="bg-black/80 border-2 border-gray-800 rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-bold text-green-400 mb-4 font-mono">[ DETECTED ]</h2>
                            <div className="flex flex-wrap gap-2">
                                {analysisResults.keyObjects.map((object, index) => (
                                    <span key={index} className="px-3 py-1 bg-green-900/30 text-green-400 border border-gray-800 rounded text-sm font-medium font-mono">
                                        {object.toUpperCase()}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-800/30">
                                <p className="text-sm text-cyan-400 font-mono">Faces Detected</p>
                                <p className="text-2xl font-bold text-green-400 font-mono">{analysisResults.faces}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
