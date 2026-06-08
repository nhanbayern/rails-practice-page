import { CaseStudyQuestion, QuizData, QuizQuestion } from '../types/quiz';
import { sampleQuiz } from './sampleQuiz';
import railsQuestionViRaw from '../../imports/pasted_text/rails-question.JSON?raw';
import railsQuestionEnRaw from '../../imports/pasted_text/rails-question-en.JSON?raw';
import snaRaw from '../../imports/pasted_text/sna.JSON?raw';

const railsQuestionVi = JSON.parse(railsQuestionViRaw) as QuizData;
const railsQuestionEn = JSON.parse(railsQuestionEnRaw) as QuizData;
const snaQuiz = JSON.parse(snaRaw) as QuizData;

function countAnswerableQuestions(questions: QuizQuestion[]) {
  return questions.reduce((total, question) => {
    if (question.type === 'case_study') {
      return total + (question as CaseStudyQuestion).sub_questions.length;
    }

    return total + 1;
  }, 0);
}

function getSnaLectureInfo(question: QuizQuestion) {
  const source = 'question' in question ? question.question : question.title || '';
  const lectureMatch = source.match(/Lecture\s+(\d+)\s*:\s*([^\n*]+)/i);

  if (lectureMatch) {
    return {
      number: Number(lectureMatch[1]),
      title: lectureMatch[2].trim(),
    };
  }

  const titleMatch = question.title?.match(/\[L(\d+)-/i);
  if (!titleMatch) return null;

  return {
    number: Number(titleMatch[1]),
    title: `Lecture ${titleMatch[1]}`,
  };
}

function createSnaLectureQuizzes(fullQuiz: QuizData): QuizData[] {
  const lectureGroups = new Map<number, { title: string; questions: QuizQuestion[] }>();
  const secondsPerQuestion = Math.round(fullQuiz.time_limit / countAnswerableQuestions(fullQuiz.questions));

  fullQuiz.questions.forEach((question) => {
    const lecture = getSnaLectureInfo(question);
    if (!lecture) return;

    const currentGroup = lectureGroups.get(lecture.number) || {
      title: lecture.title,
      questions: [],
    };

    currentGroup.questions.push(question);
    lectureGroups.set(lecture.number, currentGroup);
  });

  return Array.from(lectureGroups.entries())
    .sort(([left], [right]) => left - right)
    .map(([lectureNumber, group]) => ({
      ...fullQuiz,
      quiz_id: `sna_is353_lecture_${String(lectureNumber).padStart(2, '0')}`,
      title: `SNA IS353 - Lecture ${lectureNumber}: ${group.title}`,
      description: `${group.questions.length} focused Social Network Analysis questions for Lecture ${lectureNumber}: ${group.title}.`,
      time_limit: group.questions.length * secondsPerQuestion,
      difficulty: 'Lecture practice',
      tags: ['SNA', 'IS353', `Lecture ${lectureNumber}`, group.title, 'English'],
      questions: group.questions,
    }));
}

export const snaLectureQuizzes = createSnaLectureQuizzes(snaQuiz);

export const bundledQuizzes: QuizData[] = [
  sampleQuiz,
  railsQuestionVi,
  railsQuestionEn,
  snaQuiz,
];

export function getLibraryQuizzes(): QuizData[] {
  return bundledQuizzes;
}

export function getSnaLectureQuizzes(): QuizData[] {
  return snaLectureQuizzes;
}

export function getQuizById(id?: string): QuizData | null {
  if (!id) return null;

  return [...getLibraryQuizzes(), ...getSnaLectureQuizzes()].find((quiz) => quiz.quiz_id === id) || null;
}
