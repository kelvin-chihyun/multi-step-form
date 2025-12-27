import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { currentStepAtom, bookReviewAtom } from '@/store/formAtoms';
import { FormLayout, Basic, Rating, Review, Quotes, Visibility } from '@/components/BookReviewForm';
import type { BasicInfo, RatingInfo, ReviewInfo, QuotesInfo, VisibilityInfo } from '@/types/bookReview';

export default function BookReviewStep() {
  const router = useRouter();
  const { step } = router.query;
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [formData, setFormData] = useAtom(bookReviewAtom);

  // URL 파라미터에서 step을 숫자로 변환
  const stepParam = Array.isArray(step) ? step[0] : step;
  const currentStep = stepParam ? parseInt(stepParam, 10) : 1;

  // 각 단계별 필수 데이터 검증
  const validateStepData = useCallback((step: number): number | null => {
    switch (step) {
      case 1:
        return null; // 첫 단계는 검증 불필요
      case 2:
        // Step 2: 기본 정보가 입력되어 있어야 함
        if (!formData.basic.bookTitle || !formData.basic.author || !formData.basic.publisher) {
          return 1; // Step 1로 리다이렉트
        }
        return null;
      case 3:
        // Step 3: 별점이 선택되어 있어야 함
        if (formData.rating.rating === 0) {
          return 2; // Step 2로 리다이렉트
        }
        return null;
      case 4:
        // Step 4: 독후감 검증 (별점 1점/5점이면 필수)
        const isContentRequired = formData.rating.rating === 1 || formData.rating.rating === 5;
        if (isContentRequired && !formData.review.content) {
          return 3; // Step 3으로 리다이렉트
        }
        return null;
      case 5:
        // Step 5: 인용구가 입력되어 있어야 함
        if (!formData.quotes.quotes[0]?.text) {
          return 4; // Step 4로 리다이렉트
        }
        return null;
      default:
        return 1;
    }
  }, [formData]);

  // step 유효성 검증 및 currentStepAtom 동기화
  useEffect(() => {
    if (!router.isReady) return;

    // step이 1-5 범위를 벗어나면 step 1로 리다이렉트
    if (isNaN(currentStep) || currentStep < 1 || currentStep > 5) {
      router.replace('/book-review/1');
      return;
    }

    // 각 단계별 필수 데이터 검증
    const redirectStep = validateStepData(currentStep);
    if (redirectStep !== null) {
      router.replace(`/book-review/${redirectStep}`);
      return;
    }

    // currentStepAtom과 URL 동기화
    setCurrentStep(currentStep);
    // router 객체는 Next.js에서 안정적인 참조를 유지하므로 의존성 배열에서 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, currentStep, setCurrentStep, validateStepData]);

  const basicForm = useForm<BasicInfo>({
    defaultValues: formData.basic,
    mode: 'onChange',
  });

  const ratingForm = useForm<RatingInfo>({
    defaultValues: formData.rating,
    mode: 'onChange',
  });

  const reviewForm = useForm<ReviewInfo>({
    defaultValues: formData.review,
    mode: 'onChange',
  });

  const quotesForm = useForm<QuotesInfo>({
    defaultValues: formData.quotes,
    mode: 'onChange',
  });

  const visibilityForm = useForm<VisibilityInfo>({
    defaultValues: formData.visibilityInfo,
    mode: 'onChange',
  });

  const handlePrevious = () => {
    const prevStep = Math.max(currentStep - 1, 1);
    router.push(`/book-review/${prevStep}`);
  };

  const handleBasicSubmit = (data: BasicInfo) => {
    setFormData((prev) => ({
      ...prev,
      basic: data,
    }));
    router.push('/book-review/2');
  };

  const handleRatingSubmit = (data: RatingInfo) => {
    setFormData((prev) => ({
      ...prev,
      rating: data,
    }));
    router.push('/book-review/3');
  };

  const handleReviewSubmit = (data: ReviewInfo) => {
    setFormData((prev) => ({
      ...prev,
      review: data,
    }));
    router.push('/book-review/4');
  };

  const handleQuotesSubmit = (data: QuotesInfo) => {
    setFormData((prev) => ({
      ...prev,
      quotes: data,
    }));
    router.push('/book-review/5');
  };

  const handleVisibilitySubmit = (data: VisibilityInfo) => {
    const finalData = {
      ...formData,
      visibilityInfo: data,
    };
    setFormData(finalData);

    // 최종 제출 처리
    console.log('📚 독서 기록 제출:', finalData);
    alert('독서 기록이 성공적으로 제출되었습니다!');

    // 폼 초기화 및 첫 단계로 이동 (선택사항)
    // router.push('/book-review/1');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <form onSubmit={basicForm.handleSubmit(handleBasicSubmit)}>
            <FormLayout
              currentStep={currentStep}
              totalSteps={5}
              onPrevious={handlePrevious}
              isFirstStep={true}
              isLastStep={false}
            >
              <Basic form={basicForm} />
            </FormLayout>
          </form>
        );
      case 2:
        return (
          <form onSubmit={ratingForm.handleSubmit(handleRatingSubmit)}>
            <FormLayout
              currentStep={currentStep}
              totalSteps={5}
              onPrevious={handlePrevious}
              isFirstStep={false}
              isLastStep={false}
            >
              <Rating form={ratingForm} />
            </FormLayout>
          </form>
        );
      case 3:
        return (
          <form onSubmit={reviewForm.handleSubmit(handleReviewSubmit)}>
            <FormLayout
              currentStep={currentStep}
              totalSteps={5}
              onPrevious={handlePrevious}
              isFirstStep={false}
              isLastStep={false}
            >
              <Review form={reviewForm} currentRating={formData.rating.rating} />
            </FormLayout>
          </form>
        );
      case 4:
        return (
          <form onSubmit={quotesForm.handleSubmit(handleQuotesSubmit)}>
            <FormLayout
              currentStep={currentStep}
              totalSteps={5}
              onPrevious={handlePrevious}
              isFirstStep={false}
              isLastStep={false}
            >
              <Quotes form={quotesForm} totalPages={formData.basic.totalPages} />
            </FormLayout>
          </form>
        );
      case 5:
        return (
          <form onSubmit={visibilityForm.handleSubmit(handleVisibilitySubmit)}>
            <FormLayout
              currentStep={currentStep}
              totalSteps={5}
              onPrevious={handlePrevious}
              isFirstStep={false}
              isLastStep={true}
            >
              <Visibility form={visibilityForm} />
            </FormLayout>
          </form>
        );
      default:
        return null;
    }
  };

  // 라우터가 준비되지 않았거나 유효하지 않은 step이면 로딩 표시
  if (!router.isReady || isNaN(currentStep) || currentStep < 1 || currentStep > 5) {
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingText>페이지를 불러오는 중...</LoadingText>
      </LoadingContainer>
    );
  }

  return <>{renderStep()}</>;
}

// 로딩 스피너 애니메이션
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 16px;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;
