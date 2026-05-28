import { useMemo, useState } from 'react';
import { BookOpen, Braces, ChevronLeft, ChevronRight, Code2, FileText, Languages, ListChecks, Network, Search, TerminalSquare } from 'lucide-react';
import type { Swiper as SwiperInstance } from 'swiper';
import { Keyboard, Mousewheel, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import type {
  MethodGroup,
  StudyLanguage,
  TutorialChapter,
  TutorialMethod,
  TutorialSlide,
} from '../data/railsTutorialFullDeck';
import {
  curatedMethodGroups,
  curatedTutorialChapters,
  totalCuratedSlides,
} from '../data/railsTutorialCuratedDeck';
import { MermaidDiagram } from '../components/lesson/MermaidDiagram';
import { RichText } from '../components/quiz/RichText';

type DeckItem =
  | { kind: 'chapter'; key: string; chapter: TutorialChapter }
  | { kind: 'appendix'; key: string };

const deckItems: DeckItem[] = [
  ...curatedTutorialChapters.map((chapter) => ({ kind: 'chapter' as const, key: chapter.id, chapter })),
  { kind: 'appendix', key: 'appendix' },
];

export function RailsLessonsPage() {
  const [language, setLanguage] = useState<StudyLanguage>('vi');
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [methodQuery, setMethodQuery] = useState('');

  const filteredMethodGroups = useMemo(() => filterMethodGroups(curatedMethodGroups, methodQuery), [methodQuery]);
  const activeItem = deckItems[activeChapterIndex] || deckItems[0];

  return (
    <div className="min-h-full bg-[linear-gradient(180deg,#fff7f7_0%,#ffffff_36%,#fffafa_100%)]">
      <div className="mx-auto flex w-full max-w-[1900px] flex-col gap-5 p-4 lg:p-6">
        <header className="rounded-3xl border border-red-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-3 inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-800">
                Curated tutorial deck
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
                Ruby on Rails Tutorial Study Slides
              </h1>
              <p className="mt-2 max-w-6xl text-slate-600">
                {language === 'vi'
                  ? `Deck này đã được chắt lọc thành ${totalCuratedSlides.toLocaleString()} slide tinh gọn theo từng chương. Mỗi slide tập trung vào mental model, luồng xử lý, bẫy thực tế và method cần nắm.`
                  : `This deck has been distilled into ${totalCuratedSlides.toLocaleString()} focused slides by chapter. Each slide focuses on mental models, flow, practical pitfalls, and key methods.`}
              </p>
            </div>
            <div className="inline-flex rounded-2xl border border-red-100 bg-red-50 p-1">
              {(['vi', 'en'] as StudyLanguage[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setLanguage(item)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-bold transition-colors ${
                    language === item ? 'bg-red-700 text-white shadow-sm' : 'text-red-800 hover:bg-red-100'
                  }`}
                >
                  <Languages size={16} />
                  {item === 'vi' ? 'Tiếng Việt' : 'English'}
                </button>
              ))}
            </div>
          </div>
        </header>

        <nav className="sticky top-0 z-20 rounded-2xl border border-red-100 bg-white/95 p-3 shadow-sm backdrop-blur">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {deckItems.map((item, index) => {
              const isActive = index === activeChapterIndex;
              const label = item.kind === 'appendix' ? 'Methods' : `Chapter ${item.chapter.chapter}`;
              const title = item.kind === 'appendix' ? 'Methods by Module' : item.chapter.title;
              const meta = item.kind === 'appendix' ? `${countMethods(curatedMethodGroups)} methods` : `${item.chapter.slides.length} slides`;

              return (
                <button
                  key={item.key}
                  onClick={() => setActiveChapterIndex(index)}
                  className={`flex min-w-[220px] flex-col rounded-xl px-4 py-3 text-left transition-all ${
                    isActive ? 'bg-red-700 text-white shadow-md shadow-red-200' : 'bg-red-50/60 text-slate-800 hover:bg-red-100'
                  }`}
                >
                  <span className={`text-xs font-black ${isActive ? 'text-red-100' : 'text-red-700'}`}>{label}</span>
                  <span className="truncate font-extrabold">{title}</span>
                  <span className={`text-xs ${isActive ? 'text-red-100' : 'text-slate-500'}`}>{meta}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <main className="w-full">
          {activeItem.kind === 'appendix' ? (
            <AppendixChapter
              language={language}
              query={methodQuery}
              onQueryChange={setMethodQuery}
              groups={filteredMethodGroups}
            />
          ) : (
            <ChapterDeck chapter={activeItem.chapter} language={language} />
          )}
        </main>
      </div>
    </div>
  );
}

function ChapterDeck({ chapter, language }: { chapter: TutorialChapter; language: StudyLanguage }) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const slide = chapter.slides[activeSlideIndex] || chapter.slides[0];

  const goToSlide = (index: number) => {
    swiper?.slideTo(index);
    setActiveSlideIndex(index);
  };

  return (
    <article className="min-h-[820px] rounded-3xl border border-red-100 bg-white p-4 shadow-xl shadow-red-100 md:p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <span className="text-sm font-black text-red-700">{chapter.chapter === 0 ? 'Front Matter' : `Chapter ${chapter.chapter}`}</span>
          <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{chapter.title}</h2>
          <p className="mt-2 max-w-5xl text-slate-600">
            {language === 'vi'
              ? 'Swipe trong vùng slide chỉ di chuyển nội bộ chương này. Nội dung đã được biên tập lại thành ý chính, luồng xử lý và bẫy thường gặp.'
              : 'Swiping inside the slide area only moves within this chapter. Content is curated into essentials, flow, and common pitfalls.'}
          </p>
        </div>
        <SlideControls active={activeSlideIndex} total={chapter.slides.length} onGo={goToSlide} />
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {chapter.slides.map((item, index) => (
          <button
            key={item.id}
            onClick={() => goToSlide(index)}
            className={`min-w-[190px] rounded-xl px-4 py-3 text-left transition-all ${
              index === activeSlideIndex ? 'bg-red-700 text-white shadow-sm shadow-red-200' : 'bg-slate-50 text-slate-700 hover:bg-red-50'
            }`}
          >
            <span className={`block text-xs font-black ${index === activeSlideIndex ? 'text-red-100' : 'text-red-700'}`}>
              {item.section}
            </span>
            <span className="line-clamp-2 text-sm font-bold">{item.title}</span>
            <span className={`mt-1 block text-xs ${index === activeSlideIndex ? 'text-red-100' : 'text-slate-400'}`}>{item.layout}</span>
          </button>
        ))}
      </div>

      <Swiper
        modules={[Keyboard, Mousewheel, Pagination]}
        keyboard={{ enabled: true }}
        mousewheel={{ forceToAxis: true }}
        pagination={{ clickable: true }}
        spaceBetween={24}
        onSwiper={setSwiper}
        onSlideChange={(instance) => setActiveSlideIndex(instance.activeIndex)}
        className="rails-slide-swiper"
      >
        {chapter.slides.map((item) => (
          <SwiperSlide key={item.id}>
            <StudySlideCard slide={item} language={language} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-2 text-sm font-black uppercase tracking-wide text-slate-500">Sections in this chapter</div>
        <div className="flex flex-wrap gap-2">
          {chapter.sections.map((section) => (
            <span key={section} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
              {section}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function SlideControls({ active, total, onGo }: { active: number; total: number; onGo: (index: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onGo(Math.max(active - 1, 0))}
        disabled={active === 0}
        className="rounded-xl border border-slate-200 p-3 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
        aria-label="Previous slide"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-800">
        {active + 1} / {total}
      </span>
      <button
        onClick={() => onGo(Math.min(active + 1, total - 1))}
        disabled={active === total - 1}
        className="rounded-xl border border-slate-200 p-3 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
        aria-label="Next slide"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function StudySlideCard({ slide, language }: { slide: TutorialSlide; language: StudyLanguage }) {
  if (slide.layout === 'diagram') return <DiagramSlide slide={slide} language={language} />;
  if (slide.layout === 'overview') return <OverviewSlide slide={slide} language={language} />;
  if (slide.layout === 'exercise') return <ExerciseSlide slide={slide} language={language} />;
  if (slide.layout === 'code') return <CodeSlide slide={slide} language={language} />;
  return <ReadingSlide slide={slide} language={language} />;
}

function OverviewSlide({ slide, language }: { slide: TutorialSlide; language: StudyLanguage }) {
  return (
    <section className="grid min-h-[650px] overflow-hidden rounded-3xl border border-slate-200 bg-white xl:grid-cols-[0.9fr_1.1fr]">
      <div className="bg-slate-950 p-8 text-white">
        <SlideEyebrow slide={slide} icon={<BookOpen size={20} />} />
        <h3 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">{slide.title}</h3>
        <div className="mt-8 grid gap-3">
          {slide.notes[language].map((note) => (
            <div key={note} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">
              {note}
            </div>
          ))}
        </div>
      </div>
      <div className="p-8">
        <h4 className="mb-3 text-xl font-black text-slate-950">{language === 'vi' ? 'Tinh túy cần nắm' : 'Curated essentials'}</h4>
        <SourceText text={slide.sourceText} tone="light" />
        <MethodRail methods={slide.methods} language={language} />
      </div>
    </section>
  );
}

function ReadingSlide({ slide, language }: { slide: TutorialSlide; language: StudyLanguage }) {
  return (
    <section className="grid min-h-[650px] gap-5 rounded-3xl border border-slate-200 bg-white p-5 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="min-w-0">
        <SlideHeader slide={slide} icon={<FileText size={20} />} />
        <SourceText text={slide.sourceText} tone="light" />
      </div>
      <InsightPanel slide={slide} language={language} />
    </section>
  );
}

function CodeSlide({ slide, language }: { slide: TutorialSlide; language: StudyLanguage }) {
  return (
    <section className="grid min-h-[650px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white xl:grid-cols-[minmax(0,1.05fr)_minmax(440px,0.95fr)]">
      <div className="min-w-0 p-6 md:p-8">
        <SlideEyebrow slide={slide} icon={<Code2 size={20} />} />
        <h3 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">{slide.title}</h3>
        <p className="mt-3 text-slate-300">
          {language === 'vi'
            ? 'Code mẫu đã được rút gọn để làm rõ receiver object, lifecycle và test đi kèm.'
            : 'Code examples are trimmed to clarify receiver object, lifecycle, and related tests.'}
        </p>
        <div className="mt-6 space-y-4">
          {slide.codeBlocks.length ? slide.codeBlocks.map((block, index) => (
            <div key={`${slide.id}-code-${index}`} className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <RichText text={`\`\`\`ruby\n${block}\n\`\`\``} />
            </div>
          )) : (
            <SourceText text={slide.sourceText} tone="dark" />
          )}
        </div>
      </div>
      <div className="min-w-0 bg-white p-6 text-slate-950 md:p-8">
        <h4 className="mb-3 flex items-center gap-2 text-xl font-black">
          <TerminalSquare className="text-red-700" size={22} />
          {language === 'vi' ? 'Điểm cần nắm từ ví dụ' : 'What to extract from the example'}
        </h4>
        <SourceText text={slide.sourceText} tone="light" compact />
        <MethodRail methods={slide.methods} language={language} />
      </div>
    </section>
  );
}

