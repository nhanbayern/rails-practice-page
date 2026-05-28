import { useMemo, useState } from 'react';
import { Braces, CheckCircle2, Clock3, ListChecks, Search, TerminalSquare } from 'lucide-react';
import { railsLiveCodingChallenges, liveCodingTopics, LiveCodingChallenge } from '../data/railsLiveCodingTests';
import { RichText } from '../components/quiz/RichText';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const difficultyOptions = ['Tất cả', 'Dễ', 'Trung bình'] as const;

export function LiveCodingTestsPage() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('Tất cả');
  const [difficulty, setDifficulty] = useState<(typeof difficultyOptions)[number]>('Tất cả');
  const [selectedId, setSelectedId] = useState(railsLiveCodingChallenges[0]?.id || '');

  const filteredChallenges = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return railsLiveCodingChallenges.filter((challenge) => {
      const matchesQuery =
        !normalizedQuery ||
        challenge.title.toLowerCase().includes(normalizedQuery) ||
        challenge.question.toLowerCase().includes(normalizedQuery) ||
        challenge.methodSignature.toLowerCase().includes(normalizedQuery) ||
        challenge.topic.toLowerCase().includes(normalizedQuery);
      const matchesTopic = topic === 'Tất cả' || challenge.topic === topic;
      const matchesDifficulty = difficulty === 'Tất cả' || challenge.difficulty === difficulty;

      return matchesQuery && matchesTopic && matchesDifficulty;
    });
  }, [difficulty, query, topic]);

  const activeChallenge =
    filteredChallenges.find((challenge) => challenge.id === selectedId) ||
    filteredChallenges[0] ||
    railsLiveCodingChallenges[0];

  return (
    <div className="min-h-full bg-[linear-gradient(180deg,#fff7f7_0%,#ffffff_34%,#fffafa_100%)]">
      <div className="mx-auto flex w-full max-w-[1700px] flex-col gap-6 p-4 lg:p-8">
        <header className="border-b border-red-100 bg-white px-1 pb-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-800">
            <TerminalSquare size={16} />
            Live coding test
          </div>
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                Rails Console Live Coding
              </h1>
              <p className="mt-2 max-w-5xl text-base leading-relaxed text-slate-600">
                {railsLiveCodingChallenges.length} bài dạng LeetCode tiếng Việt, gồm 40 bài nền tảng và 40 bài vận dụng
                cho String, Hash, Range. Mỗi bài chỉ cần paste method hoặc class vào rails console.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <Metric label="Bài" value={railsLiveCodingChallenges.length.toString()} />
              <Metric label="Dễ" value={railsLiveCodingChallenges.filter((item) => item.difficulty === 'Dễ').length.toString()} />
              <Metric
                label="Trung bình"
                value={railsLiveCodingChallenges.filter((item) => item.difficulty === 'Trung bình').length.toString()}
              />
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[440px_minmax(0,1fr)]">
          <aside className="min-h-[720px] rounded-2xl border border-red-100 bg-white shadow-sm">
            <div className="border-b border-red-100 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Tìm theo title, method, topic..."
                  className="w-full rounded-xl border border-red-100 bg-white py-3 pl-10 pr-3 text-sm font-medium outline-none transition-shadow focus:border-red-300 focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <FilterSelect
                  label="Độ khó"
                  value={difficulty}
                  options={[...difficultyOptions]}
                  tone="red"
                  onChange={(value) => setDifficulty(value as (typeof difficultyOptions)[number])}
                />
                <FilterSelect
                  label="Chủ đề"
                  value={topic}
                  options={['Tất cả', ...liveCodingTopics]}
                  tone="slate"
                  onChange={setTopic}
                />
              </div>
            </div>

            <div className="max-h-[640px] overflow-auto p-3">
              {filteredChallenges.map((challenge, index) => (
                <button
                  key={challenge.id}
                  onClick={() => setSelectedId(challenge.id)}
                  className={`mb-2 w-full rounded-xl border p-4 text-left transition-all ${
                    activeChallenge.id === challenge.id
                      ? 'border-red-300 bg-red-50 shadow-sm'
                      : 'border-slate-100 bg-white hover:border-red-200 hover:bg-red-50/50'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-xs font-black uppercase tracking-wide text-red-700">
                      {String(index + 1).padStart(2, '0')} · {challenge.topic}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-600">
                      {challenge.difficulty}
                    </span>
                  </div>
                  <h2 className="line-clamp-2 text-lg font-extrabold leading-snug text-slate-950">{challenge.title}</h2>
                  <code className="mt-2 block rounded-lg bg-slate-950 px-3 py-2 font-mono text-[11px] font-bold leading-relaxed text-red-50 [overflow-wrap:anywhere]">
                    {challenge.methodSignature}
                  </code>
                </button>
              ))}

              {filteredChallenges.length === 0 && (
                <div className="py-16 text-center text-sm font-medium text-slate-500">Không tìm thấy bài phù hợp.</div>
              )}
            </div>
          </aside>

          <main className="min-w-0 rounded-2xl border border-red-100 bg-white shadow-sm">
            <ChallengeDetail challenge={activeChallenge} index={railsLiveCodingChallenges.findIndex((item) => item.id === activeChallenge.id) + 1} />
          </main>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-24 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
      <div className="text-2xl font-black text-red-800">{value}</div>
      <div className="text-xs font-bold text-red-700">{label}</div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  tone,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  tone: 'red' | 'slate';
  onChange: (value: string) => void;
}) {
  const activeClass =
    tone === 'red'
      ? 'border-red-200 bg-red-50 text-red-900 focus:ring-red-100'
      : 'border-slate-200 bg-slate-50 text-slate-900 focus:ring-slate-100';

  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={`h-12 rounded-xl px-4 text-left text-sm font-black shadow-sm ${activeClass}`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-72 rounded-xl border-slate-200 bg-white p-1 shadow-xl">
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="rounded-lg px-3 py-2 text-sm font-bold text-slate-700 focus:bg-red-50 focus:text-red-800"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

function ChallengeDetail({ challenge, index }: { challenge: LiveCodingChallenge; index: number }) {
  return (
    <article className="min-h-[720px]">
      <div className="border-b border-red-100 p-5 lg:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-black text-red-800">
            <ListChecks size={16} />
            Bài {String(index).padStart(2, '0')}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">{challenge.topic}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700">
            <Clock3 size={15} />
            {challenge.difficulty}
          </span>
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-950 md:text-[2.35rem]">{challenge.title}</h2>
        <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Braces className="shrink-0 text-red-700" size={18} />
          <code className="font-mono text-xs font-black leading-relaxed text-slate-900 [overflow-wrap:anywhere]">{challenge.methodSignature}</code>
        </div>
      </div>

      <section className="border-b border-red-100 p-5 lg:p-8">
        <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-red-700">
          <CheckCircle2 size={17} />
          Câu hỏi
        </div>
        <RichText text={challenge.question} className="text-base font-medium leading-7 text-slate-800" />
      </section>

      <section className="grid gap-0 lg:grid-cols-2">
        <CodePanel title="Input" code={challenge.input} />
        <CodePanel title="Output mẫu" code={challenge.output} muted />
      </section>

      <section className="border-t border-red-100 bg-red-50/50 p-5 text-sm font-medium leading-relaxed text-slate-600 lg:p-8">
        Format chấm bài: ứng viên định nghĩa đúng method/class theo chữ ký ở trên trong rails console, sau đó chạy đúng input mẫu.
        Không cần tạo MVC, route, database hay file Rails mới cho các bài này.
      </section>
    </article>
  );
}

function CodePanel({ title, code, muted = false }: { title: string; code: string; muted?: boolean }) {
  return (
    <div className={`border-red-100 p-5 lg:p-8 ${muted ? 'border-t lg:border-l lg:border-t-0' : 'border-t'}`}>
      <div className="mb-3 text-sm font-black uppercase tracking-wide text-slate-500">{title}</div>
      <pre className="min-h-72 whitespace-pre-wrap break-words rounded-2xl bg-slate-950 p-5 font-mono text-[12px] leading-6 text-red-50 lg:p-6 lg:text-[13px]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
