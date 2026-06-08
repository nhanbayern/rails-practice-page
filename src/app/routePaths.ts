export const ROUTES = {
  quizzes: '/quizzes',
} as const;

export function quizPath(quizId: string) {
  return `${ROUTES.quizzes}/${quizId}`;
}

export function quizPlayPath(quizId: string, questionId?: string) {
  const path = `${quizPath(quizId)}/play`;
  return questionId ? `${path}?question=${encodeURIComponent(questionId)}` : path;
}

export function quizReviewPath(quizId: string) {
  return `${quizPath(quizId)}/review`;
}

export function quizResultPath(quizId: string) {
  return `${quizPath(quizId)}/result`;
}

export function quizAnswersPath(quizId: string) {
  return `${quizPath(quizId)}/answers`;
}

export function isRouteActive(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}
