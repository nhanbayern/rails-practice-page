import { useState } from 'react';
import { Link } from 'react-router';
import { BookOpen, Clock, Eye, HelpCircle, Play, Search } from 'lucide-react';
import { getLibraryQuizzes, getSnaLectureQuizzes } from '../data/quizzes';
import { getQuizSteps } from '../utils/quizQuestions';
import { quizAnswerKeyPath, quizPath } from '../routePaths';
import { useQuizSounds } from '../hooks/useQuizSounds';

export function QuizLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const { playSelect } = useQuizSounds();

  const quizzes = getLibraryQuizzes();
  const snaLectureQuizzes = getSnaLectureQuizzes();
  const difficulties = Array.from(new Set([...quizzes, ...snaLectureQuizzes].map((quiz) => quiz.difficulty)));

  const matchesFilters = (quiz: (typeof quizzes)[number]) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query ||
      quiz.title.toLowerCase().includes(query) ||
      quiz.description.toLowerCase().includes(query) ||
      quiz.tags.some((tag) => tag.toLowerCase().includes(query));
    const matchesDifficulty = difficultyFilter === 'all' || quiz.difficulty === difficultyFilter;

    return matchesSearch && matchesDifficulty;
  };

  const filteredSnaLectures = snaLectureQuizzes.filter(matchesFilters);
  const filteredQuizzes = quizzes.filter(matchesFilters);

  return (
    <div className="min-h-full bg-sky-50/50 p-5 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7">
          <div className="mb-3 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-800">
            Online Quiz Learning
          </div>
          <h1 className="text-3xl font-black text-slate-950">Chọn quiz để bắt đầu</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Chọn một bộ câu hỏi, làm bài với timer, feedback tức thì và review đáp án sau khi hoàn thành.
          </p>
        </div>

        <div className="mb-7 grid gap-3 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-sky-100 bg-sky-50/60 py-3 pl-12 pr-4 text-slate-900 outline-none transition-shadow focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
            />
          </label>

          <select
            value={difficultyFilter}
            onChange={(event) => setDifficultyFilter(event.target.value)}
            className="rounded-xl border border-sky-100 bg-sky-50/60 px-4 py-3 font-bold text-slate-700 outline-none transition-shadow focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
          >
            <option value="all">All difficulties</option>
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>{difficulty}</option>
            ))}
          </select>
        </div>

        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="text-sky-700" size={20} />
            <h2 className="text-xl font-black text-slate-950">SNA questions theo Lecture</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
            {filteredSnaLectures.map((quiz) => {
              const questionCount = getQuizSteps(quiz.questions).length;
              const lectureTitle = quiz.title.replace('SNA IS353 - ', '');

              return (
                <article
                  key={quiz.quiz_id}
                  className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
                >
                  <span className="mb-3 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-800">
                    {quiz.tags[2]}
                  </span>
                  <h3 className="mb-3 line-clamp-2 min-h-14 text-lg font-black leading-snug text-slate-950">
                    {lectureTitle}
                  </h3>
                  <div className="mb-4 text-sm font-bold text-slate-600">
                    <span>{questionCount} câu</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={quizPath(quiz.quiz_id)}
                      onClick={playSelect}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-3 py-2.5 text-sm font-black text-white transition-colors hover:bg-sky-700"
                    >
                      <Play size={16} fill="currentColor" />
                      Practice
                    </Link>
                    <Link
                      to={quizAnswerKeyPath(quiz.quiz_id)}
                      onClick={playSelect}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2.5 text-sm font-black text-sky-800 transition-colors hover:bg-sky-100"
                    >
                      <Eye size={16} />
                      Xem đáp án
                    </Link>
                  </div>
                </article>
              );
            })}

            {filteredSnaLectures.length === 0 && (
              <div className="rounded-2xl border border-sky-100 bg-white p-6 text-sm font-bold text-slate-500 shadow-sm md:col-span-3 xl:col-span-4">
                Không có Lecture SNA phù hợp.
              </div>
            )}
          </div>
        </section>

        <div className="mb-4">
          <h2 className="text-xl font-black text-slate-950">Tất cả quiz</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredQuizzes.map((quiz) => {
            const questionCount = getQuizSteps(quiz.questions).length;
            const primaryTag = quiz.tags[0] || quiz.difficulty;

            return (
              <article key={quiz.quiz_id} className="flex min-h-[280px] flex-col rounded-2xl border border-sky-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md">
                <div className="mb-4">
                  <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-800">
                    {primaryTag}
                  </span>
                </div>

                <h2 className="mb-3 text-xl font-black leading-snug text-slate-950">{quiz.title}</h2>
                <p className="line-clamp-3 text-sm leading-6 text-slate-600">{quiz.description}</p>

                <div className="mt-auto pt-6">
                  <div className="mb-4 flex flex-wrap gap-3 text-sm font-bold text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <HelpCircle size={16} className="text-sky-600" />
                      {questionCount} câu
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={16} className="text-sky-600" />
                      {Math.round(quiz.time_limit / 60)} phút
                    </span>
                  </div>

                  <Link
                    to={quizPath(quiz.quiz_id)}
                    onClick={playSelect}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 py-3 font-black text-white shadow-sm shadow-sky-100 transition-colors hover:bg-sky-700"
                  >
                    <Play size={18} fill="currentColor" />
                    Bắt đầu
                  </Link>
                </div>
              </article>
            );
          })}

          {filteredQuizzes.length === 0 && (
            <div className="col-span-full rounded-2xl border border-sky-100 bg-white py-16 text-center text-slate-500 shadow-sm">
              <p className="text-lg font-bold">Không có quiz phù hợp.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
