// src/types/form.ts
import { Dayjs } from 'dayjs';

export type ReadingStatus = 'want-to-read' | 'reading' | 'read' | 'on-hold';

export interface BookFormStep1 {
  title: string;
  author: string;
  readingStatus: ReadingStatus;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

export interface BookFormStep2 {
  recommended: boolean;
  rating: number;
}

export interface BookFormStep3 {
  review: string;
}

export interface BookFormStep4 {
  quotes: Array<{
    text: string;
    page?: number;
  }>;
}

export interface BookFormStep5 {
  isPublic: boolean;
}

export interface BookFormData extends 
  BookFormStep1, 
  BookFormStep2, 
  BookFormStep3, 
  BookFormStep4, 
  BookFormStep5 {}