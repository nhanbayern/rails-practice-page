import { Link } from 'react-router';
import { Play, Clock, HelpCircle, Trophy, BookOpen, TerminalSquare } from 'lucide-react';
import { bundledQuizzes } from '../data/quizzes';
import { getQuizSteps } from '../utils/quizQuestions';
import { railsLiveCodingChallenges } from '../data/railsLiveCodingTests';

export function DashboardPage() {
  const recentQuizzes = bundledQuizzes.slice(0, 3).map((quiz, index) => ({
    ...quiz,
    progress: index === 0 ? 45 : 0,
  }));

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-800 mb-4">
          <img src="/app-avatar.png" alt="" className="h-5 w-12 object-contain" /> Không gian luyện tập Rails
        </div>
        <h1 className="text-3xl font-extrabold text-slate-950">Luyện tập Rails thực chiến</h1>
        <p className="text-slate-600 mt-2">Pick up a quiz, read code carefully, and review explanations after each attempt.</p>
      </header>

      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Clock className="text-red-700" size={24} />
          Continue Learning
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentQuizzes.map((quiz) => (
            <div key={quiz.quiz_id} className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-50">
                <div className="h-full bg-red-600" style={{ width: `${quiz.progress}%` }} />
              </div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full mb-3">
                  {quiz.tags[0]}
                </span>
                <h3 className="text-lg font-bold text-slate-950 mb-1">{quiz.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{quiz.description}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-6 font-medium">
                <span className="flex items-center gap-1"><HelpCircle size={16} /> {getQuizSteps(quiz.questions).length} Qs</span>
                <span className="flex items-center gap-1"><Clock size={16} /> {Math.round(quiz.time_limit / 60)} min</span>
              </div>
              <Link
                to={`/quiz/${quiz.quiz_id}`}
                className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Play size={18} fill="currentColor" />
                Resume Quiz
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="text-amber-500" size={24} />
          Recommended Practice
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all flex flex-col h-full">
            <div className="mb-4 flex-1">
              <div className="w-12 h-12 bg-red-100 text-red-700 rounded-xl flex items-center justify-center mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-1">Rails Code Reading</h3>
              <p className="text-sm text-slate-500 line-clamp-2">Practice routes, controller flow, model behavior, and debugging scenarios.</p>
            </div>
            <Link
              to="/library"
              className="w-full py-3 bg-slate-100 hover:bg-red-50 text-slate-800 font-bold rounded-xl text-center transition-colors mt-auto"
            >
              View in Library
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all flex flex-col h-full">
            <div className="mb-4 flex-1">
              <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center mb-4">
                <TerminalSquare size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-1">Rails Console Live Coding</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{railsLiveCodingChallenges.length} bài LeetCode-style để test method, xử lý tình huống, String, Hash và Range.</p>
            </div>
            <Link
              to="/live-coding"
              className="w-full py-3 bg-slate-100 hover:bg-red-50 text-slate-800 font-bold rounded-xl text-center transition-colors mt-auto"
            >
              Open Live Coding
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
