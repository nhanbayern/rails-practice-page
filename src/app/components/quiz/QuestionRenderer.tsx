import { useQuizState } from '../../hooks/useQuizContext';
import { SingleChoiceQuestion, MultipleChoiceQuestion, CaseStudyQuestion, QuizQuestion } from '../../types/quiz';
import { clsx } from 'clsx';
import { CheckCircle2, Circle, Info, XCircle } from 'lucide-react';
import { RichText } from './RichText';
import { AnswerableQuestion, isQuestionCorrect } from '../../utils/quizQuestions';
import { useQuizSounds } from '../../hooks/useQuizSounds';

interface QuestionProps<T> {
  question: T;
  questionNumber?: number;
  isSubmitted?: boolean;
}

function QuestionHeader({
  question,
  questionNumber,
  badge,
}: {
  question: SingleChoiceQuestion | MultipleChoiceQuestion;
  questionNumber?: number;
  badge?: string;
}) {
  return (
    <div className="mb-6">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm font-black text-sky-700">
        {questionNumber && <span>Question {questionNumber}</span>}
        {badge && <span className="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-700">{badge}</span>}
      </div>
      {question.title && <h2 className="mb-3 text-2xl font-black leading-tight text-slate-950">{question.title}</h2>}
      <RichText text={question.question} className="text-xl font-bold text-slate-950 md:text-2xl" />
    </div>
  );
}

export function SingleChoiceRenderer({ question, questionNumber }: QuestionProps<SingleChoiceQuestion>) {
  const { state, dispatch } = useQuizState();
  const { playSelect } = useQuizSounds();
  const selectedAnswer = state.answers[question.id] as string | undefined;
  const isSubmitted = state.submittedQuestionIds.includes(question.id);

  const handleSelect = (id: string) => {
    if (!isSubmitted) {
      dispatch({ type: 'SET_ANSWER', questionId: question.id, answer: id });
      playSelect();
    }
  };

  return (
    <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm md:p-8">
      <QuestionHeader question={question} questionNumber={questionNumber} />

      <div className="space-y-3.5">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={clsx(
                'flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all md:p-5',
                isSelected
                  ? getSubmittedOptionClass(isSubmitted, option.id === question.correct_answer, true)
                  : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50'
              )}
              disabled={isSubmitted}
            >
              <div className={clsx('mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-colors', isSelected ? 'text-sky-700' : 'text-slate-300')}>
                {isSelected ? <CheckCircle2 size={24} fill="currentColor" className="text-white" /> : <Circle size={24} />}
              </div>
              <RichText
                text={option.text}
                className={clsx('text-base font-medium md:text-lg', isSelected ? 'text-sky-950' : 'text-slate-700')}
              />
              {isSubmitted && option.id === question.correct_answer && (
                <span className="ml-auto rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">Correct</span>
              )}
            </button>
          );
        })}
      </div>
      <QuestionFeedback question={question} isSubmitted={isSubmitted} />
    </div>
  );
}

export function MultipleChoiceRenderer({ question, questionNumber }: QuestionProps<MultipleChoiceQuestion>) {
  const { state, dispatch } = useQuizState();
  const { playSelect } = useQuizSounds();
  const selectedAnswers = (state.answers[question.id] as string[]) || [];
  const isSubmitted = state.submittedQuestionIds.includes(question.id);

  const handleToggle = (id: string) => {
    if (!isSubmitted) {
      const newAnswers = selectedAnswers.includes(id)
        ? selectedAnswers.filter((answer) => answer !== id)
        : [...selectedAnswers, id];
      dispatch({ type: 'SET_ANSWER', questionId: question.id, answer: newAnswers });
      playSelect();
    }
  };

  return (
    <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm md:p-8">
      <QuestionHeader question={question} questionNumber={questionNumber} badge="Multiple Answers" />

      <div className="space-y-3.5">
        {question.options.map((option) => {
          const isSelected = selectedAnswers.includes(option.id);

          return (
            <button
              key={option.id}
              onClick={() => handleToggle(option.id)}
              className={clsx(
                'flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all md:p-5',
                isSelected
                  ? getSubmittedOptionClass(isSubmitted, question.correct_answers.includes(option.id), true)
                  : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50'
              )}
              disabled={isSubmitted}
            >
              <div
                className={clsx(
                  'mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                  isSelected ? 'border-sky-700 bg-sky-700 text-white' : 'border-slate-300 bg-white'
                )}
              >
                {isSelected && <CheckCircle2 size={16} />}
              </div>
              <RichText
                text={option.text}
                className={clsx('text-base font-medium md:text-lg', isSelected ? 'text-sky-950' : 'text-slate-700')}
              />
              {isSubmitted && question.correct_answers.includes(option.id) && (
                <span className="ml-auto rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">Correct</span>
              )}
            </button>
          );
        })}
      </div>
      <QuestionFeedback question={question} isSubmitted={isSubmitted} />
    </div>
  );
}

