# UI/UX Research Specification: Wayground-Inspired Quiz Learning Platform

## 1. Research Context

Wayground, formerly known as Quizizz, is a learning platform focused on quizzes, assessments, lessons, practice activities, and teacher-supported learning resources. From a UI/UX perspective, Wayground is useful as a reference because it combines three important product directions:

1. A quiz-based learning experience.
2. A content discovery platform for educational resources.
3. A gamified interface that makes assessment feel less formal and more engaging.

For this project, Wayground should be treated as a design reference, not as a product to copy directly. The goal is to understand its interface logic, user flows, visual hierarchy, interaction patterns, and learning-oriented design principles, then adapt them into a custom frontend quiz application that loads quiz content from JSON.

---

## 2. Product Design Direction

The proposed frontend application should behave like a lightweight learning platform rather than a simple one-page quiz app.

The main design direction is:

> A quiz learning platform where users can browse quiz collections, open a quiz, answer questions, review results, and continue learning through dynamic JSON-based content.

The interface should feel:

* Friendly
* Educational
* Gamified
* Modern
* Easy to navigate
* Content-focused
* Suitable for students and teachers

The app should not look like a traditional exam form. Instead, it should feel like an interactive learning experience.

---

## 3. Interface Characteristics of Wayground

### 3.1 Educational but Playful

Wayground-style interfaces usually avoid a dry academic feeling. Instead, they use:

* Rounded cards
* Friendly illustrations
* Bright accent colors
* Simple icons
* Large call-to-action buttons
* Gamified feedback
* Progress indicators
* Clear score/result screens

For this project, the UI should balance two feelings:

| Design Quality | Meaning                                                            |
| -------------- | ------------------------------------------------------------------ |
| Educational    | The app must still look serious enough for learning and assessment |
| Playful        | The app should reduce pressure and make quizzes feel engaging      |
| Structured     | Users should always know where they are in the quiz flow           |
| Flexible       | The same UI should support different JSON quiz files               |

---

## 4. Information Architecture

The app should be organized into the following main areas:

```text
App
├── Landing Page
├── Home / Dashboard
├── Quiz Library
├── Quiz Detail
├── Quiz Player
├── Case Study Player
├── Review Before Submit
├── Result Page
├── Answer Review Page
├── Upload / Import JSON Page
└── Profile / Progress Page
```

### 4.1 Landing Page

Purpose:

* Introduce the quiz platform.
* Explain that users can learn through dynamic quizzes.
* Provide CTA buttons.

Main components:

* Hero section
* Short product description
* “Start Learning” button
* “Import JSON Quiz” button
* Feature cards
* Example quiz preview

### 4.2 Home / Dashboard

Purpose:

* Show learning content immediately.
* Help users resume or discover quizzes.

Main sections:

* Continue Learning
* Recommended Quizzes
* Recently Attempted
* Popular Subjects
* Case Study Collections
* Uploaded JSON Quizzes

### 4.3 Quiz Library

Purpose:

* Display all available quizzes.

Filters:

* Subject
* Difficulty
* Duration
* Question type
* Status
* Tags

### 4.4 Quiz Detail

Purpose:

* Let the user preview quiz information before starting.

Content:

* Quiz title
* Description
* Number of questions
* Time limit
* Difficulty
* Tags
* Supported question types
* Passing score
* Start button

### 4.5 Quiz Player

Purpose:

* Main quiz-taking screen.

Components:

* Question title
* Question text
* Options
* Progress bar
* Timer
* Navigation buttons
* Question index
* Save state indicator

### 4.6 Case Study Player

Purpose:

* Render scenario-based questions.

Layout should separate:

* Case context
* Requirements
* Data sample
* Sub-questions

A two-column layout is recommended on desktop:

```text
┌─────────────────────────────┬─────────────────────────────┐
│ Case Context                │ Sub-question Panel          │
│ Scenario                    │ Question                    │
│ Requirements                │ Options                     │
│ Data Sample                 │ Navigation                  │
└─────────────────────────────┴─────────────────────────────┘
```

On mobile, the layout should stack vertically.

### 4.7 Review Before Submit

Purpose:

* Let users check unanswered questions before submitting.

