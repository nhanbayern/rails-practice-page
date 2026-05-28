import { Link } from 'react-router';
import { BookOpen, Sparkles, Brain, TerminalSquare } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-red-50/40">
      <header className="px-6 py-4 flex items-center justify-between border-b border-red-100 max-w-7xl mx-auto w-full">
        <div className="flex items-center text-red-700 font-bold text-xl">
          <img src="/app-avatar.png" alt="Rails" className="h-10 w-24 shrink-0 object-contain" />
        </div>
        <div className="flex gap-4">
          <Link to="/dashboard" className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Log in
          </Link>
          <Link to="/dashboard" className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-medium rounded-full transition-colors">
            Get Started
          </Link>
        </div>
      </header>

      <main>
        <section className="py-16 px-6 max-w-6xl mx-auto grid lg:grid-cols-[1fr_420px] gap-10 items-center">
          <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold mb-6">
            <Sparkles size={16} /> Rails-focused practice workspace
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-950 tracking-tight leading-tight mb-6">
            Luyện tập Rails thực chiến
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl">
            Practice Rails routing, controllers, Active Record, authentication, testing, and code-reading questions with a focused quiz flow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/library" className="px-8 py-4 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-200 text-lg">
              Start Learning
            </Link>
            <Link to="/live-coding" className="px-8 py-4 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl transition-all text-lg flex items-center justify-center gap-2">
              <TerminalSquare size={20} />
              Live Coding
            </Link>
          </div>
          </div>
          <div className="rounded-2xl border border-red-100 bg-slate-950 p-5 text-slate-100 shadow-xl shadow-red-100">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-red-300">
              <img src="/app-avatar.png" alt="" className="h-5 w-12 object-contain" /> Rails route reading
            </div>
            <pre className="overflow-x-auto rounded-xl bg-black/40 p-4 text-sm leading-relaxed text-red-50"><code>{`resources :users do
  member do
    get :following, :followers
  end
end`}</code></pre>
            <div className="mt-4 rounded-xl bg-white/5 p-4 text-sm text-slate-300">
              Question previews render code blocks, explanations, and answer review with syntax-friendly formatting.
            </div>
          </div>
        </section>

        <section className="py-16 bg-white border-t border-red-100">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Built for Rails study sessions</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100">
                <div className="w-12 h-12 bg-red-100 text-red-700 rounded-xl flex items-center justify-center mb-6">
                  <TerminalSquare size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Rails Console Live Coding</h3>
                <p className="text-slate-600">
                  Practice methods, strings, hashes, ranges, and Rails-style logic with focused console-ready exercises.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                  <Brain size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Case Study Questions</h3>
                <p className="text-slate-600">
                  Beyond multiple choice. Dive deep with complex scenario-based questions that test real-world knowledge.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Learn from Mistakes</h3>
                <p className="text-slate-600">
                  Detailed explanations after submission help you understand why answers are correct, cementing your knowledge.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