function getSubmittedOptionClass(isSubmitted: boolean, isCorrectOption: boolean, isSelected: boolean) {
  if (!isSubmitted) {
    return 'border-sky-400 bg-sky-50';
  }

  if (isCorrectOption) {
    return 'border-emerald-400 bg-emerald-50';
  }

  if (isSelected) {
    return 'border-red-300 bg-red-50 text-red-950';
  }

  return 'border-slate-200 bg-white';
}

function QuestionFeedback({ question, isSubmitted }: { question: AnswerableQuestion; isSubmitted: boolean }) {
  const { state } = useQuizState();
  if (!isSubmitted) return null;

  const answer = state.answers[question.id];
  const isCorrect = isQuestionCorrect(question, answer);

  return (
    <div
      className={clsx(
        'mt-6 rounded-2xl border p-5',
        isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
      )}
    >
      <div className={clsx('mb-3 flex items-center gap-2 font-extrabold', isCorrect ? 'text-emerald-700' : 'text-red-800')}>
        {isCorrect ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
        {isCorrect ? 'Correct' : 'Incorrect'}
      </div>
      {question.explanation && (
        <div className="flex items-start gap-3 rounded-xl bg-white/70 p-4 text-slate-700">
          <Info className="mt-0.5 flex-shrink-0 text-slate-500" size={18} />
          <div>
            <span className="mb-1 block text-sm font-bold text-slate-900">Explanation</span>
            <RichText text={question.explanation} />
          </div>
        </div>
      )}
    </div>
  );
}

export function CaseStudyRenderer({ question, questionNumber }: QuestionProps<CaseStudyQuestion>) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="lg:w-1/2">
        <div className="sticky top-6 rounded-2xl bg-slate-900 p-6 text-white shadow-lg md:p-8">
          <div className="mb-6">
            {questionNumber && <span className="mb-2 block text-sm font-bold text-amber-400">Case Study {questionNumber}</span>}
            <h2 className="mb-4 text-2xl font-bold">{question.title}</h2>
            <RichText text={question.case_context.scenario} inverted className="text-lg" />
          </div>

          {question.case_context.requirements && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">Requirements</h3>
              <ul className="space-y-2">
                {question.case_context.requirements.map((req, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                    <RichText text={req} inverted className="text-slate-200" />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {question.case_context.data_sample && (
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">Data Sample</h3>
              <pre className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-emerald-400">
                <code>{question.case_context.data_sample}</code>
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 lg:w-1/2">
        {question.sub_questions.map((subQ, index) => {
          if (subQ.type === 'single_choice') {
            return <SingleChoiceRenderer key={subQ.id} question={subQ} questionNumber={index + 1} />;
          }

          return <MultipleChoiceRenderer key={subQ.id} question={subQ} questionNumber={index + 1} />;
        })}
      </div>
    </div>
  );
}

export function QuestionRenderer({ question, index }: { question: QuizQuestion; index: number }) {
  switch (question.type) {
    case 'single_choice':
      return <SingleChoiceRenderer question={question} questionNumber={index + 1} />;
    case 'multiple_choice':
      return <MultipleChoiceRenderer question={question} questionNumber={index + 1} />;
    case 'case_study':
      return <CaseStudyRenderer question={question} questionNumber={index + 1} />;
    default:
      return <div>Unsupported question type</div>;
  }
}
