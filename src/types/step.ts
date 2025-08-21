// src/types/step.ts
export type StepName = 'BasicInfo' | 'Rating' | 'Review' | 'Quotation' | 'SharingOption';

export type StepNumber = 1 | 2 | 3 | 4 | 5;

export interface StepType {
  step: StepNumber;
  name: StepName;
}

export const STEP_LIST: Array<StepType> = [
  { step: 1, name: 'BasicInfo' },
  { step: 2, name: 'Rating' },
  { step: 3, name: 'Review' },
  { step: 4, name: 'Quotation' },
  { step: 5, name: 'SharingOption' },
];