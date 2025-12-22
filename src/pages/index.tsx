import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { currentStepAtom, bookReviewAtom } from '@/store/formAtoms';
import FormLayout from '@/components/BookReviewForm/FormLayout';
import Basic from '@/components/BookReviewForm/Basic';
import Rating from '@/components/BookReviewForm/Rating';
import type { BasicInfo, RatingInfo } from '@/types/bookReview';

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
        return <div>Step 3 - Review (Coming soon)</div>;
      case 4:
        return <div>Step 4 - Quotes (Coming soon)</div>;
      case 5:
        return <div>Step 5 - Visibility (Coming soon)</div>;
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