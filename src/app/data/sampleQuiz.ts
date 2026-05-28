import { QuizData } from '../types/quiz';

export const sampleQuiz: QuizData = {
  quiz_id: "js_fundamentals_01",
  title: "JavaScript Fundamentals",
  description: "This quiz tests basic JavaScript syntax, data types, and core concepts. Great for beginners!",
  time_limit: 600,
  passing_score: 70,
  difficulty: "Beginner",
  tags: ["JavaScript", "Frontend", "Beginner"],
  grading: {
    score_type: "points",
    allow_partial_score: false,
    multiple_choice_scoring: {
      mode: "exact_match"
    },
    case_study_scoring: {
      score_by_sub_questions: true
    }
  },
  ui_config: {
    show_progress_bar: true,
    show_timer: true,
    show_question_number: true,
    show_explanation_after_submit: true,
    allow_review_before_submit: true,
    allow_back_navigation: true
  },
  result_messages: [
    { min_score: 0, max_score: 69, message: "Keep practicing! You can do it." },
    { min_score: 70, max_score: 89, message: "Good job! You passed." },
    { min_score: 90, max_score: 100, message: "Excellent work! You are a master." }
  ],
  questions: [
    {
      id: "q001",
      type: "single_choice",
      title: "Data Types",
      question: "Which of the following is NOT a primitive data type in JavaScript?",
      points: 10,
      options: [
        { id: "a", text: "String" },
        { id: "b", text: "Number" },
        { id: "c", text: "Object" },
        { id: "d", text: "Boolean" }
      ],
      correct_answer: "c",
      explanation: "Objects are reference types in JavaScript, not primitives. Primitives include String, Number, Boolean, Undefined, Null, Symbol, and BigInt."
    },
    {
      id: "q002",
      type: "multiple_choice",
      title: "Variable Declarations",
      question: "Which keywords are used to declare variables in modern JavaScript (ES6+)? Select all that apply.",
      points: 10,
      options: [
        { id: "a", text: "var" },
        { id: "b", text: "let" },
        { id: "c", text: "const" },
        { id: "d", text: "def" }
      ],
      correct_answers: ["b", "c"],
      explanation: "While 'var' was used in older JS, ES6 introduced 'let' and 'const' as the standard ways to declare variables."
    },
    {
      id: "q003",
      type: "case_study",
      title: "Shopping Cart Calculation",
      points: 20,
      case_context: {
        scenario: "You are building a shopping cart feature for an e-commerce website.",
        requirements: [
          "Calculate the total price of items in the cart.",
          "Apply a 10% discount if the total exceeds $100."
        ],
        data_sample: "const cart = [{ price: 50 }, { price: 60 }, { price: 20 }];"
      },
      sub_questions: [
        {
          id: "q003_1",
          type: "single_choice",
          title: "Total Calculation",
          question: "What is the total price of the items before any discount?",
          points: 10,
          options: [
            { id: "a", text: "$110" },
            { id: "b", text: "$130" },
            { id: "c", text: "$150" }
          ],
          correct_answer: "b",
          explanation: "50 + 60 + 20 = 130"
        },
        {
          id: "q003_2",
          type: "single_choice",
          title: "Discount Logic",
          question: "Does the user qualify for the discount, and what is the final price?",
          points: 10,
          options: [
            { id: "a", text: "Yes, $117" },
            { id: "b", text: "No, $130" },
            { id: "c", text: "Yes, $120" }
          ],
          correct_answer: "a",
          explanation: "Total is $130, which is > $100. 10% of 130 is 13. Final price is 130 - 13 = 117."
        }
      ]
    }
  ]
};
