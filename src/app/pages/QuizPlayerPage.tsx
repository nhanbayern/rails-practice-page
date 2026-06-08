import { useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { useQuizState } from '../hooks/useQuizContext';
import { useQuizTimer } from '../hooks/useQuizTimer';
import { SingleChoiceRenderer, MultipleChoiceRenderer } from '../components/quiz/QuestionRenderer';
import { getQuizById } from '../data/quizzes';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, Send } from 'lucide-react';
import { clsx } from 'clsx';
import { getQuizSteps, isAnswerPresent, isQuestionCorrect } from '../utils/quizQuestions';
import { RichText } from '../components/quiz/RichText';
import { quizPlayPath, quizResultPath } from '../routePaths';
import { useQuizSounds } from '../hooks/useQuizSounds';

export function QuizPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, dispatch } = useQuizState();
  const { playCorrect, playIncorrect, playNavigate, playComplete } = useQuizSounds();
  const appliedQuestionParamRef = useRef<string | null>(null);

  const quiz = getQuizById(id);
  const steps = quiz ? getQuizSteps(quiz.questions) : [];
  const questionParam = searchParams.get('question');

  useEffect(() => {
    if (quiz && !state.startTime) {
      dispatch({ type: 'START_QUIZ' });
    }
  }, [dispatch, quiz, state.startTime]);

  useEffect(() => {
    if (!id || !questionParam || appliedQuestionParamRef.current === questionParam || steps.length === 0) return;

    const targetIndex = steps.findIndex((step) => step.question.id === questionParam);
    appliedQuestionParamRef.current = questionParam;

    if (targetIndex >= 0 && targetIndex !== state.currentQuestionIndex) {
      dispatch({ type: 'SET_CURRENT_QUESTION', index: targetIndex });
    }

    navigate(quizPlayPath(id), { replace: true });
  }, [dispatch, id, navigate, questionParam, state.currentQuestionIndex, steps]);

  const handleTimeUp = () => {
    dispatch({ type: 'SUBMIT_QUIZ' });
    playIncorrect();
    if (id) navigate(quizResultPath(id));
  };

  const timeLimit = quiz?.time_limit || 0;
  const { timeLeft, isWarning, isDanger } = useQuizTimer(timeLimit, handleTimeUp);

  if (!quiz) return <div>Quiz not found</div>;

  const currentStepIndex = Math.min(state.currentQuestionIndex, steps.length - 1);
  const step = steps[currentStepIndex];
  const question = step.question;
  const isLastQuestion = currentStepIndex === steps.length - 1;
  const isCurrentSubmitted = state.submittedQuestionIds.includes(question.id);
  const hasAnswer = isAnswerPresent(state.answers[question.id]);

  const handleSubmitQuestion = () => {
    if (!hasAnswer || isCurrentSubmitted) return;
    const isCorrect = isQuestionCorrect(question, state.answers[question.id]);
    dispatch({ type: 'SUBMIT_QUESTION', questionId: question.id });
    if (isCorrect) {
      playCorrect();
    } else {
      playIncorrect();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (!isCurrentSubmitted) return;

    if (isLastQuestion) {
      dispatch({ type: 'SUBMIT_QUIZ' });
      playComplete();
      if (id) navigate(quizResultPath(id));
      return;
    }

    dispatch({ type: 'SET_CURRENT_QUESTION', index: currentStepIndex + 1 });
    playNavigate();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      dispatch({ type: 'SET_CURRENT_QUESTION', index: currentStepIndex - 1 });
      playNavigate();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="bg-sky-50/50 min-h-screen flex flex-col">
      <header className="bg-white border-b border-sky-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="font-bold text-slate-900 truncate pr-4">{quiz.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm font-medium text-slate-500">Question {currentStepIndex + 1} of {steps.length}</span>
              <span className="text-sm font-bold text-sky-700">{isCurrentSubmitted ? 'Reviewed' : 'Answer then submit'}</span>
            </div>
          </div>

          {quiz.ui_config.show_timer && (
            <div className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-bold font-mono text-lg transition-colors',
              isDanger ? 'bg-red-100 text-red-700 animate-pulse' :
              isWarning ? 'bg-amber-100 text-amber-700' :
              'bg-slate-100 text-slate-700'
            )}>
              <Clock size={20} />
              {formatTime(timeLeft)}
            </div>
          )}
        </div>

        {quiz.ui_config.show_progress_bar && (
          <div className="w-full bg-sky-50 h-1.5">
            <div
              className="bg-sky-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        {step.parentQuestion?.type === 'case_study' && (
          <section className="mb-6 rounded-2xl bg-slate-950 p-6 text-white shadow-lg">
            <span className="mb-2 block text-sm font-bold text-amber-400">Case Study {step.label}</span>
            <h2 className="mb-4 text-2xl font-bold">{step.parentQuestion.title}</h2>
            <RichText text={step.parentQuestion.case_context.scenario} inverted className="text-lg" />
            {step.parentQuestion.case_context.requirements && (
              <div className="mt-5">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">Requirements</h3>
                <ul className="space-y-2">
                  {step.parentQuestion.case_context.requirements.map((req, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                      <RichText text={req} inverted className="text-slate-200" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {step.parentQuestion.case_context.data_sample && (
              <pre className="mt-5 overflow-x-auto rounded-xl border border-slate-700 bg-slate-900 p-4 font-mono text-sm text-emerald-400">
                <code>{step.parentQuestion.case_context.data_sample}</code>
              </pre>
            )}
          </section>
        )}

        {question.type === 'single_choice' ? (
          <SingleChoiceRenderer question={question} questionNumber={currentStepIndex + 1} />
        ) : (
          <MultipleChoiceRenderer question={question} questionNumber={currentStepIndex + 1} />
        )}
      </main>

      <footer className="bg-white border-t border-sky-100 sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0 || !quiz.ui_config.allow_back_navigation}
            className="px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl flex items-center gap-2 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          {!isCurrentSubmitted ? (
            <button
              onClick={handleSubmitQuestion}
              disabled={!hasAnswer}
              className="px-8 py-3 font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors bg-sky-600 hover:bg-sky-700 text-white disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              Submit Question <Send size={20} />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className={clsx(
                'px-8 py-3 font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors',
                isLastQuestion ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-sky-600 hover:bg-sky-700 text-white'
              )}
            >
              {isLastQuestion ? (
                <>Finish & See Score <CheckCircle size={20} /></>
              ) : (
                <>Next Question <ChevronRight size={20} /></>
              )}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