Components:

* Question list
* Answered/unanswered status
* Jump-to-question action
* Submit confirmation

### 4.8 Result Page

Purpose:

* Show final performance.

Components:

* Final score
* Percentage
* Pass/fail status
* Result message
* Correct/incorrect count
* Time spent
* Restart button
* Review answers button

---

## 5. Wireframe Proposal

### 5.1 Landing Page Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ Logo                     Home  Library  Upload JSON  Profile │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Learn smarter with interactive JSON-powered quizzes          │
│  Turn any structured quiz file into a learning experience.    │
│                                                              │
│  [Start Learning]   [Import JSON Quiz]                       │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  Feature Cards                                                │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                │
│  │ Dynamic    │ │ Case Study │ │ Review     │                │
│  │ JSON Quiz  │ │ Questions  │ │ Answers    │                │
│  └────────────┘ └────────────┘ └────────────┘                │
└──────────────────────────────────────────────────────────────┘
```

### 5.2 Dashboard Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ Sidebar          │ Main Content                              │
│                  │                                           │
│ Home             │ Welcome back                              │
│ Library          │ Continue Learning                         │
│ Upload JSON      │ ┌──────────────┐ ┌──────────────┐         │
│ Results          │ │ Quiz Card    │ │ Quiz Card    │         │
│ Profile          │ └──────────────┘ └──────────────┘         │
│                  │                                           │
│                  │ Recommended Quizzes                       │
│                  │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│                  │ │Card  │ │Card  │ │Card  │ │Card  │      │
│                  │ └──────┘ └──────┘ └──────┘ └──────┘      │
└──────────────────────────────────────────────────────────────┘
```

### 5.3 Quiz Detail Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ Back to Library                                               │
├──────────────────────────────────────────────────────────────┤
│ JavaScript Fundamentals                                       │
│ Beginner • 20 questions • 15 minutes • Passing score: 70%    │
│                                                              │
│ This quiz tests basic JavaScript syntax, data types, and DOM. │
│                                                              │
│ Tags: JavaScript, Frontend, Beginner                          │
│                                                              │
│ [Start Quiz]                                                  │
└──────────────────────────────────────────────────────────────┘
```

### 5.4 Quiz Player Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ Quiz Title                              Timer: 14:25          │
│ Progress: █████████░░░░░░░░  8 / 20                          │
├──────────────────────────────────────────────────────────────┤
│ Question 8                                                    │
│ Which HTML tag is used to create a hyperlink?                 │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ A. <div>                                                  │ │
│ └──────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ B. <a>                                                    │ │
│ └──────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ C. <span>                                                 │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ [Previous]                                      [Next]        │
└──────────────────────────────────────────────────────────────┘
```

### 5.5 Result Page Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ Result                                                       │
├──────────────────────────────────────────────────────────────┤
│                    85%                                       │
│                 You passed!                                  │
│                                                              │
│ Correct answers: 17 / 20                                     │
│ Time spent: 12 minutes                                       │
│                                                              │
│ [Review Answers]   [Retry Quiz]   [Back to Library]          │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Frontend Structure

Recommended frontend structure:

```text
src
├── assets
│   ├── icons
│   ├── illustrations
│   └── quiz-covers
├── components
│   ├── layout
│   │   ├── AppShell
│   │   ├── Sidebar
│   │   ├── Navbar
│   │   └── PageHeader
│   ├── quiz
│   │   ├── QuizCard
│   │   ├── QuizDetail
│   │   ├── QuizPlayer
│   │   ├── SingleChoiceQuestion
│   │   ├── MultipleChoiceQuestion
│   │   ├── CaseStudyQuestion
│   │   ├── QuestionNavigation
│   │   ├── QuizProgress
│   │   ├── QuizTimer
│   │   └── ResultSummary
│   ├── upload
│   │   ├── JsonUploader
│   │   └── JsonValidationResult
│   └── common
│       ├── Button
│       ├── Card
│       ├── Badge
│       ├── Modal
│       └── EmptyState
├── data
│   └── sampleQuiz.json
├── hooks
│   ├── useQuizState
│   ├── useQuizTimer
│   ├── useLocalStorage
│   └── useJsonValidation
├── pages
│   ├── LandingPage
│   ├── DashboardPage
│   ├── QuizLibraryPage
│   ├── QuizDetailPage
│   ├── QuizPlayerPage
│   ├── ResultPage
│   └── UploadJsonPage
├── services
│   ├── quizParser
│   ├── quizValidator
│   └── scoringService
├── styles
│   ├── tokens.css
│   └── globals.css
└── App
```

