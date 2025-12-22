import { useAtom } from 'jotai';
import { currentStepAtom } from '@/store/formAtoms';
import FormLayout from '@/components/BookReviewForm/FormLayout';
import Basic from '@/components/BookReviewForm/Basic';

export default function Home() {
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Basic onNext={handleNext} />;
      case 2:
        return <div>Step 2 - Rating (Coming soon)</div>;
      case 3:
        return <div>Step 3 - Review (Coming soon)</div>;
      case 4:
        return <div>Step 4 - Quotes (Coming soon)</div>;
      case 5:
        return <div>Step 5 - Visibility (Coming soon)</div>;
      default:
        return <Basic onNext={handleNext} />;
    }
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
      {renderStep()}
    </FormLayout>
  );
}