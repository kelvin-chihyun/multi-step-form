// src/components/StepSwitcher.tsx
import { ReactNode } from 'react';
import { StepName } from '@/types/step';

interface StepSwitcherProps {
  currentStep: number;
  children: Array<{
    step: number;
    name: StepName;
    component: ReactNode;
  }>;
}

export function StepSwitcher({ currentStep, children }: StepSwitcherProps) {
  const currentStepComponent = children.find(child => child.step === currentStep);
  return <>{currentStepComponent?.component ?? null}</>;
}