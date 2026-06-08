import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, Award, CheckCircle2, Clock, Eye, HelpCircle, Play, Target, Volume2 } from 'lucide-react';
import { getQuizById } from '../data/quizzes';
import { getQuizSteps } from '../utils/quizQuestions';
import { ROUTES, quizAnswerKeyPath, quizPlayPath } from '../routePaths';
import { useQuizSounds } from '../hooks/useQuizSounds';

export function QuizDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playSelect } = useQuizSounds();

  const quiz = getQuizById(id);
  const questionCount = quiz ? getQuizSteps(quiz.questions).length : 0;
  const isSnaLectureQuiz = Boolean(quiz?.quiz_id.startsWith('sna_is353_lecture_'));

  if (!quiz) {
    return (
      <div className="mx-auto mt-20 max-w-2xl p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold text-slate-800">Quiz not found</h1>
        <Link to={ROUTES.quizzes} className="font-bold text-sky-700 hover:underline">Return to quiz selection</Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-sky-50/50 p-5 md:p-8">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 font-bold text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-4 flex flex-wrap gap-2">
            {quiz.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-sky-100 px-3 py-1 text-sm font-black text-sky-800">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mb-4 text-4xl font-black leading-tight text-slate-950">{quiz.title}</h1>
          <p className="mb-7 text-lg leading-relaxed text-slate-600">{quiz.description}</p>

          <div className="mb-8 grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl bg-sky-50 p-4">
              <Clock className="mb-2 text-sky-600" size={22} />
              <span className="block text-xl font-black text-slate-950">{Math.round(quiz.time_limit / 60)} min</span>
              <span className="text-sm font-bold text-slate-500">Time limit</span>
            </div>
            <div className="rounded-2xl bg-sky-50 p-4">
              <HelpCircle className="mb-2 text-sky-600" size={22} />
              <span className="block text-xl font-black text-slate-950">{questionCount}</span>
              <span className="text-sm font-bold text-slate-500">Questions</span>
            </div>
            <div className="rounded-2xl bg-sky-50 p-4">
              <Target className="mb-2 text-sky-600" size={22} />
              <span className="block text-xl font-black text-slate-950">{quiz.passing_score}%</span>
              <span className="text-sm font-bold text-slate-500">Passing score</span>
            </div>
            <div className="rounded-2xl bg-sky-50 p-4">
              <Award className="mb-2 text-sky-600" size={22} />
              <span className="block text-xl font-black text-slate-950">{quiz.difficulty}</span>
              <span className="text-sm font-bold text-slate-500">Difficulty</span>
            </div>
          </div>

          <div className="mb-8 grid gap-3 md:grid-cols-3">
            <div className="flex items-start gap-3 rounded-2xl border border-sky-100 p-4">
              <CheckCircle2 className="mt-0.5 text-emerald-600" size={20} />
              <div>
                <span className="block font-black text-slate-950">Instant feedback</span>
                <span className="text-sm text-slate-600">Xem đúng/sai và giải thích sau từng câu.</span>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-sky-100 p-4">
              <Volume2 className="mt-0.5 text-sky-600" size={20} />
              <div>
                <span className="block font-black text-slate-950">Sound cues</span>
                <span className="text-sm text-slate-600">Âm thanh khi chọn, submit và hoàn thành.</span>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-sky-100 p-4">
              <HelpCircle className="mt-0.5 text-sky-600" size={20} />
              <div>
                <span className="block font-black text-slate-950">Answer review</span>
                <span className="text-sm text-slate-600">Review lại toàn bộ đáp án sau khi nộp.</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to={quizPlayPath(quiz.quiz_id)}
              onClick={playSelect}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-8 py-4 text-lg font-black text-white shadow-lg shadow-sky-100 transition-colors hover:bg-sky-700"
            >
              <Play size={20} fill="currentColor" />
              Start Quiz
            </Link>
            {isSnaLectureQuiz && (
              <Link
                to={quizAnswerKeyPath(quiz.quiz_id)}
                onClick={playSelect}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-sky-50 px-8 py-4 text-lg font-black text-sky-800 transition-colors hover:bg-sky-100"
              >
                <Eye size={20} />
                Xem đáp án
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