---

## 7. Use Case Specification

### Use Case 1: Browse Quiz Library

**Actor:** Student
**Goal:** Find a quiz to practice.
**Precondition:** Quiz data exists in the system.
**Main Flow:**

1. User opens the dashboard.
2. System displays recommended quizzes and categories.
3. User clicks “Library”.
4. User filters quizzes by subject, difficulty, or duration.
5. User selects a quiz card.
6. System opens the quiz detail page.

**Postcondition:** User can start the selected quiz.

---

### Use Case 2: Import JSON Quiz

**Actor:** Teacher / Student / Developer
**Goal:** Upload a custom JSON quiz file.
**Precondition:** User has a valid JSON file.
**Main Flow:**

1. User opens “Upload JSON”.
2. User selects or drags a JSON file.
3. System validates the file structure.
4. If valid, system previews quiz metadata.
5. User confirms import.
6. System adds the quiz to the local library.

**Alternative Flow:**

* If JSON is invalid, the system displays validation errors.

**Postcondition:** Imported quiz becomes available in the quiz library.

---

### Use Case 3: Take a Quiz

**Actor:** Student
**Goal:** Complete a quiz.
**Precondition:** User has selected a quiz.
**Main Flow:**

1. User clicks “Start Quiz”.
2. System displays the first question.
3. User selects an answer.
4. User navigates to the next question.
5. System saves progress.
6. User completes all questions.
7. User opens review page.
8. User submits quiz.
9. System calculates score.
10. System displays result page.

**Postcondition:** User receives score and feedback.

---

### Use Case 4: Answer Case Study Question

**Actor:** Student
**Goal:** Read a case and answer related sub-questions.
**Precondition:** Quiz contains a `case_study` question.
**Main Flow:**

1. System displays case context.
2. User reads scenario and requirements.
3. User answers sub-question 1.
4. User answers remaining sub-questions.
5. System saves all sub-question answers.
6. Score is calculated based on sub-question correctness.

**Postcondition:** Case study score contributes to total quiz score.

---

### Use Case 5: Review Answers

**Actor:** Student
**Goal:** Understand mistakes after completing quiz.
**Precondition:** User has submitted quiz.
**Main Flow:**

1. User clicks “Review Answers”.
2. System displays each question.
3. System highlights selected answer.
4. System highlights correct answer.
5. System shows explanation.
6. User can retry the quiz or return to library.

**Postcondition:** User understands correct and incorrect answers.

---

## 8. User Stories

### Student Stories

```text
As a student, I want to browse quizzes by subject so that I can quickly find practice materials for the topic I am studying.
```

```text
As a student, I want to see quiz difficulty and estimated duration before starting so that I can choose a quiz that fits my available time.
```

```text
As a student, I want my answers to be saved automatically so that I do not lose progress if I refresh the page.
```

```text
As a student, I want to review correct answers and explanations after submission so that I can learn from my mistakes.
```

```text
As a student, I want to answer case-study questions with the scenario visible so that I can connect the context with each sub-question.
```

### Teacher / Content Creator Stories

```text
As a teacher, I want to upload a quiz JSON file so that I can quickly create a quiz without editing frontend code.
```

```text
As a teacher, I want the system to validate my JSON file so that I can detect missing fields or wrong answer formats.
```

```text
As a teacher, I want to preview the quiz before students use it so that I can check question quality and formatting.
```

### Developer Stories

```text
As a developer, I want each question type to have its own renderer so that I can add new question types without rewriting the entire quiz player.
```

```text
As a developer, I want scoring logic to be separated from UI components so that the system is easier to test and maintain.
```

```text
As a developer, I want the app to treat JSON as the source of truth so that different quizzes can be loaded dynamically.
```

---

## 9. Visual Identity Direction

### 9.1 Brand Feeling

