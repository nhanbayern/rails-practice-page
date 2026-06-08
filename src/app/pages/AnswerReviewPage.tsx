import { useParams, Link } from 'react-router';
import { useQuizState } from '../hooks/useQuizContext';
import { getQuizById } from '../data/quizzes';
import { CheckCircle2, XCircle, ArrowLeft, Info } from 'lucide-react';
import { SingleChoiceQuestion, MultipleChoiceQuestion, CaseStudyQuestion, QuizQuestion } from '../types/quiz';
import { clsx } from 'clsx';
import { RichText } from '../components/quiz/RichText';
import { quizResultPath } from '../routePaths';

export function AnswerReviewPage() {
  const { id } = useParams();
  const { state } = useQuizState();
  
  const quiz = getQuizById(id);

  if (!quiz) return <div>Quiz not found</div>;

  const renderSingleChoice = (q: SingleChoiceQuestion, num: string) => {
    const userAnswer = state.answers[q.id] as string;
    const isCorrect = userAnswer === q.correct_answer;

    return (
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mb-8" key={q.id}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            <span className="text-sm font-bold text-sky-700 mb-2 block">{num}.</span>
            <RichText text={q.question} className="text-xl font-bold text-slate-900" />
          </div>
          {isCorrect ? (
            <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><CheckCircle2 size={16}/> Correct</div>
          ) : (
          <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><XCircle size={16}/> Incorrect</div>
          )}
        </div>
        
        <div className="space-y-3 mb-6">
          {q.options.map(opt => {
            const isUserChoice = userAnswer === opt.id;
            const isActualCorrect = q.correct_answer === opt.id;
            
            return (
              <div key={opt.id} className={clsx(
                "p-4 rounded-xl border-2 flex items-center gap-3",
                isActualCorrect && "bg-emerald-50 border-emerald-500",
                !isActualCorrect && isUserChoice && "bg-red-50 border-red-300 text-red-900",
                !isActualCorrect && !isUserChoice && "border-slate-100 text-slate-500"
              )}>
                {isActualCorrect ? <CheckCircle2 className="text-emerald-500" /> : isUserChoice ? <XCircle className="text-red-500" /> : <div className="w-6 h-6 rounded-full border-2 border-slate-200" />}
                <RichText text={opt.text} className="font-medium text-lg" />
                {isActualCorrect && <span className="ml-auto text-emerald-600 text-sm font-bold">Correct Answer</span>}
                {!isActualCorrect && isUserChoice && <span className="ml-auto text-red-500 text-sm font-bold">Your Answer</span>}
              </div>
            );
          })}
        </div>

        {q.explanation && (
          <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-100 flex items-start gap-3">
            <Info className="text-sky-700 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <span className="font-bold text-sky-950 block mb-1">Explanation</span>
              <RichText text={q.explanation} className="text-slate-700" />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMultipleChoice = (q: MultipleChoiceQuestion, num: string) => {
    const userAnswers = (state.answers[q.id] as string[]) || [];
    const isCorrect = q.correct_answers.length === userAnswers.length && q.correct_answers.every(a => userAnswers.includes(a));

    return (
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mb-8" key={q.id}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            <span className="text-sm font-bold text-sky-700 mb-2 block">{num}.</span>
            <RichText text={q.question} className="text-xl font-bold text-slate-900" />
          </div>
          {isCorrect ? (
            <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><CheckCircle2 size={16}/> Correct</div>
          ) : (
            <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><XCircle size={16}/> Incorrect</div>
          )}
        </div>
        
        <div className="space-y-3 mb-6">
          {q.options.map(opt => {
            const isUserChoice = userAnswers.includes(opt.id);
            const isActualCorrect = q.correct_answers.includes(opt.id);
            
            return (
              <div key={opt.id} className={clsx(
                "p-4 rounded-xl border-2 flex items-center gap-3",
                isActualCorrect && "bg-emerald-50 border-emerald-500",
                !isActualCorrect && isUserChoice && "bg-red-50 border-red-300 text-red-900",
                !isActualCorrect && !isUserChoice && "border-slate-100 text-slate-500"
              )}>
                {isActualCorrect ? <CheckCircle2 className="text-emerald-500" /> : isUserChoice ? <XCircle className="text-red-500" /> : <div className="w-6 h-6 rounded border-2 border-slate-200" />}
                <RichText text={opt.text} className="font-medium text-lg" />
                {isActualCorrect && <span className="ml-auto text-emerald-600 text-sm font-bold">Correct Answer</span>}
                {!isActualCorrect && isUserChoice && <span className="ml-auto text-red-500 text-sm font-bold">Your Answer</span>}
              </div>
            );
          })}
        </div>

        {q.explanation && (
          <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-100 flex items-start gap-3">
            <Info className="text-sky-700 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <span className="font-bold text-sky-950 block mb-1">Explanation</span>
              <RichText text={q.explanation} className="text-slate-700" />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCaseStudy = (q: CaseStudyQuestion, index: number) => {
    return (
      <div className="mb-12" key={q.id}>
        <div className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl shadow-md mb-6">
          <span className="text-sm font-bold text-amber-400 mb-2 block">Case Study {index + 1}</span>
          <h2 className="text-2xl font-bold mb-4">{q.title}</h2>
          <RichText text={q.case_context.scenario} inverted className="text-slate-300 text-lg" />
        </div>
        
        <div className="pl-0 md:pl-8 border-l-4 border-slate-200 space-y-8">
          {q.sub_questions.map((subQ, subIndex) => {
            const num = `${index + 1}.${subIndex + 1}`;
            if (subQ.type === 'single_choice') return renderSingleChoice(subQ, num);
            if (subQ.type === 'multiple_choice') return renderMultipleChoice(subQ, num);
            return null;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-sky-50/50 min-h-full py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <Link to={id ? quizResultPath(id) : '#'} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Results
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900">Answer Review</h1>
          <p className="text-slate-600 mt-2">See what you got right and learn from your mistakes.</p>
        </div>

        <div className="space-y-2">
          {quiz.questions.map((q, index) => {
            const num = `${index + 1}`;
            if (q.type === 'single_choice') return renderSingleChoice(q as SingleChoiceQuestion, num);
            if (q.type === 'multiple_choice') return renderMultipleChoice(q as MultipleChoiceQuestion, num);
            if (q.type === 'case_study') return renderCaseStudy(q as CaseStudyQuestion, index);
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
