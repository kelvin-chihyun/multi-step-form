import { UseFormReturn, Controller } from 'react-hook-form';
import styled from '@emotion/styled';
import type { RatingInfo } from '@/types/bookReview';

interface RatingProps {
  form: UseFormReturn<RatingInfo>;
}

export default function Rating({ form }: RatingProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const currentRating = watch('rating');

  const handleStarClick = (star: number, isHalf: boolean, onChange: (value: number) => void) => {
    const rating = isHalf ? star - 0.5 : star;
    onChange(rating);
  };

  return (
    <Container>
      <Title>도서 평가</Title>

      <FormGroup>
        <Label>
          <Checkbox type="checkbox" {...register('isRecommended')} />
          이 책을 추천합니다
        </Label>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="rating">별점 *</Label>
        <RatingDescription>별을 클릭하여 0.5점 단위로 선택하실 수 있습니다. (왼쪽: 0.5점, 오른쪽: 1점)</RatingDescription>

        <Controller
          name="rating"
          control={control}
          rules={{
            required: '별점을 선택해주세요',
            min: { value: 0, message: '별점은 0점 이상이어야 합니다' },
            max: { value: 5, message: '별점은 5점 이하여야 합니다' },
          }}
          render={({ field }) => (
            <RatingContainer>
              <StarVisualContainer>
                {[1, 2, 3, 4, 5].map((star) => {
                  const fillPercentage =
                    currentRating >= star
                      ? 100
                      : currentRating >= star - 0.5
                      ? 50
                      : 0;

                  return (
                    <StarWrapper key={star}>
                      <StarBackground>★</StarBackground>
                      <StarFilled fillPercentage={fillPercentage}>★</StarFilled>
                      <ClickArea
                        type="button"
                        isLeft
                        onClick={() => handleStarClick(star, true, field.onChange)}
                      />
                      <ClickArea
                        type="button"
                        isLeft={false}
                        onClick={() => handleStarClick(star, false, field.onChange)}
                      />
                    </StarWrapper>
                  );
                })}
                <RatingValue>{currentRating.toFixed(1)}점</RatingValue>
              </StarVisualContainer>
            </RatingContainer>
          )}
        />
        {errors.rating && <ErrorMessage>{errors.rating.message}</ErrorMessage>}
      </FormGroup>

      <RatingGuide>
        <GuideTitle>별점 가이드</GuideTitle>
        <GuideItem>★★★★★ (5.0) - 최고예요! 강력 추천합니다</GuideItem>
        <GuideItem>★★★★ (4.0) - 좋아요! 추천합니다</GuideItem>
        <GuideItem>★★★ (3.0) - 괜찮아요</GuideItem>
        <GuideItem>★★ (2.0) - 별로예요</GuideItem>
        <GuideItem>★ (1.0) - 추천하지 않아요</GuideItem>
      </RatingGuide>
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

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const RatingDescription = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0;
`;

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StarVisualContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StarWrapper = styled.div`
  position: relative;
  display: inline-block;
  font-size: 48px;
  cursor: pointer;
  user-select: none;
`;

const StarBackground = styled.span`
  color: #e0e0e0;
`;

const StarFilled = styled.span<{ fillPercentage: number }>`
  position: absolute;
  top: 0;
  left: 0;
  color: #ffc107;
  overflow: hidden;
  width: ${({ fillPercentage }) => fillPercentage}%;
  pointer-events: none;
`;

const ClickArea = styled.button<{ isLeft: boolean }>`
  position: absolute;
  top: 0;
  left: ${({ isLeft }) => (isLeft ? '0' : '50%')};
  width: 50%;
  height: 100%;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const RatingValue = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #007bff;
`;

const RatingGuide = styled.div`
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

  &:last-child {
    margin-bottom: 0;
  }
`;

const ErrorMessage = styled.span`
  font-size: 13px;
  color: #dc3545;
`;
