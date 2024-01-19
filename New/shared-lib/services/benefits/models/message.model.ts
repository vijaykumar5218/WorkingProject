export interface CoverageExplanationsOOPDeductible {
  Benefit: Benefit[];
}
export interface Benefit {
  benefit_type: string;
  explanations: Explanations[];
  benefit_type_title: string;
}

export interface Explanations {
  outOfPocketTitle: string;
  outOfPocketDescription: string;
  deductibleTitle: string;
  deductibleDescription: string;
}
