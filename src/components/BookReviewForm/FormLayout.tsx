import { ReactNode } from 'react';
import styled from '@emotion/styled';

interface FormLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onPrevious?: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function FormLayout({
  children,
  currentStep,
  totalSteps,
  onPrevious,
  isFirstStep,
  isLastStep,
}: FormLayoutProps) {
  return (
    <Container>
      <StepIndicator>
        Step {currentStep} / {totalSteps}
      </StepIndicator>

      <FormContent>{children}</FormContent>

      <ButtonGroup>
        {!isFirstStep && (
          <Button type="button" onClick={onPrevious} variant="secondary">
            이전
          </Button>
        )}
        <Button type="submit" variant="primary">
          {isLastStep ? '제출' : '다음'}
        </Button>
      </ButtonGroup>
    </Container>
  );
}

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const StepIndicator = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  text-align: center;
`;

const FormContent = styled.div`
  margin-bottom: 32px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${({ variant }) =>
    variant === 'primary'
      ? `
    background-color: #007bff;
    color: white;
    border: none;

    &:hover {
      background-color: #0056b3;
    }
  `
      : `
    background-color: white;
    color: #333;
    border: 1px solid #ddd;

    &:hover {
      background-color: #f5f5f5;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
