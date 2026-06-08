import { RouterProvider } from 'react-router';
import { router } from './routes';
import { QuizSoundProvider } from './hooks/useQuizSounds';

export default function App() {
  return (
    <QuizSoundProvider>
      <RouterProvider router={router} />
    </QuizSoundProvider>
  );
}
