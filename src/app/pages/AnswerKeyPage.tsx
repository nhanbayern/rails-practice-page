import { Link, useParams } from 'react-router';
import type { ReactNode } from 'react';
import { ArrowLeft, CheckCircle2, Info } from 'lucide-react';
import { getQuizById } from '../data/quizzes';
import { CaseStudyQuestion, MultipleChoiceQuestion, SingleChoiceQuestion } from '../types/quiz';
import { RichText } from '../components/quiz/RichText';
import { ROUTES, quizPath } from '../routePaths';

function getOptionLabel(optionId: string) {
  return optionId.toUpperCase();
}

function AnswerBlock({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
      <div className="mb-2 flex items-center gap-2 font-black text-emerald-700">
        <CheckCircle2 size={20} />
        Đáp án đúng
      </div>
      <div className="space-y-2 text-slate-800">{children}</div>
    </div>
  );
}

function ExplanationBlock({ explanation }: { explanation?: string }) {
  if (!explanation) return null;

  return (
    <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
      <div className="mb-2 flex items-center gap-2 font-black text-sky-800">
        <Info size={18} />
        Giải thích
      </div>
      <RichText text={explanation} className="text-slate-700" />
    </div>
  );
}

function SingleChoiceAnswer({ question, number }: { question: SingleChoiceQuestion; number: string }) {
  const correctOption = question.options.find((option) => option.id === question.correct_answer);

  return (
    <article className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-4 text-sm font-black text-sky-700">Câu {number}</div>
      <RichText text={question.question} className="mb-6 text-xl font-bold text-slate-950" />

      <div className="space-y-4">
        <AnswerBlock>
          <div className="flex items-start gap-3">
            <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-emerald-600 px-2 text-sm font-black text-white">
              {getOptionLabel(question.correct_answer)}
            </span>
            <RichText text={correctOption?.text || question.correct_answer} className="font-bold" />
          </div>
        </AnswerBlock>
        <ExplanationBlock explanation={question.explanation} />
      </div>
    </article>
  );
}

function MultipleChoiceAnswer({ question, number }: { question: MultipleChoiceQuestion; number: string }) {
  const correctOptions = question.options.filter((option) => question.correct_answers.includes(option.id));

  return (
    <article className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-4 text-sm font-black text-sky-700">Câu {number}</div>
      <RichText text={question.question} className="mb-6 text-xl font-bold text-slate-950" />

      <div className="space-y-4">
        <AnswerBlock>
          {correctOptions.map((option) => (
            <div key={option.id} className="flex items-start gap-3">
              <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-emerald-600 px-2 text-sm font-black text-white">
                {getOptionLabel(option.id)}
              </span>
              <RichText text={option.text} className="font-bold" />
            </div>
          ))}
        </AnswerBlock>
        <ExplanationBlock explanation={question.explanation} />
      </div>
    </article>
  );
}

function CaseStudyAnswer({ question, index }: { question: CaseStudyQuestion; index: number }) {
  return (
    <section className="space-y-5">
      <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm md:p-8">
        <div className="mb-2 text-sm font-black text-sky-300">Case Study {index + 1}</div>
        <h2 className="mb-4 text-2xl font-black">{question.title}</h2>
        <RichText text={question.case_context.scenario} inverted />
      </div>

      {question.sub_questions.map((subQuestion, subIndex) => {
        const number = `${index + 1}.${subIndex + 1}`;
        if (subQuestion.type === 'single_choice') {
          return <SingleChoiceAnswer key={subQuestion.id} question={subQuestion} number={number} />;
        }

        return <MultipleChoiceAnswer key={subQuestion.id} question={subQuestion} number={number} />;
      })}
    </section>
  );
}

export function AnswerKeyPage() {
  const { id } = useParams();
  const quiz = getQuizById(id);

  if (!quiz) {
    return (
      <div className="mx-auto mt-20 max-w-2xl p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold text-slate-800">Không tìm thấy quiz</h1>
        <Link to={ROUTES.quizzes} className="font-bold text-sky-700 hover:underline">Quay lại chọn quiz</Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-sky-50/50 py-10">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <div className="mb-8">
          <Link to={quizPath(quiz.quiz_id)} className="mb-6 inline-flex items-center gap-2 font-bold text-slate-500 transition-colors hover:text-slate-900">
            <ArrowLeft size={16} />
            Quay lại quiz
          </Link>
          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-3 inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-black text-sky-800">
              Bảng đáp án
            </div>
            <h1 className="text-3xl font-black leading-tight text-slate-950">{quiz.title}</h1>
            <p className="mt-2 text-slate-600">Toàn bộ đáp án đúng và giải thích cho bộ câu hỏi này.</p>
          </div>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((question, index) => {
            const number = `${index + 1}`;
            if (question.type === 'single_choice') {
              return <SingleChoiceAnswer key={question.id} question={question} number={number} />;
            }

            if (question.type === 'multiple_choice') {
              return <MultipleChoiceAnswer key={question.id} question={question} number={number} />;
            }

            return <CaseStudyAnswer key={question.id} question={question} index={index} />;
          })}
        </div>
      </div>
    </div>
  );
}
