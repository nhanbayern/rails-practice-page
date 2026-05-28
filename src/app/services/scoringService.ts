import { QuizData, QuizState, QuizQuestion, SingleChoiceQuestion, MultipleChoiceQuestion, CaseStudyQuestion, AnswerType } from '../types/quiz';

export function calculateScore(quiz: QuizData, state: QuizState) {
  let totalPoints = 0;
  let earnedPoints = 0;
  let correctCount = 0;
  let totalQuestionsCount = 0;

  const scoreMultipleChoice = (q: MultipleChoiceQuestion, answer: string[]) => {
    const isExactMatch = q.correct_answers.length === answer.length && 
                         q.correct_answers.every(a => answer.includes(a));
    
    if (isExactMatch) {
      earnedPoints += q.points;
      correctCount++;
    }
  };

  const processQuestion = (q: QuizQuestion) => {
    if (q.type === 'case_study') {
      if (quiz.grading.case_study_scoring.score_by_sub_questions) {
        q.sub_questions.forEach(subQ => {
          totalPoints += subQ.points;
          totalQuestionsCount++;
          
          const answer = state.answers[subQ.id];
          if (!answer) return;

          if (subQ.type === 'single_choice' && answer === subQ.correct_answer) {
             earnedPoints += subQ.points;
             correctCount++;
          } else if (subQ.type === 'multiple_choice' && Array.isArray(answer)) {
            scoreMultipleChoice(subQ, answer);
          }
        });
      } else {
        totalPoints += q.points;
        // Simplified case study full score logic if not by sub questions
      }
    } else {
      totalPoints += q.points;
      totalQuestionsCount++;
      const answer = state.answers[q.id];
      if (!answer) return;

      if (q.type === 'single_choice' && answer === q.correct_answer) {
        earnedPoints += q.points;
        correctCount++;
      } else if (q.type === 'multiple_choice' && Array.isArray(answer)) {
        scoreMultipleChoice(q, answer);
      }
    }
  };

  quiz.questions.forEach(processQuestion);

  const percentage = totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);
  const passed = percentage >= quiz.passing_score;

  // Find result message
  const resultMessage = quiz.result_messages.find(
    m => percentage >= m.min_score && percentage <= m.max_score
  )?.message || "Quiz Complete!";

  return {
    totalPoints,
    earnedPoints,
    percentage,
    passed,
    correctCount,
    totalQuestionsCount,
    resultMessage
  };
}