The visual identity should be inspired by Wayground’s playful learning style but adapted into a unique brand.

Suggested brand personality:

* Smart
* Friendly
* Energetic
* Trustworthy
* Student-centered
* Gamified but not childish

### 9.2 Layout Style

Recommended layout style:

* Rounded cards
* Soft shadows
* Large readable headings
* Clear button hierarchy
* Colorful subject tags
* Friendly empty states
* Dashboard-based navigation
* Consistent spacing

### 9.3 Component Shape

Recommended component shape:

| Component    | Style                                     |
| ------------ | ----------------------------------------- |
| Cards        | Rounded corners, soft shadow, clear title |
| Buttons      | Rounded, bold label, strong hover state   |
| Badges       | Small pill shape                          |
| Quiz options | Large selectable cards                    |
| Progress bar | Horizontal, colorful, animated            |
| Timer        | Visible but not too aggressive            |
| Result score | Large circular or centered score display  |

---

## 10. Color Palette

The palette should feel educational, gamified, and modern. It should not directly copy Wayground’s exact brand colors. Instead, use a Wayground-inspired playful palette.

### 10.1 Light Mode Palette

```text
Primary Purple:     #6C4DFF
Primary Hover:      #5638E8
Secondary Blue:     #3B82F6
Accent Yellow:      #FFD166
Accent Green:       #22C55E
Accent Red:         #EF4444
Background:         #F8F7FF
Surface:            #FFFFFF
Text Primary:       #1F2937
Text Secondary:     #6B7280
Border:             #E5E7EB
```

### 10.2 Dark Mode Palette

```text
Primary Purple:     #8B5CF6
Primary Hover:      #7C3AED
Secondary Blue:     #60A5FA
Accent Yellow:      #FACC15
Accent Green:       #34D399
Accent Red:         #F87171
Background:         #111827
Surface:            #1F2937
Surface Elevated:   #273449
Text Primary:       #F9FAFB
Text Secondary:     #D1D5DB
Border:             #374151
```

### 10.3 Semantic Colors

```text
Correct Answer:     #22C55E
Wrong Answer:       #EF4444
Warning:            #F59E0B
Info:               #3B82F6
Disabled:           #9CA3AF
```

### 10.4 Subject Colors

```text
Frontend:           #3B82F6
Backend:            #10B981
Database:           #F59E0B
AI / Machine Learning: #8B5CF6
Finance:            #14B8A6
Project Management: #EC4899
```

---

## 11. Typography

Recommended font direction:

* Use a clean sans-serif font.
* Headings should be bold and friendly.
* Body text should be highly readable.

Suggested fonts:

```text
Primary font: Inter, Manrope, or Nunito Sans
Heading weight: 700–800
Body weight: 400–500
Button weight: 600–700
```

Typography scale:

```text
Display: 40–48px
H1: 32px
H2: 24px
H3: 20px
Body: 16px
Small: 14px
Caption: 12px
```

---

## 12. Component Design

### 12.1 Quiz Card

A quiz card should display:

* Cover image or color block
* Quiz title
* Subject
* Difficulty
* Number of questions
* Duration
* Progress status
* Start or Continue button

Example structure:

```text
┌──────────────────────────────┐
│ Cover / Icon                 │
├──────────────────────────────┤
│ JavaScript Fundamentals      │
│ Frontend • Beginner          │
│ 20 questions • 15 min        │
│ Progress: 45%                │
│ [Continue]                   │
└──────────────────────────────┘
```

### 12.2 Question Option

Question options should be large and easy to click.

States:

| State     | Visual Behavior                    |
| --------- | ---------------------------------- |
| Default   | White or dark surface card         |
| Hover     | Slight border highlight            |
| Selected  | Primary border and soft background |
| Correct   | Green border/background            |
| Incorrect | Red border/background              |
| Disabled  | Lower opacity                      |

### 12.3 Progress Bar

The progress bar should show:

* Current question index
* Completion percentage
* Optional answered count

### 12.4 Timer

Timer should be visible but not stressful.

Suggested behavior:

* Normal: neutral text
* Less than 20% time: warning color
* Less than 5% time: red color

### 12.5 Result Summary

