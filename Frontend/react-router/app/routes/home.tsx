import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-500 via-blue-500 to-indigo-600">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <h1 className="text-6xl font-bold mb-6">📹 Video Analyzer</h1>
          <p className="text-2xl mb-4">Powerful AI-driven video analysis platform</p>
          <p className="text-xl opacity-90">Analyze, transcribe, and extract insights from your videos</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-5xl mb-4">🎬</div>
              <h3 className="text-xl font-bold mb-2">Scene Detection</h3>
              <p className="text-gray-600">Automatically detect and categorize scenes in your videos</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2">Transcription</h3>
              <p className="text-gray-600">Convert speech to text with high accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">😊</div>
              <h3 className="text-xl font-bold mb-2">Sentiment Analysis</h3>
              <p className="text-gray-600">Understand emotions and sentiment in your content</p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-linear-to-br from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-linear-to-br from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
                >
                  Get Started →
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white text-purple-600 border-2 border-purple-600 rounded-lg font-semibold text-lg hover:bg-purple-50 transition"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-semibold mb-2">Object Detection</h3>
              <p className="text-sm opacity-90">Identify objects and people in videos</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-sm opacity-90">Comprehensive video analytics dashboard</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2">Fast Processing</h3>
              <p className="text-sm opacity-90">Quick analysis with AI acceleration</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold mb-2">Secure</h3>
              <p className="text-sm opacity-90">Enterprise-grade security and privacy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
