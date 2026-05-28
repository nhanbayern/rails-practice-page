import { createBrowserRouter } from "react-router";
import { AppShell } from "./components/layout/AppShell";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { QuizLibraryPage } from "./pages/QuizLibraryPage";
import { QuizDetailPage } from "./pages/QuizDetailPage";
import { QuizPlayerPage } from "./pages/QuizPlayerPage";
import { ReviewBeforeSubmitPage } from "./pages/ReviewBeforeSubmitPage";
import { ResultPage } from "./pages/ResultPage";
import { AnswerReviewPage } from "./pages/AnswerReviewPage";
import { RailsLessonsPage } from "./pages/RailsLessonsPage";
import { LiveCodingTestsPage } from "./pages/LiveCodingTestsPage";
import { QuizProvider } from "./hooks/useQuizContext"; // trigger update
import { useParams } from "react-router";

// A wrapper to inject QuizProvider based on the URL parameter
function QuizStateWrapper({ Component }: { Component: React.ComponentType }) {
  const { id } = useParams();
  if (!id) return <div>Quiz ID missing</div>;
  return (
    <QuizProvider quizId={id}>
      <Component />
    </QuizProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/",
    Component: AppShell,
    children: [
      { path: "dashboard", Component: DashboardPage },
      { path: "lessons", Component: RailsLessonsPage },
      { path: "live-coding", Component: LiveCodingTestsPage },
      { path: "library", Component: QuizLibraryPage },
      { path: "quiz/:id", Component: QuizDetailPage },
      { 
        path: "quiz/:id/play", 
        element: <QuizStateWrapper Component={QuizPlayerPage} /> 
      },
      { 
        path: "quiz/:id/review", 
        element: <QuizStateWrapper Component={ReviewBeforeSubmitPage} /> 
      },
      { 
        path: "quiz/:id/result", 
        element: <QuizStateWrapper Component={ResultPage} /> 
      },
      { 
        path: "quiz/:id/answers", 
        element: <QuizStateWrapper Component={AnswerReviewPage} /> 
      },
    ],
  },
]);
