import { createBrowserRouter, Navigate, Outlet, useParams } from 'react-router';
import { AppShell } from './components/layout/AppShell';
import { QuizLibraryPage } from './pages/QuizLibraryPage';
import { QuizDetailPage } from './pages/QuizDetailPage';
import { QuizPlayerPage } from './pages/QuizPlayerPage';
import { ReviewBeforeSubmitPage } from './pages/ReviewBeforeSubmitPage';
import { ResultPage } from './pages/ResultPage';
import { AnswerReviewPage } from './pages/AnswerReviewPage';
import { AnswerKeyPage } from './pages/AnswerKeyPage';
import { QuizProvider } from './hooks/useQuizContext';
import { ROUTES } from './routePaths';

function QuizFlowLayout() {
  const { id } = useParams();
  if (!id) return <Navigate to={ROUTES.quizzes} replace />;

  return (
    <QuizProvider>
      <Outlet />
    </QuizProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppShell,
    children: [
      { index: true, element: <Navigate to={ROUTES.quizzes} replace /> },
      { path: 'quizzes', Component: QuizLibraryPage },
      {
        path: 'quizzes/:id',
        children: [
          { index: true, Component: QuizDetailPage },
          { path: 'answer-key', Component: AnswerKeyPage },
          {
            element: <QuizFlowLayout />,
            children: [
              { path: 'play', Component: QuizPlayerPage },
              { path: 'review', Component: ReviewBeforeSubmitPage },
              { path: 'result', Component: ResultPage },
              { path: 'answers', Component: AnswerReviewPage },
            ],
          },
        ],
      },
      { path: '*', element: <Navigate to={ROUTES.quizzes} replace /> },
    ],
  },
]);
