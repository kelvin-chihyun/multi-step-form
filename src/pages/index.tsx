import { useAtom } from 'jotai';
import { currentStepAtom } from '@/store/formAtoms';
import FormLayout from '@/components/BookReviewForm/FormLayout';

export default function Home() {
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <FormLayout
      currentStep={currentStep}
      totalSteps={5}
      onPrevious={handlePrevious}
      onNext={handleNext}
      isFirstStep={currentStep === 1}
      isLastStep={currentStep === 5}
    >
      <div>Multi-Step Book Review Form</div>
    </FormLayout>
  );
}