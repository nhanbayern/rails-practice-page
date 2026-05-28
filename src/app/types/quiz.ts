export type QuestionType = "single_choice" | "multiple_choice" | "case_study";

export interface Option {
  id: string;
  text: string;
}

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  title?: string;
  question: string;
  points: number;
  difficulty?: string;
  tags?: string[];
  explanation?: string;
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: "single_choice";
  options: Option[];
  correct_answer: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple_choice";
  options: Option[];
  correct_answers: string[];
}

export interface CaseContext {
  scenario: string;
  requirements?: string[];
  data_sample?: string;
}

export interface CaseStudyQuestion extends Omit<BaseQuestion, 'question' | 'explanation'> {
  type: "case_study";
  case_context: CaseContext;
  sub_questions: (SingleChoiceQuestion | MultipleChoiceQuestion)[];
}

export type QuizQuestion = SingleChoiceQuestion | MultipleChoiceQuestion | CaseStudyQuestion;

export interface GradingConfig {
  score_type: "points" | "percentage";
  allow_partial_score: boolean;
  multiple_choice_scoring: {
    mode: "exact_match" | "partial";
  };
  case_study_scoring: {
    score_by_sub_questions: boolean;
  };
}

export interface UiConfig {
  show_progress_bar: boolean;
  show_timer: boolean;
  show_question_number: boolean;
  show_explanation_after_submit: boolean;
  allow_review_before_submit: boolean;
  allow_back_navigation: boolean;
}

export interface ResultMessage {
  min_score: number;
  max_score: number;
  message: string;
}

export interface QuizData {
  quiz_id: string;
  title: string;
  description: string;
  time_limit: number; // in seconds
  passing_score: number; // percentage
  difficulty: string;
  tags: string[];
  grading: GradingConfig;
  ui_config: UiConfig;
  result_messages: ResultMessage[];
  questions: QuizQuestion[];
}

// User Answer Types
export type SingleAnswer = string;
export type MultipleAnswer = string[];
export type AnswerType = SingleAnswer | MultipleAnswer;

export interface QuizState {
  answers: Record<string, AnswerType>; // key is question id
  submittedQuestionIds: string[];
  startTime: number | null;
  timeSpent: number; // in seconds
  isSubmitted: boolean;
  currentQuestionIndex: number;
}
