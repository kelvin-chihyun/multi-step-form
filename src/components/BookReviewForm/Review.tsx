import { UseFormReturn } from 'react-hook-form';
import styled from '@emotion/styled';
import type { ReviewInfo } from '@/types/bookReview';

interface ReviewProps {
  form: UseFormReturn<ReviewInfo>;
  currentRating: number;
}

export default function Review({ form, currentRating }: ReviewProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const content = watch('content');
  const contentLength = content?.length || 0;

  // 별점이 1점 또는 5점일 경우 100자 필수
  const isContentRequired = currentRating === 1 || currentRating === 5;
  const minContentLength = isContentRequired ? 100 : 0;

  // 작성자 필수 조건: 별점 1점/5점이거나, 독후감을 작성한 경우
  const isReviewerRequired = isContentRequired || (content && content.trim().length > 0);

  return (
    <Container>
      <Title>독후감 작성</Title>

      <FormGroup>
        <Label htmlFor="reviewer">
          작성자 {isReviewerRequired && '*'}
        </Label>
        <Input
          id="reviewer"
          type="text"
          placeholder="작성자 이름을 입력해주세요"
          {...register('reviewer', {
            required: isReviewerRequired ? '작성자 이름을 입력해주세요' : false,
            minLength: {
              value: 2,
              message: '작성자 이름은 최소 2자 이상이어야 합니다',
            },
          })}
        />
        {errors.reviewer && <ErrorMessage>{errors.reviewer.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <LabelWithInfo>
          <Label htmlFor="content">
            독후감 {isContentRequired && '*'}
          </Label>
          {isContentRequired && (
            <RequiredInfo>
              별점 {currentRating}점을 선택하셨습니다. 의견을 뒷받침하기 위해 최소 100자 이상 작성해주세요.
            </RequiredInfo>
          )}
        </LabelWithInfo>
        <Textarea
          id="content"
          rows={10}
          placeholder={
            isContentRequired
              ? '별점 1점 또는 5점을 선택하셨으므로 최소 100자 이상 작성해주세요.'
              : '책을 읽고 느낀 점, 인상 깊었던 부분, 배운 점 등을 자유롭게 작성해주세요.'
          }
          {...register('content', {
            required: isContentRequired
              ? '별점 1점 또는 5점을 선택하셨으므로 독후감은 필수입니다'
              : false,
            minLength: isContentRequired
              ? {
                  value: minContentLength,
                  message: `최소 ${minContentLength}자 이상 작성해주세요`,
                }
              : undefined,
          })}
        />
        <CharacterCount isRequired={isContentRequired} isSatisfied={contentLength >= minContentLength}>
          {contentLength}자
          {isContentRequired && ` / ${minContentLength}자 이상`}
        </CharacterCount>
        {errors.content && <ErrorMessage>{errors.content.message}</ErrorMessage>}
      </FormGroup>

      <GuideBox>
        <GuideTitle>독후감 작성 가이드</GuideTitle>
        <GuideItem>• 별점 1점 또는 5점: 독후감과 작성자 필수, 독후감은 최소 100자 이상</GuideItem>
        <GuideItem>• 별점 2~4점: 독후감을 작성하지 않아도 되며, 작성하지 않으면 작성자도 생략 가능</GuideItem>
        <GuideItem>• 책의 전체적인 내용과 느낀 점을 작성해주세요</GuideItem>
        <GuideItem>• 인상 깊었던 부분이나 기억에 남는 장면을 공유해주세요</GuideItem>
        <GuideItem>• 책을 통해 배운 점이나 생각의 변화가 있다면 적어주세요</GuideItem>
      </GuideBox>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #222;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LabelWithInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const RequiredInfo = styled.p`
  font-size: 13px;
  color: #dc3545;
  font-weight: 500;
  margin: 0;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  &::placeholder {
    color: #999;
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
  line-height: 1.6;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  &::placeholder {
    color: #999;
  }
`;

const CharacterCount = styled.div<{ isRequired: boolean; isSatisfied: boolean }>`
  font-size: 13px;
  text-align: right;
  color: ${({ isRequired, isSatisfied }) =>
    isRequired ? (isSatisfied ? '#28a745' : '#dc3545') : '#666'};
  font-weight: ${({ isRequired }) => (isRequired ? '500' : '400')};
`;

const ErrorMessage = styled.span`
  font-size: 13px;
  color: #dc3545;
`;

const GuideBox = styled.div`
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
`;

const GuideTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
`;

const GuideItem = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`;
