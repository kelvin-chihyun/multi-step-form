import { UseFormReturn, useFieldArray } from 'react-hook-form';
import styled from '@emotion/styled';
import type { QuotesInfo } from '@/types/bookReview';

interface QuotesProps {
  form: UseFormReturn<QuotesInfo>;
  totalPages: number;
}

export default function Quotes({ form, totalPages }: QuotesProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'quotes',
  });

  // totalPages가 0이면 "알 수 없음" 상태
  const isTotalPagesUnknown = totalPages === 0;

  const handleAddQuote = () => {
    append({ text: '', page: undefined });
  };

  const handleRemoveQuote = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Container>
      <Title>인용구 추가</Title>
      <Description>
        책에서 인상 깊었던 구절이나 마음에 드는 문장을 기록해보세요.
      </Description>

      <QuotesContainer>
        {fields.map((field, index) => (
          <QuoteItem key={field.id}>
            <QuoteHeader>
              <QuoteNumber>인용구 {index + 1}</QuoteNumber>
              {fields.length > 1 && (
                <RemoveButton type="button" onClick={() => handleRemoveQuote(index)}>
                  삭제
                </RemoveButton>
              )}
            </QuoteHeader>

            <FormGroup>
              <Label htmlFor={`quotes.${index}.text`}>인용 내용 *</Label>
              <Textarea
                id={`quotes.${index}.text`}
                rows={4}
                placeholder="책에서 인상 깊었던 문장이나 구절을 입력해주세요"
                {...register(`quotes.${index}.text`, {
                  required: '인용 내용은 필수입니다',
                  minLength: {
                    value: 5,
                    message: '인용 내용은 최소 5자 이상이어야 합니다',
                  },
                })}
              />
              {errors.quotes?.[index]?.text && (
                <ErrorMessage>{errors.quotes[index]?.text?.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor={`quotes.${index}.page`}>
                페이지 번호 *
              </Label>
              {isTotalPagesUnknown ? (
                <PageInputReadonly
                  id={`quotes.${index}.page`}
                  type="text"
                  value="알 수 없음"
                  readOnly
                  disabled
                />
              ) : (
                <PageInput
                  id={`quotes.${index}.page`}
                  type="number"
                  placeholder={`페이지 번호 (1 ~ ${totalPages})`}
                  {...register(`quotes.${index}.page`, {
                    required: '페이지 번호는 필수입니다',
                    valueAsNumber: true,
                    validate: (value) => {
                      if (value === undefined || value === null || isNaN(value)) {
                        return '페이지 번호를 입력해주세요';
                      }
                      if (value < 1) return '페이지 번호는 1 이상이어야 합니다';
                      if (value > totalPages) {
                        return `페이지 번호는 전체 페이지 수(${totalPages})보다 작아야 합니다`;
                      }
                      return true;
                    },
                  })}
                />
              )}
              {errors.quotes?.[index]?.page && (
                <ErrorMessage>{errors.quotes[index]?.page?.message}</ErrorMessage>
              )}
            </FormGroup>
          </QuoteItem>
        ))}
      </QuotesContainer>

      <AddButton type="button" onClick={handleAddQuote}>
        + 인용구 추가
      </AddButton>

      <GuideBox>
        <GuideTitle>인용구 작성 가이드</GuideTitle>
        <GuideItem>• 책의 핵심 메시지나 인상 깊은 문장을 선택해주세요</GuideItem>
        <GuideItem>• 정확한 인용을 위해 원문 그대로 작성해주세요</GuideItem>
        <GuideItem>• 페이지 번호는 필수입니다 (총 페이지 수를 모르는 경우 &quot;알 수 없음&quot;으로 자동 표시)</GuideItem>
        <GuideItem>• 여러 개의 인용구를 추가할 수 있습니다</GuideItem>
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

const Description = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  margin-top: -16px;
`;

const QuotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const QuoteItem = styled.div`
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
`;

const QuoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const QuoteNumber = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const RemoveButton = styled.button`
  padding: 6px 12px;
  font-size: 13px;
  color: #dc3545;
  background-color: transparent;
  border: 1px solid #dc3545;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #dc3545;
    color: white;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
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
  background-color: white;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  &::placeholder {
    color: #999;
  }
`;

const PageInput = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  &::placeholder {
    color: #999;
  }
`;

const PageInputReadonly = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background-color: #f5f5f5;
  color: #666;
  cursor: not-allowed;
`;

const AddButton = styled.button`
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #007bff;
  background-color: white;
  border: 2px dashed #007bff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f8ff;
  }
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
