import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { currentStepAtom, bookReviewAtom } from '@/store/formAtoms';
import { FormLayout, Basic, Rating, Review, Quotes, Visibility } from '@/components/BookReviewForm';
import type { BasicInfo, RatingInfo, ReviewInfo, QuotesInfo, VisibilityInfo } from '@/types/bookReview';

export default function Home() {
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);
  const [formData, setFormData] = useAtom(bookReviewAtom);

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
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleBasicSubmit = (data: BasicInfo) => {
    setFormData((prev) => ({
      ...prev,
      basic: data,
    }));
    setCurrentStep(2);
  };

  const handleRatingSubmit = (data: RatingInfo) => {
    setFormData((prev) => ({
      ...prev,
      rating: data,
    }));
    setCurrentStep(3);
  };

  const handleReviewSubmit = (data: ReviewInfo) => {
    setFormData((prev) => ({
      ...prev,
      review: data,
    }));
    setCurrentStep(4);
  };

  const handleQuotesSubmit = (data: QuotesInfo) => {
    setFormData((prev) => ({
      ...prev,
      quotes: data,
    }));
    setCurrentStep(5);
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
    // setCurrentStep(1);
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
        return (
          <form onSubmit={basicForm.handleSubmit(handleBasicSubmit)}>
            <FormLayout
              currentStep={currentStep}
              totalSteps={5}
              onPrevious={handlePrevious}
              isFirstStep={currentStep === 1}
              isLastStep={currentStep === 5}
            >
              <Basic form={basicForm} />
            </FormLayout>
          </form>
        );
    }
  };

  return <>{renderStep()}</>;
}