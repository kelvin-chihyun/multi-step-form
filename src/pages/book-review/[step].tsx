import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { currentStepAtom, bookReviewAtom } from '@/store/formAtoms';
import { FormLayout, Basic, Rating, Review, Quotes, Visibility } from '@/components/BookReviewForm';
import type { BasicInfo, RatingInfo, ReviewInfo, QuotesInfo, VisibilityInfo } from '@/types/bookReview';

export default function BookReviewStep() {
  const router = useRouter();
  const { step } = router.query;
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [formData, setFormData] = useAtom(bookReviewAtom);

  // URL 파라미터에서 step을 숫자로 변환
  const currentStep = typeof step === 'string' ? parseInt(step, 10) : 1;

  // step 유효성 검증 및 currentStepAtom 동기화
  useEffect(() => {
    if (!router.isReady) return;

    // step이 1-5 범위를 벗어나면 step 1로 리다이렉트
    if (isNaN(currentStep) || currentStep < 1 || currentStep > 5) {
      router.replace('/book-review/1');
      return;
    }

    // currentStepAtom과 URL 동기화
    setCurrentStep(currentStep);
  }, [router.isReady, currentStep, setCurrentStep, router]);

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

  // 라우터가 준비되지 않았거나 유효하지 않은 step이면 렌더링하지 않음
  if (!router.isReady || isNaN(currentStep) || currentStep < 1 || currentStep > 5) {
    return null;
  }

  return <>{renderStep()}</>;
}
