import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AnswerType, QuizState } from '../types/quiz';

type QuizAction =
  | { type: 'SET_ANSWER'; questionId: string; answer: AnswerType }
  | { type: 'SUBMIT_QUESTION'; questionId: string }
  | { type: 'SET_TIME_SPENT'; time: number }
  | { type: 'START_QUIZ' }
  | { type: 'SUBMIT_QUIZ' }
  | { type: 'SET_CURRENT_QUESTION'; index: number }
  | { type: 'LOAD_STATE'; state: QuizState }
  | { type: 'RESET_QUIZ' };

const initialState: QuizState = {
  answers: {},
  submittedQuestionIds: [],
  startTime: null,
  timeSpent: 0,
  isSubmitted: false,
  currentQuestionIndex: 0,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SET_ANSWER':
      if (state.submittedQuestionIds.includes(action.questionId)) {
        return state;
      }
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.answer },
      };
    case 'SUBMIT_QUESTION':
      if (state.submittedQuestionIds.includes(action.questionId)) {
        return state;
      }
      return {
        ...state,
        submittedQuestionIds: [...state.submittedQuestionIds, action.questionId],
      };
    case 'SET_TIME_SPENT':
      return { ...state, timeSpent: action.time };
    case 'START_QUIZ':
      return { ...state, startTime: Date.now() };
    case 'SUBMIT_QUIZ':
      return { ...state, isSubmitted: true };
    case 'SET_CURRENT_QUESTION':
      return { ...state, currentQuestionIndex: action.index };
    case 'LOAD_STATE':
      return { ...initialState, ...action.state };
    case 'RESET_QUIZ':
      return { ...initialState };
    default:
      return state;
  }
}

interface QuizContextType {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children, quizId }: { children: ReactNode; quizId: string }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`quiz_state_${quizId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', state: parsed });
      } catch (e) {
        console.error("Failed to parse saved quiz state");
      }
    }
  }, [quizId]);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem(`quiz_state_${quizId}`, JSON.stringify(state));
  }, [state, quizId]);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuizState() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuizState must be used within a QuizProvider');
  }
  return context;
}
