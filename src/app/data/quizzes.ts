import { QuizData } from '../types/quiz';
import { sampleQuiz } from './sampleQuiz';
import railsQuestionViRaw from '../../imports/pasted_text/rails-question.JSON?raw';
import railsQuestionEnRaw from '../../imports/pasted_text/rails-question-en.JSON?raw';

const railsQuestionVi = JSON.parse(railsQuestionViRaw) as QuizData;
const railsQuestionEn = JSON.parse(railsQuestionEnRaw) as QuizData;

export const bundledQuizzes: QuizData[] = [
  sampleQuiz,
  railsQuestionVi,
  railsQuestionEn,
];

export function getLibraryQuizzes(): QuizData[] {
  return bundledQuizzes;
}

export function getQuizById(id?: string): QuizData | null {
  if (!id) return null;

  return getLibraryQuizzes().find((quiz) => quiz.quiz_id === id) || null;
}
