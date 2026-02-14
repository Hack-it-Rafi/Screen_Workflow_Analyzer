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
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link to="/videos" className="text-purple-600 hover:text-purple-700 font-medium">
                    ← Back to Videos
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video Player Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="aspect-video bg-linear-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                            <div className="text-center text-white">
                                <span className="text-8xl mb-4 block">▶️</span>
                                <p className="text-xl font-semibold">Video Player</p>
                                <p className="text-sm mt-2 opacity-80">Click to play video</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-4">{video.title}</h1>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <span>⏱️ {video.duration}</span>
                                <span>👁️ {video.views.toLocaleString()} views</span>
                                <span>📅 {video.uploadDate}</span>
                                <span>💾 {video.size}</span>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                                    📥 Download
                                </button>
                                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                                    ✏️ Edit
                                </button>
                                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                                    🔄 Re-analyze
                                </button>
                                <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Transcription */}
                    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Transcription</h2>
                        <p className="text-gray-700 leading-relaxed">{analysisResults.transcription}</p>
                        <button className="mt-4 text-purple-600 hover:text-purple-700 font-medium">
                            View Full Transcription →
                        </button>
                    </div>

                    {/* Scene Detection */}
                    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">🎬 Scene Detection</h2>
                        <div className="space-y-3">
                            {analysisResults.scenes.map((scene, index) => (
                                <div key={index} className="flex items-start gap-4 p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition">
                                    <span className="font-mono text-sm text-purple-600 font-semibold">{scene.time}</span>
                                    <div className="flex-1">
                                        <p className="text-gray-800">{scene.description}</p>
                                        <p className="text-xs text-gray-500 mt-1">Confidence: {scene.confidence}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Analysis Sidebar */}
                <div className="lg:col-span-1">
                    {/* Video Info */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Video Information</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Resolution</p>
                                <p className="font-semibold text-gray-800">{video.resolution}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Frame Rate</p>
                                <p className="font-semibold text-gray-800">{video.fps} FPS</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Format</p>
                                <p className="font-semibold text-gray-800">{video.format}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sentiment Analysis */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">😊 Sentiment Analysis</h2>
                        <div className="text-center mb-4">
                            <div className="text-4xl font-bold text-green-600">{analysisResults.sentimentScore}%</div>
                            <p className="text-sm text-gray-600 mt-1">Positive Sentiment</p>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>😊 Happy</span>
                                    <span>{analysisResults.emotions.happy}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${analysisResults.emotions.happy}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>😐 Neutral</span>
                                    <span>{analysisResults.emotions.neutral}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${analysisResults.emotions.neutral}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>😲 Surprised</span>
                                    <span>{analysisResults.emotions.surprised}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${analysisResults.emotions.surprised}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Object Detection */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">🔍 Detected Objects</h2>
                        <div className="flex flex-wrap gap-2">
                            {analysisResults.keyObjects.map((object, index) => (
                                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                    {object}
                                </span>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">Faces Detected</p>
                            <p className="text-2xl font-bold text-gray-800">{analysisResults.faces}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
