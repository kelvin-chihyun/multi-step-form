import { UseFormReturn } from 'react-hook-form';
import styled from '@emotion/styled';
import type { VisibilityInfo } from '@/types/bookReview';

interface VisibilityProps {
  form: UseFormReturn<VisibilityInfo>;
}

export default function Visibility({ form }: VisibilityProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const currentVisibility = watch('visibility');

  return (
    <Container>
      <Title>공개 설정</Title>
      <Description>
        작성하신 독서 기록의 공개 여부를 선택해주세요.
      </Description>

      <OptionsContainer>
        <OptionCard isSelected={currentVisibility === 'public'}>
          <RadioLabel>
            <Radio
              type="radio"
              value="public"
              {...register('visibility', {
                required: '공개 여부를 선택해주세요',
              })}
            />
            <OptionContent>
              <OptionTitle>공개</OptionTitle>
              <OptionDescription>
                다른 사용자들이 내 독서 기록을 볼 수 있습니다.
                책에 대한 정보를 공유하고 다른 독자들과 소통할 수 있습니다.
              </OptionDescription>
            </OptionContent>
          </RadioLabel>
        </OptionCard>

        <OptionCard isSelected={currentVisibility === 'private'}>
          <RadioLabel>
            <Radio
              type="radio"
              value="private"
              {...register('visibility', {
                required: '공개 여부를 선택해주세요',
              })}
            />
            <OptionContent>
              <OptionTitle>비공개</OptionTitle>
              <OptionDescription>
                나만 볼 수 있는 독서 기록입니다.
                개인적인 기록으로 보관하고 싶을 때 선택하세요.
              </OptionDescription>
            </OptionContent>
          </RadioLabel>
        </OptionCard>
      </OptionsContainer>

      {errors.visibility && <ErrorMessage>{errors.visibility.message}</ErrorMessage>}

      <InfoBox>
        <InfoTitle>💡 참고사항</InfoTitle>
        <InfoItem>• 공개 설정은 나중에 언제든지 변경할 수 있습니다</InfoItem>
        <InfoItem>• 비공개로 설정해도 나의 독서 통계에는 포함됩니다</InfoItem>
        <InfoItem>• 공개 설정 시 독후감과 인용구가 다른 사용자에게 표시됩니다</InfoItem>
      </InfoBox>

      <SummaryBox>
        <SummaryTitle>🎉 거의 다 완성되었습니다!</SummaryTitle>
        <SummaryText>
          제출 버튼을 클릭하면 독서 기록이 저장됩니다.
        </SummaryText>
      </SummaryBox>
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

const Description = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  margin-top: -16px;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const OptionCard = styled.div<{ isSelected: boolean }>`
  padding: 20px;
  border: 2px solid ${({ isSelected }) => (isSelected ? '#007bff' : '#e0e0e0')};
  border-radius: 12px;
  background-color: ${({ isSelected }) => (isSelected ? '#f0f8ff' : 'white')};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: ${({ isSelected }) => (isSelected ? '#007bff' : '#bbb')};
  }
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
`;

const Radio = styled.input`
  width: 20px;
  height: 20px;
  margin-top: 2px;
  cursor: pointer;
  flex-shrink: 0;
`;

const OptionContent = styled.div`
  flex: 1;
`;

const OptionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin: 0 0 8px 0;
`;

const OptionDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.6;
`;

const ErrorMessage = styled.span`
  font-size: 13px;
  color: #dc3545;
`;

const InfoBox = styled.div`
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #007bff;
`;

const InfoTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
`;

const InfoItem = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SummaryBox = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 12px;
  color: white;
  text-align: center;
`;

const SummaryTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const SummaryText = styled.p`
  font-size: 14px;
  margin: 0;
  opacity: 0.95;
`;
