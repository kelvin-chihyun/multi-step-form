// src/hooks/useStepNavigator.ts
import { useState, useEffect } from 'react';
import { STEP_LIST, StepName, StepNumber } from '../types/step';
import { useStepQuery } from './useStepQuery';

export const useStepNavigator = () => {
  const { currentStep: queryStep, updateStepQuery } = useStepQuery();
  const [currentStep, setCurrentStep] = useState<StepNumber>(queryStep);
  const [isLoading, setIsLoading] = useState(false);

  // URL 쿼리와 내부 상태 동기화
  useEffect(() => {
    setCurrentStep(queryStep);
  }, [queryStep]);

  const currentStepInfo = STEP_LIST.find(step => step.step === currentStep);

  const goNext = () => {
    if (currentStep < STEP_LIST.length) {
      const nextStep = (currentStep + 1) as StepNumber;
      setCurrentStep(nextStep);
      updateStepQuery(nextStep);
    }
  };

  const goPrevious = () => {
    if (currentStep > 1) {
      const prevStep = (currentStep - 1) as StepNumber;
      setCurrentStep(prevStep);
      updateStepQuery(prevStep);
    }
  };

  const goToStep = (stepNumber: StepNumber) => {
    if (stepNumber >= 1 && stepNumber <= STEP_LIST.length) {
      setCurrentStep(stepNumber);
      updateStepQuery(stepNumber);
    }
  };

  const goToStepByName = (stepName: StepName) => {
    const targetStep = STEP_LIST.find(step => step.name === stepName);
    if (targetStep) {
      setCurrentStep(targetStep.step);
      updateStepQuery(targetStep.step);
    }
  };

  return {
    currentStep,
    stepName: currentStepInfo?.name,
    isLoading,
    isFirst: currentStep === 1,
    isLast: currentStep === STEP_LIST.length,
    totalSteps: STEP_LIST.length,
    goNext,
    goPrevious,
    goToStep,
    goToStepByName,
    setIsLoading,
  };
};