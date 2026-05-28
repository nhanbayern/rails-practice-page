import { useParams, Link, useNavigate } from 'react-router';
import { Play, Clock, HelpCircle, ArrowLeft, Target, Award } from 'lucide-react';
import { getQuizById } from '../data/quizzes';
import { getQuizSteps } from '../utils/quizQuestions';

export function QuizDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const quiz = getQuizById(id);
  const questionCount = quiz ? getQuizSteps(quiz.questions).length : 0;

  if (!quiz) {
    return (
      <div className="p-8 text-center max-w-2xl mx-auto mt-20">
        <h1 className="text-2xl font-bold mb-4 text-slate-800">Quiz not found</h1>
        <Link to="/library" className="text-red-700 font-medium hover:underline">Return to Library</Link>
      </div>
    );
  }

  return (
    <div className="bg-red-50/30 min-h-full">
      <div className="bg-white border-b border-red-100 py-6 px-8">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {quiz.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-red-50 text-red-800 text-sm font-bold rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl font-extrabold text-slate-950 mb-4">{quiz.title}</h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">{quiz.description}</p>
          
          <div className="flex flex-wrap items-center gap-6">
            <Link 
              to={`/quiz/${quiz.quiz_id}/play`}
              className="px-8 py-4 bg-red-700 hover:bg-red-800 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-red-200 transition-all text-lg"
            >
              <Play size={20} fill="currentColor" />
              Start Quiz
            </Link>
            <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
              <span className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl"><Clock className="text-red-700" size={18} /> {Math.round(quiz.time_limit/60)} mins</span>
              <span className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl"><HelpCircle className="text-slate-500" size={18} /> {questionCount} questions</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-8 py-12 grid md:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="text-amber-500" size={24} />
            Quiz Overview
          </h2>
          <ul className="space-y-4">
            <li className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Difficulty</span>
              <span className="font-bold text-slate-900">{quiz.difficulty}</span>
            </li>
            <li className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Passing Score</span>
              <span className="font-bold text-slate-900">{quiz.passing_score}%</span>
            </li>
            <li className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Score Type</span>
              <span className="font-bold text-slate-900 capitalize">{quiz.grading.score_type}</span>
            </li>
          </ul>
        </section>
        
        <section className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="text-emerald-500" size={24} />
            What to expect
          </h2>
          <ul className="space-y-4 text-slate-600">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
              Includes a mix of single choice, multiple choice, and case study questions.
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
              Review your answers before final submission.
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
              Detailed explanations provided after submission.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
