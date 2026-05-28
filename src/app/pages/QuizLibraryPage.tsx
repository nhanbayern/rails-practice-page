import { useState } from 'react';
import { Link } from 'react-router';
import { Search, Filter, Play, Clock, HelpCircle } from 'lucide-react';
import { getLibraryQuizzes } from '../data/quizzes';
import { getQuizSteps } from '../utils/quizQuestions';

export function QuizLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const quizzes = getLibraryQuizzes();

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950">Rails Quiz Library</h1>
          <p className="text-slate-600 mt-2">Browse Rails Tutorial question sets, code-reading drills, and imported JSON quizzes.</p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by Rails topic, title, or tag..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-red-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow"
          />
        </div>
        <button className="px-6 py-3 bg-white border border-red-100 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
          <Filter size={20} />
          Filters
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <div key={quiz.quiz_id} className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all flex flex-col">
            <div className="mb-4 flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {quiz.tags.map((tag) => (
                  <span key={tag} className="inline-block px-3 py-1 bg-red-50 text-red-800 text-xs font-bold rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-2">{quiz.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{quiz.description}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6 font-medium">
              <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md"><HelpCircle size={16} /> {getQuizSteps(quiz.questions).length} Qs</span>
              <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md"><Clock size={16} /> {Math.round(quiz.time_limit / 60)} min</span>
              <span className="bg-slate-50 px-2 py-1 rounded-md">{quiz.difficulty}</span>
            </div>
            <Link
              to={`/quiz/${quiz.quiz_id}`}
              className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors mt-auto shadow-sm shadow-red-100"
            >
              <Play size={18} fill="currentColor" />
              Start Quiz
            </Link>
          </div>
        ))}
        {filteredQuizzes.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-500">
            <p className="text-lg">No quizzes found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
