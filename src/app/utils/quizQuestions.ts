import { MultipleChoiceQuestion, QuizQuestion, SingleChoiceQuestion } from '../types/quiz';

export type AnswerableQuestion = SingleChoiceQuestion | MultipleChoiceQuestion;

export type QuizStep = {
  question: AnswerableQuestion;
  parentQuestion?: QuizQuestion;
  label: string;
};

export function getQuizSteps(questions: QuizQuestion[]): QuizStep[] {
  return questions.flatMap((question, questionIndex) => {
    if (question.type === 'case_study') {
      return question.sub_questions.map((subQuestion, subQuestionIndex) => ({
        question: subQuestion,
        parentQuestion: question,
        label: `${questionIndex + 1}.${subQuestionIndex + 1}`,
      }));
    }

    return [{
      question,
      label: `${questionIndex + 1}`,
    }];
  });
}

export function isAnswerPresent(answer: unknown) {
  return Array.isArray(answer) ? answer.length > 0 : Boolean(answer);
}

export function isQuestionCorrect(question: AnswerableQuestion, answer: unknown) {
  if (question.type === 'single_choice') {
    return answer === question.correct_answer;
  }

  if (!Array.isArray(answer)) return false;

  return question.correct_answers.length === answer.length &&
    question.correct_answers.every((correctAnswer) => answer.includes(correctAnswer));
}
