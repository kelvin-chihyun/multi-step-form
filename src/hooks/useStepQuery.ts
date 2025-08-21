// src/hooks/useStepQuery.ts
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { StepNumber } from '@/types/step';

export const useStepQuery = () => {
  const { query, isReady, pathname, replace } = useRouter();
  
  useEffect(() => {
    if (!isReady || query.step) return;
    
    replace(
      { pathname, query: { ...query, step: 1 } },
      undefined,
      { shallow: true }
    );
  }, [isReady, query, pathname, replace]);

  return {
    currentStep: Number(query.step || 1) as StepNumber,
    updateStepQuery: (step: StepNumber) => 
      replace({ pathname, query: { ...query, step } }, undefined, { shallow: true })
  };
};