function ExerciseSlide({ slide, language }: { slide: TutorialSlide; language: StudyLanguage }) {
  return (
    <section className="grid min-h-[650px] gap-5 rounded-3xl border border-amber-200 bg-amber-50 p-5 xl:grid-cols-[minmax(0,1fr)_440px]">
      <div className="min-w-0 rounded-3xl bg-white p-6 shadow-sm">
        <SlideHeader slide={slide} icon={<ListChecks size={20} />} />
        <SourceText text={slide.sourceText} tone="light" />
      </div>
      <aside className="rounded-3xl border border-amber-200 bg-white p-6">
        <h4 className="text-2xl font-black text-amber-950">{language === 'vi' ? 'Cách xử lý exercise' : 'How to work this exercise'}</h4>
        <ul className="mt-4 space-y-3">
          {slide.notes[language].map((note) => (
            <li key={note} className="flex gap-3 text-sm leading-relaxed text-slate-700">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              {note}
            </li>
          ))}
        </ul>
        <MethodRail methods={slide.methods} language={language} />
      </aside>
    </section>
  );
}

function DiagramSlide({ slide, language }: { slide: TutorialSlide; language: StudyLanguage }) {
  return (
    <section className="grid min-h-[650px] gap-5 rounded-3xl border border-red-100 bg-white p-5 xl:grid-cols-[minmax(0,1.2fr)_420px]">
      <div className="min-w-0">
        <SlideHeader slide={slide} icon={<Network size={20} />} />
        {slide.diagram ? <MermaidDiagram chart={slide.diagram} /> : null}
      </div>
      <InsightPanel slide={slide} language={language} />
    </section>
  );
}