Result summary should include:

* Score percentage
* Pass/fail status
* Correct answers
* Time spent
* Encouraging message
* Review button
* Retry button

---

## 13. Interaction Design

### 13.1 Answer Selection

For `single_choice`:

* Selecting one option deselects the previous option.
* The selected option should be visually clear.

For `multiple_choice`:

* User can toggle each option.
* The selected options should remain highlighted.

For `case_study`:

* Case context should remain accessible while answering sub-questions.
* On desktop, keep context and questions side-by-side.
* On mobile, use collapsible context.

### 13.2 Navigation

Quiz navigation should support:

* Next question
* Previous question
* Jump to question from review panel
* Submit only after confirmation
* Warning for unanswered questions

### 13.3 Feedback

There are two possible feedback modes:

1. Immediate feedback
   Show correct/incorrect after each answer.

2. Delayed feedback
   Show correct/incorrect only after final submission.

The app should support both modes through JSON or app config.

---

## 14. Accessibility Requirements

The interface should be usable for different learners.

Minimum accessibility requirements:

* High color contrast
* Keyboard navigation
* Focus states for buttons and options
* ARIA labels for quiz controls
* Text alternatives for icons/images
* Do not rely only on color to show correct/wrong answers
* Large clickable areas
* Responsive layout for mobile users

---

## 15. Responsive Design

### Desktop

Recommended layout:

* Sidebar navigation
* Main dashboard content
* Multi-column cards
* Case study two-column mode

### Tablet

Recommended layout:

* Collapsible sidebar
* Two-column cards
* Stacked quiz detail layout

### Mobile

Recommended layout:

* Bottom navigation or hamburger menu
* Single-column cards
* Large buttons
* Sticky quiz navigation
* Collapsible case context

---

## 16. Page-Level Frontend Requirements

### 16.1 Landing Page

Components:

* Navbar
* Hero section
* Feature cards
* Sample quiz preview
* CTA buttons

### 16.2 Dashboard Page

Components:

* Sidebar
* Greeting header
* Continue learning section
* Recommended quizzes
* Subject categories
* Recent activity

### 16.3 Library Page

Components:

* Search bar
* Filter chips
* Sort dropdown
* Quiz grid
* Empty state

### 16.4 Upload JSON Page

Components:

* Drag-and-drop uploader
* JSON validation result
* Preview metadata
* Import button
* Error list

### 16.5 Quiz Player Page

Components:

* Timer
* Progress bar
* Question renderer
* Option selector
* Previous/next buttons
* Save status

### 16.6 Result Page

Components:

* Score display
* Result message
* Breakdown cards
* Review answers
* Retry quiz
* Back to library

---

## 17. Recommended UI States

The app should handle these states clearly:

```text
Loading quiz data
Invalid JSON
Empty quiz library
No search results
Quiz in progress
Quiz submitted
Time expired
Answer selected
Answer not selected
Case study expanded
Case study collapsed
Result passed
Result failed
```

---

## 18. Suggested MVP Scope

For the first version, implement:

1. Load quiz from local JSON.
2. Render quiz library.
3. Render quiz detail.
4. Support `single_choice`.
5. Support `multiple_choice`.
6. Support `case_study`.
7. Save progress in localStorage.
8. Calculate score.
9. Show result page.
10. Review answers after submission.

Do not overbuild the first version with authentication, backend, teacher dashboard, or complex analytics unless required.

---

## 19. Future Enhancement Ideas

Possible future features:

* User login
* Quiz sharing link
* Teacher dashboard
* Student progress analytics
* Leaderboard
* AI-generated quiz from document
* Import from PDF/text
* Export result report
* Spaced repetition mode
* Flashcard mode
* Classroom live mode
* Random question bank mode

---

## 20. Design Summary

The Wayground-inspired design should focus on:

* Fast quiz discovery
* Friendly learning experience
* Gamified interaction
* Clear quiz progress
* Dynamic JSON-driven content
* Strong visual hierarchy
* Reusable frontend components
* Extensible question rendering system

The final product should feel like a modern educational quiz platform rather than a static quiz form. It should support flexible quiz content, clear learning feedback, and a visually engaging interface suitable for both students and teachers.
