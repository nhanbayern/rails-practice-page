# Quiz JSON Framework Specification

## 1. Project Context

This project is a frontend quiz application that renders quizzes dynamically from a JSON configuration file. The application should not hard-code questions, answers, scoring rules, or quiz behavior inside the source code. Instead, it should read a structured JSON object and use it as the single source of truth for rendering the quiz UI, managing user answers, calculating scores, and displaying final results.

The system is designed to support different types of quiz questions, including simple multiple-choice questions and more complex case-study-based questions. The main goal is to create a flexible quiz engine that can accept different quiz JSON files without requiring major code changes.

## 2. Main Objective

Build a frontend quiz application that can:

* Load quiz data from a JSON file or API response.
* Render questions based on their `type`.
* Support single-choice questions.
* Support multiple-choice questions.
* Support case-study questions with nested sub-questions.
* Track user-selected answers.
* Calculate score based on the grading rules defined in JSON.
* Show quiz progress, timer, review page, explanations, and final result messages.
* Allow future extension for more question types.

## 3. JSON as the Source of Truth

The JSON file should define all quiz-related information, including:

* Quiz metadata
* Quiz title and description
* Time limit
* Passing score
* Question list
* Question types
* Answer options
* Correct answers
* Explanations
* Scoring rules
* UI configuration
* Result messages

The frontend should avoid assuming a fixed number of questions, fixed option labels, or fixed scoring behavior. The application should read these values from JSON whenever possible.

## 4. Supported Question Types

### 4.1 Single Choice Question

A `single_choice` question allows the user to select exactly one answer from a list of options.

Expected fields:

* `id`: unique question identifier
* `type`: must be `"single_choice"`
* `title`: short question title
* `question`: question text
* `points`: score value
* `difficulty`: optional difficulty level
* `tags`: optional topic tags
* `options`: list of answer options
* `correct_answer`: ID of the correct option
* `explanation`: explanation shown after submission or review

The user answer should be stored as a single option ID.

Example user answer:

```json
{
  "q001": "b"
}
```

## 5. Multiple Choice Question

A `multiple_choice` question allows the user to select more than one answer.

Expected fields:

* `id`
* `type`: must be `"multiple_choice"`
* `title`
* `question`
* `points`
* `difficulty`
* `tags`
* `options`
* `correct_answers`: array of correct option IDs
* `explanation`

The user answer should be stored as an array of selected option IDs.

Example user answer:

```json
{
  "q002": ["a", "b", "d"]
}
```

By default, the answer should be considered correct only when the selected options exactly match the `correct_answers` array. However, this behavior should be configurable through the `grading.multiple_choice_scoring` object.

## 6. Case Study Question

A `case_study` question represents a scenario-based question. It contains a context section and multiple nested sub-questions.

Expected fields:

* `id`
* `type`: must be `"case_study"`
* `title`
* `case_context`
* `points`
* `difficulty`
* `tags`
* `sub_questions`

The `case_context` object may include:

* `scenario`: the main case description
* `requirements`: list of business or technical requirements
* `data_sample`: optional sample data related to the case

The `sub_questions` array can contain question objects similar to normal `single_choice` or `multiple_choice` questions.

The score of a case study should be calculated from its sub-questions if:

```json
"case_study_scoring": {
  "score_by_sub_questions": true
}
```

Each sub-question should have its own `id`, `type`, `question`, `points`, `options`, correct answer field, and explanation.

## 7. Quiz State Management

The frontend should maintain quiz state separately from the original JSON.

Recommended state structure:

```json
{
  "current_question_index": 0,
  "selected_answers": {
    "q001": "b",
    "q002": ["a", "b", "d"],
    "q003_1": "b"
  },
  "is_submitted": false,
  "score": 0,
  "remaining_time_seconds": 1800
}
```

The original quiz JSON should remain immutable during the quiz session.

The app should be able to save temporary progress in `localStorage` or `IndexedDB` so that answers are not lost after page refresh.

## 8. Scoring Rules

The scoring logic should follow the `grading` object from JSON.

Important fields:

* `score_type`: usually `"points"`
* `allow_partial_score`: whether partial scores are allowed
* `multiple_choice_scoring.mode`: defines how multiple-choice answers are checked
* `case_study_scoring.score_by_sub_questions`: whether case-study scores come from sub-questions

For `single_choice`, the answer is correct if the selected option ID equals `correct_answer`.

For `multiple_choice`, the default behavior is exact match:

* Correct if selected option IDs match all correct option IDs.
* Incorrect if the user misses a correct answer.
* Incorrect if the user selects an extra wrong answer.

For `case_study`, the total score should be the sum of its sub-question scores.

## 9. UI Behavior

The frontend should use the `ui_config` object to control quiz behavior.

Supported UI config fields:

* `show_progress_bar`
* `show_timer`
* `show_question_number`
* `show_explanation_after_submit`
* `allow_review_before_submit`
* `allow_back_navigation`

The UI should support:

* Start quiz screen
* Question screen
* Next and previous navigation
* Answer selection
* Progress display
* Timer display
* Review before submit
* Submit confirmation
* Result screen
* Explanation display
* Restart quiz option

## 10. Result Messages

The final result message should be selected from the `result_messages` array based on the user’s final percentage score.

Example:

If the final score is 75%, the app should find the message object where:

```json
min_score <= 75 <= max_score
```

Then display its `message`.

## 11. Validation Requirements

Before rendering the quiz, the frontend should validate the JSON structure.

Minimum validation rules:

* `quiz_id` must exist.
* `title` must exist.
* `questions` must be an array.
* Every question must have a unique `id`.
* Every question must have a supported `type`.
* Every option must have an `id` and `text`.
* `single_choice` must have `correct_answer`.
* `multiple_choice` must have `correct_answers`.
* `case_study` must have `case_context` and `sub_questions`.
* Correct answer IDs must exist in the options list.

If the JSON is invalid, the app should show a clear error message instead of crashing.

## 12. Extensibility

The architecture should allow new question types to be added later without rewriting the whole app.

Recommended approach:

Create a question renderer map:

```js
const questionRenderers = {
  single_choice: SingleChoiceQuestion,
  multiple_choice: MultipleChoiceQuestion,
  case_study: CaseStudyQuestion
};
```

Create a scoring strategy map:

```js
const scoringStrategies = {
  single_choice: scoreSingleChoice,
  multiple_choice: scoreMultipleChoice,
  case_study: scoreCaseStudy
};
```

This makes the system easier to extend with future question types such as:

* `true_false`
* `fill_blank`
* `matching`
* `short_answer`
* `coding_question`

## 13. Development Expectation

The final frontend application should be generic. It should not be limited to frontend-related questions only. The same JSON structure should be usable for other subjects such as programming, economics, finance, database systems, or project management.

The developer should focus on building a reusable quiz engine rather than a fixed quiz page.