function InsightPanel({ slide, language }: { slide: TutorialSlide; language: StudyLanguage }) {
  return (
    <aside className="grid content-start gap-5">
      <section className="rounded-2xl border border-red-100 bg-red-50 p-5">
        <h4 className="text-xl font-black text-red-950">{language === 'vi' ? 'Ghi chú học sâu' : 'Deep-study notes'}</h4>
        <ul className="mt-4 space-y-3">
          {slide.notes[language].map((note) => (
            <li key={note} className="flex gap-3 text-sm leading-relaxed text-slate-700">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-600" />
              {note}
            </li>
          ))}
        </ul>
      </section>
      <MethodRail methods={slide.methods} language={language} />
    </aside>
  );
}

function MethodRail({ methods, language }: { methods: TutorialMethod[]; language: StudyLanguage }) {
  if (!methods.length) {
    return (
      <section className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h4 className="text-lg font-black text-slate-950">{language === 'vi' ? 'Method trọng tâm' : 'Focus methods'}</h4>
        <p className="mt-2 text-sm text-slate-500">
          {language === 'vi' ? 'Slide này tập trung vào tư duy xử lý, không gắn với method riêng.' : 'This slide focuses on reasoning, not one specific method.'}
        </p>
      </section>
    );
  }

  return (
    <section className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h4 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-950">
        <Braces className="text-red-700" size={20} />
        {language === 'vi' ? 'Method trọng tâm' : 'Focus methods'}
      </h4>
      <div className="grid gap-3">
        {methods.slice(0, 8).map((method) => (
          <article key={`${method.name}-${method.owner}`} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <code className="rounded-md bg-red-50 px-2 py-1 font-mono text-sm font-bold text-red-800">{method.name}</code>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">{method.category}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{method.explanation[language]}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{method.mechanism[language]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SlideHeader({ slide, icon }: { slide: TutorialSlide; icon: React.ReactNode }) {
  return (
    <div className="mb-5">
      <SlideEyebrow slide={slide} icon={icon} />
      <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{slide.title}</h3>
    </div>
  );
}

function SlideEyebrow({ slide, icon }: { slide: TutorialSlide; icon: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-black text-red-800">
      {icon}
      {slide.section} · {slide.layout}
    </div>
  );
}

function SourceText({ text, tone, compact = false }: { text: string; tone: 'light' | 'dark'; compact?: boolean }) {
  return (
    <pre
      className={`max-h-[520px] whitespace-pre-wrap overflow-auto rounded-2xl p-5 font-sans text-sm leading-relaxed ${
        compact ? 'text-xs leading-relaxed' : ''
      } ${
        tone === 'dark'
          ? 'border border-white/10 bg-black/30 text-slate-200'
          : 'border border-slate-200 bg-slate-50 text-slate-800'
      }`}
    >
      {text}
    </pre>
  );
}

function AppendixChapter({
  language,
  query,
  onQueryChange,
  groups,
}: {
  language: StudyLanguage;
  query: string;
  onQueryChange: (value: string) => void;
  groups: MethodGroup[];
}) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const safeIndex = Math.min(activeModuleIndex, Math.max(groups.length - 1, 0));

  const goToModule = (index: number) => {
    const next = Math.min(Math.max(index, 0), Math.max(groups.length - 1, 0));
    swiper?.slideTo(next);
    setActiveModuleIndex(next);
  };

  return (
    <article className="min-h-[820px] rounded-3xl border border-red-100 bg-white p-6 shadow-xl shadow-red-100 md:p-8">
      <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-black text-red-800">
            Appendix chapter
          </span>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Rails Methods by Module
          </h2>
          <p className="mt-2 max-w-5xl text-slate-600">
            {language === 'vi'
              ? 'Chương cuối gom method theo module để học kỹ: Ruby core, routing, controller, view/helper, Active Record, association/query, authentication/mailer và testing. Mỗi method có owner, cơ chế và ví dụ ngắn tự biên soạn.'
              : 'The final chapter groups methods by module: Ruby core, routing, controller, view/helper, Active Record, association/query, authentication/mailer, and testing. Each method includes owner, mechanism, and curated examples.'}
          </p>
        </div>
        <div className="relative w-full xl:w-[560px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={query}
            onChange={(event) => {
              onQueryChange(event.target.value);
              setActiveModuleIndex(0);
              swiper?.slideTo(0);
            }}
            placeholder={language === 'vi' ? 'Tìm method, module, owner, cơ chế...' : 'Search method, module, owner, mechanism...'}
            className="w-full rounded-xl border border-red-100 bg-white py-3 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 gap-2 overflow-x-auto pb-2">
          {groups.map((group, index) => (
            <button
              key={group.id}
              onClick={() => goToModule(index)}
              className={`min-w-[230px] rounded-xl px-4 py-3 text-left transition-all ${
                index === safeIndex ? 'bg-red-700 text-white shadow-md shadow-red-200' : 'bg-red-50 text-slate-800 hover:bg-red-100'
              }`}
            >
              <span className={`text-xs font-black ${index === safeIndex ? 'text-red-100' : 'text-red-700'}`}>
                Module {index + 1}
              </span>
              <span className="block truncate font-extrabold">{group.title}</span>
              <span className={`text-xs ${index === safeIndex ? 'text-red-100' : 'text-slate-500'}`}>{group.methods.length} methods</span>
            </button>
          ))}
        </div>
        <div className="hidden shrink-0 md:block">
          <SlideControls active={safeIndex} total={Math.max(groups.length, 1)} onGo={goToModule} />
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center font-bold text-slate-600">
          {language === 'vi' ? 'Không tìm thấy method phù hợp.' : 'No matching methods found.'}
        </div>
      ) : (
        <Swiper
          modules={[Keyboard, Mousewheel, Pagination]}
          keyboard={{ enabled: true }}
          mousewheel={{ forceToAxis: true }}
          pagination={{ clickable: true }}
          spaceBetween={24}
          onSwiper={setSwiper}
          onSlideChange={(instance) => setActiveModuleIndex(instance.activeIndex)}
          className="rails-slide-swiper"
        >
          {groups.map((group) => (
            <SwiperSlide key={group.id}>
              <MethodGroupSlide group={group} language={language} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </article>
  );
}

function MethodGroupSlide({ group, language }: { group: MethodGroup; language: StudyLanguage }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h3 className="text-3xl font-black text-slate-950">{group.title}</h3>
          <p className="mt-2 text-slate-600">
            {language === 'vi'
              ? 'Mỗi card giải thích method theo owner, cơ chế chạy và ví dụ Rails console/app code ngắn.'
              : 'Each card explains the method by owner, runtime mechanism, and concise Rails console/app examples.'}
          </p>
        </div>
        <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-red-800 shadow-sm">{group.methods.length} methods</span>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {group.methods.map((method) => (
          <article key={`${group.id}-${method.name}`} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <code className="rounded-md bg-red-50 px-2 py-1 font-mono text-sm font-bold text-red-800">{method.name}</code>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">{method.owner}</span>
              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-800">{method.count} hits</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{method.explanation[language]}</p>
            <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-3 text-sm leading-relaxed text-red-950">
              <span className="font-black">{language === 'vi' ? 'Cơ chế: ' : 'Mechanism: '}</span>
              {method.mechanism[language]}
            </div>
            {method.examples.slice(0, 2).map((example, index) => (
              <pre key={`${method.name}-${index}`} className="mt-3 max-h-36 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-200">
                {example}
              </pre>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}

function filterMethodGroups(groups: MethodGroup[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return groups;

  return groups
    .map((group) => ({
      ...group,
      methods: group.methods.filter((method) =>
        method.name.toLowerCase().includes(normalized) ||
        method.owner.toLowerCase().includes(normalized) ||
        method.category.toLowerCase().includes(normalized) ||
        method.explanation.en.toLowerCase().includes(normalized) ||
        method.explanation.vi.toLowerCase().includes(normalized) ||
        method.mechanism.en.toLowerCase().includes(normalized) ||
        method.mechanism.vi.toLowerCase().includes(normalized) ||
        method.examples.some((example) => example.toLowerCase().includes(normalized))
      ),
    }))
    .filter((group) => group.methods.length > 0);
}

function countMethods(groups: MethodGroup[]) {
  return groups.reduce((sum, group) => sum + group.methods.length, 0);
}
