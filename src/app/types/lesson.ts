export interface LessonMethod {
  name: string;
  explanation: string;
}

export interface LessonSlide {
  id: string;
  title: string;
  code: string;
  language: string;
  explanation: string;
  methods: LessonMethod[];
  important: string[];
  output: string;
}

export interface LessonChapter {
  id: string;
  chapter: number;
  title: string;
  theme: string;
  slides: LessonSlide[];
}

export interface LessonAppendixItem {
  name: string;
  category: string;
  code: string;
  explanation: string;
  output: string;
}

export interface LessonAppendixGroupItem {
  name: string;
  code: string;
  explanation: string;
  output: string;
}

export interface LessonAppendixGroup {
  id: string;
  title: string;
  module: string;
  class: string;
  items: LessonAppendixGroupItem[];
}

export interface LessonData {
  course_id: string;
  title: string;
  description: string;
  chapters: LessonChapter[];
  appendix: {
    title: string;
    description: string;
    groups: LessonAppendixGroup[];
    items: LessonAppendixItem[];
  };
}
