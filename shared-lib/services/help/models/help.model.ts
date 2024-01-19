export interface HelpContent {
  pageHeader: string;
  categoryList: Array<CategoryList>;
  StillHaveQuestionsTile: StillHaveQuestionsTile;
}

export interface StillHaveQuestionsTile {
  questionsText: string;
  helpEmailLink: string;
  helpEmailText: string;
}
export interface CategoryList {
  category: Category;
}

export interface Category {
  title: string;
  enableMyVoyage?: boolean;
  questionList: Array<QuestionList>;
}

export interface QuestionList {
  question: string;
  enableMyVoyage?: boolean;
  description: string;
}

export interface HelpMenuConfig {
  items: {
    text: string;
    category: Category;
  }[];
}

export interface HelpContentOption {
  actionOption: {
    buttonLeft: string;
    buttonRight: string;
  };
  backBtn: string;
}
