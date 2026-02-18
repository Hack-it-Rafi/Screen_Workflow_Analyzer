import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,0,0.05),transparent_50%)] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center text-green-400 mb-16">
          <h1 className="text-6xl font-bold mb-6 font-mono tracking-wider">
            <span className="text-green-500">&gt;_</span> VIDEO ANALYZER
          </h1>
          <p className="text-2xl mb-4 text-cyan-400 font-mono">[ SECURE AI-DRIVEN VIDEO ANALYSIS PLATFORM ]</p>
          <p className="text-xl text-green-300 font-mono">// Analyze, transcribe, and extract classified insights</p>
        </div>

        <div className="max-w-4xl mx-auto bg-black/80 border-2 border-gray-800 rounded-lg shadow-[0_0_30px_rgba(0,255,0,0.3)] p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center border border-cyan-500/30 p-6 rounded bg-gray-900/50 hover:border-cyan-500 transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2 text-green-400 font-mono">SCENE DETECTION</h3>
              <p className="text-gray-400 text-sm font-mono">Automatically detect and categorize scenes</p>
            </div>
            <div className="text-center border border-cyan-500/30 p-6 rounded bg-gray-900/50 hover:border-cyan-500 transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]">
              <div className="text-5xl mb-4">💻</div>
              <h3 className="text-xl font-bold mb-2 text-green-400 font-mono">TRANSCRIPTION</h3>
              <p className="text-gray-400 text-sm font-mono">Convert speech to text with high accuracy</p>
            </div>
            <div className="text-center border border-cyan-500/30 p-6 rounded bg-gray-900/50 hover:border-cyan-500 transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]">
              <div className="text-5xl mb-4">🔐</div>
              <h3 className="text-xl font-bold mb-2 text-green-400 font-mono">SENTIMENT ANALYSIS</h3>
              <p className="text-gray-400 text-sm font-mono">Understand emotions in your content</p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-green-600 text-black rounded font-semibold text-lg hover:bg-green-500 transition shadow-[0_0_20px_rgba(0,255,0,0.5)] border border-green-400 font-mono"
              >
                [ ACCESS DASHBOARD ] →
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-green-600 text-black rounded font-semibold text-lg hover:bg-green-500 transition shadow-[0_0_20px_rgba(0,255,0,0.5)] border border-green-400 font-mono"
                >
                  [ INITIALIZE ] →
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-transparent text-green-400 border-2 border-gray-800 rounded font-semibold text-lg hover:bg-green-500/10 transition font-mono"
                >
                  [ LOGIN ]
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-16 text-center text-green-400">
          <h2 className="text-3xl font-bold mb-8 font-mono text-cyan-400">== SYSTEM FEATURES ==</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-black/60 border border-gray-800/30 backdrop-blur-sm rounded-lg p-6 hover:border-gray-800 transition-all hover:shadow-[0_0_15px_rgba(0,255,0,0.4)]">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-semibold mb-2 text-green-400 font-mono">OBJECT DETECTION</h3>
              <p className="text-sm text-gray-400 font-mono">Identify targets in videos</p>
            </div>
            <div className="bg-black/60 border border-gray-800/30 backdrop-blur-sm rounded-lg p-6 hover:border-gray-800 transition-all hover:shadow-[0_0_15px_rgba(0,255,0,0.4)]">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold mb-2 text-green-400 font-mono">ANALYTICS</h3>
              <p className="text-sm text-gray-400 font-mono">Comprehensive analysis dashboard</p>
            </div>
            <div className="bg-black/60 border border-gray-800/30 backdrop-blur-sm rounded-lg p-6 hover:border-gray-800 transition-all hover:shadow-[0_0_15px_rgba(0,255,0,0.4)]">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2 text-green-400 font-mono">FAST PROCESSING</h3>
              <p className="text-sm text-gray-400 font-mono">Quick analysis with AI acceleration</p>
            </div>
            <div className="bg-black/60 border border-gray-800/30 backdrop-blur-sm rounded-lg p-6 hover:border-gray-800 transition-all hover:shadow-[0_0_15px_rgba(0,255,0,0.4)]">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-semibold mb-2 text-green-400 font-mono">SECURE</h3>
              <p className="text-sm text-gray-400 font-mono">Military-grade encryption</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
