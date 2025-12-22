import { atom } from 'jotai';
import type { BookReviewFormData } from '@/types/bookReview';

/**
 * 폼 데이터 초기값
 */
const initialFormData: BookReviewFormData = {
  basic: {
    bookTitle: '',
    author: '',
    publisher: '',
    readingStatus: '읽고싶은책',
    startDate: undefined,
    endDate: undefined,
  },
  rating: {
    isRecommended: false,
    rating: 0,
  },
  review: {
    reviewer: '',
    content: '',
    createdAt: undefined,
    updatedAt: undefined,
  },
  quotes: {
    quotes: [{ text: '', page: undefined }],
  },
  visibilityInfo: {
    visibility: 'public',
  },
};

/**
 * 전체 폼 데이터 atom
 */
export const bookReviewAtom = atom<BookReviewFormData>(initialFormData);

/**
 * 현재 단계 atom (1~5)
 */
export const currentStepAtom = atom<number>(1);
