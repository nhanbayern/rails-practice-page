import { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useQuizState } from '../hooks/useQuizContext';
import { calculateScore } from '../services/scoringService';
import { getQuizById } from '../data/quizzes';
import { Trophy, Clock, Target, ArrowRight, RotateCcw, Search } from 'lucide-react';
// @ts-ignore
import confetti from 'canvas-confetti';

export function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useQuizState();
  
  const quiz = getQuizById(id);

  // Redirect if not submitted
  useEffect(() => {
    if (!state.isSubmitted) {
      navigate(`/quiz/${id}/play`);
    }
  }, [state.isSubmitted, navigate, id]);

  const result = useMemo(() => {
    if (!quiz) return null;
    return calculateScore(quiz, state);
  }, [quiz, state]);

  useEffect(() => {
    if (result && result.passed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#b91c1c', '#ef4444', '#22C55E', '#FFD166']
      });
    }
  }, [result]);

  if (!quiz || !result) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const handleRetry = () => {
    dispatch({ type: 'RESET_QUIZ' });
    navigate(`/quiz/${id}`);
  };

  return (
    <div className="bg-red-50/30 min-h-full py-12">
      <div className="max-w-3xl mx-auto px-6">
        
        <div className="bg-white rounded-3xl p-10 border border-red-100 shadow-sm mb-8 text-center relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-3 ${result.passed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          
          <div className="mb-6 flex justify-center">
            {result.passed ? (
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <Trophy size={48} />
              </div>
            ) : (
              <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                <Target size={48} />
              </div>
            )}
          </div>
          
          <h1 className="text-6xl font-black text-slate-950 mb-4">{result.percentage}%</h1>
          <p className={`text-2xl font-bold mb-4 ${result.passed ? 'text-emerald-600' : 'text-amber-600'}`}>
            {result.passed ? 'You passed!' : 'Almost there! Keep trying.'}
          </p>
          <p className="text-lg text-slate-600 max-w-lg mx-auto bg-slate-50 py-3 px-6 rounded-xl">
            "{result.resultMessage}"
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-red-100 text-center">
            <span className="block text-slate-500 text-sm font-bold mb-1">Score</span>
            <span className="text-xl font-black text-slate-900">{result.earnedPoints} / {result.totalPoints}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-red-100 text-center">
            <span className="block text-slate-500 text-sm font-bold mb-1">Correct</span>
            <span className="text-xl font-black text-slate-900">{result.correctCount} / {result.totalQuestionsCount}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-red-100 text-center">
            <span className="block text-slate-500 text-sm font-bold mb-1">Time Spent</span>
            <span className="text-xl font-black text-slate-900 flex justify-center gap-1"><Clock size={20} className="text-red-600" /> {formatTime(state.timeSpent)}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-red-100 text-center">
            <span className="block text-slate-500 text-sm font-bold mb-1">Passing Mark</span>
            <span className="text-xl font-black text-slate-900">{quiz.passing_score}%</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to={`/quiz/${id}/answers`}
            className="px-8 py-4 bg-red-700 hover:bg-red-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-200 text-lg"
          >
            <Search size={20} />
            Review Answers
          </Link>
          <button 
            onClick={handleRetry}
            className="px-8 py-4 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors text-lg"
          >
            <RotateCcw size={20} />
            Retry Quiz
          </button>
          <Link 
            to="/library"
            className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors text-lg"
          >
            Library
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
