/**
 * 독서 상태
 */
export type ReadingStatus = '읽고싶은책' | '읽는중' | '읽음' | '보류중';

/**
 * 공개 여부
 */
export type Visibility = 'public' | 'private';

/**
 * Step 1: 도서 기본 정보 + 독서 상태 + 독서 기간
 */
export interface BasicInfo {
  bookTitle: string;
  author: string;
  publisher: string;
  totalPages: number;
  readingStatus: ReadingStatus;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

/**
 * Step 2: 추천 여부 + 별점
 */
export interface RatingInfo {
  isRecommended: boolean;
  rating: number; // 0~5, 0.5점 스케일
}

/**
 * Step 3: 독후감
 */
export interface ReviewInfo {
  reviewer: string;
  content: string;
  createdAt?: string; // ISO 8601 format
  updatedAt?: string; // ISO 8601 format
}

/**
 * Step 4: 인용구
 */
export interface Quote {
  text: string;
  page?: number;
}

export interface QuotesInfo {
  quotes: Quote[];
}

/**
 * Step 5: 공개 여부
 */
export interface VisibilityInfo {
  visibility: Visibility;
}

/**
 * 전체 폼 데이터
 */
export interface BookReviewFormData {
  basic: BasicInfo;
  rating: RatingInfo;
  review: ReviewInfo;
  quotes: QuotesInfo;
  visibilityInfo: VisibilityInfo;
}

/**
 * 각 단계별 폼 데이터 타입
 */
export type StepFormData = BasicInfo | RatingInfo | ReviewInfo | QuotesInfo | VisibilityInfo;
