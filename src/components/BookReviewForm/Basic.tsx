import { UseFormReturn } from 'react-hook-form';
import styled from '@emotion/styled';
import type { BasicInfo } from '@/types/bookReview';

interface BasicProps {
  form: UseFormReturn<BasicInfo>;
}

export default function Basic({ form }: BasicProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const readingStatus = watch('readingStatus');
  const totalPages = watch('totalPages');

  // totalPages가 0이면 "알 수 없음" 상태로 간주
  const isTotalPagesUnknown = totalPages === 0;

  const validateDates = (value: string | undefined, fieldName: 'startDate' | 'endDate') => {
    const status = watch('readingStatus');

    // 읽고싶은책: 독서 기간이 입력되면 안 됨
    if (status === '읽고싶은책' && value) {
      return '읽고싶은책 상태에서는 독서 기간을 입력할 수 없습니다';
    }

    // 읽는중: 시작일만 입력, 종료일 입력 불가
    if (status === '읽는중') {
      if (fieldName === 'startDate' && !value) {
        return '읽는 중 상태에서는 독서 시작일이 필수입니다';
      }
      if (fieldName === 'endDate' && value) {
        return '읽는 중 상태에서는 독서 종료일을 입력할 수 없습니다';
      }
    }

    // 읽음: 시작일, 종료일 모두 필수
    if (status === '읽음') {
      if (!value) {
        return fieldName === 'startDate' ? '독서 시작일이 필수입니다' : '독서 종료일이 필수입니다';
      }
    }

    // 보류중: 시작일만 입력, 종료일 입력 불가
    if (status === '보류중') {
      if (fieldName === 'startDate' && !value) {
        return '보류 중 상태에서는 독서 시작일이 필수입니다';
      }
      if (fieldName === 'endDate' && value) {
        return '보류 중 상태에서는 독서 종료일을 입력할 수 없습니다';
      }
    }

    // 시작일 < 종료일 검증
    if (fieldName === 'endDate' && value) {
      const startDate = watch('startDate');
      if (startDate && new Date(startDate) >= new Date(value)) {
        return '독서 종료일은 시작일보다 이후여야 합니다';
      }
    }

    return true;
  };

  return (
    <Container>
      <Title>도서 기본 정보</Title>

      <FormGroup>
        <Label htmlFor="bookTitle">도서명 *</Label>
        <Input
          id="bookTitle"
          {...register('bookTitle', {
            required: '도서명은 필수입니다',
          })}
          hasError={!!errors.bookTitle}
        />
        {errors.bookTitle && <ErrorMessage>{errors.bookTitle.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="author">저자 *</Label>
        <Input
          id="author"
          {...register('author', {
            required: '저자는 필수입니다',
          })}
          hasError={!!errors.author}
        />
        {errors.author && <ErrorMessage>{errors.author.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="publisher">출판사 *</Label>
        <Input
          id="publisher"
          {...register('publisher', {
            required: '출판사는 필수입니다',
          })}
          hasError={!!errors.publisher}
        />
        {errors.publisher && <ErrorMessage>{errors.publisher.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="totalPages">전체 페이지 수 *</Label>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={isTotalPagesUnknown}
            onChange={(e) => {
              const { setValue } = form;
              if (e.target.checked) {
                setValue('totalPages', 0, { shouldValidate: true });
              } else {
                setValue('totalPages', 1, { shouldValidate: true });
              }
            }}
          />
          알 수 없음
        </CheckboxLabel>
        <Input
          id="totalPages"
          type="number"
          placeholder={isTotalPagesUnknown ? '알 수 없음' : '전체 페이지 수를 입력하세요'}
          {...register('totalPages', {
            valueAsNumber: true,
            validate: (value) => {
              // "알 수 없음" 상태면 검증 skip
              if (value === 0) return true;
              // "알 수 없음"이 아닌데 값이 없거나 유효하지 않으면 에러
              if (!value || value < 1) {
                return '전체 페이지 수를 입력하거나 "알 수 없음"을 선택해주세요';
              }
              return true;
            },
          })}
          hasError={!!errors.totalPages}
          disabled={isTotalPagesUnknown}
        />
        {errors.totalPages && <ErrorMessage>{errors.totalPages.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="readingStatus">독서 상태 *</Label>
        <Select
          id="readingStatus"
          {...register('readingStatus', {
            required: '독서 상태는 필수입니다',
          })}
          hasError={!!errors.readingStatus}
        >
          <option value="읽고싶은책">읽고싶은책</option>
          <option value="읽는중">읽는중</option>
          <option value="읽음">읽음</option>
          <option value="보류중">보류중</option>
        </Select>
        {errors.readingStatus && <ErrorMessage>{errors.readingStatus.message}</ErrorMessage>}
      </FormGroup>

      <DateGroup>
        <FormGroup>
          <Label htmlFor="startDate">독서 시작일</Label>
          <Input
            type="date"
            id="startDate"
            {...register('startDate', {
              validate: (value) => validateDates(value, 'startDate'),
            })}
            hasError={!!errors.startDate}
            disabled={readingStatus === '읽고싶은책'}
          />
          {errors.startDate && <ErrorMessage>{errors.startDate.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="endDate">독서 종료일</Label>
          <Input
            type="date"
            id="endDate"
            {...register('endDate', {
              validate: (value) => validateDates(value, 'endDate'),
            })}
            hasError={!!errors.endDate}
            disabled={readingStatus !== '읽음'}
          />
          {errors.endDate && <ErrorMessage>{errors.endDate.message}</ErrorMessage>}
        </FormGroup>
      </DateGroup>
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
`;

const Input = styled.input<{ hasError?: boolean }>`
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid ${({ hasError }) => (hasError ? '#dc3545' : '#ddd')};
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ hasError }) => (hasError ? '#dc3545' : '#007bff')};
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Select = styled.select<{ hasError?: boolean }>`
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid ${({ hasError }) => (hasError ? '#dc3545' : '#ddd')};
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
  cursor: pointer;

  &:focus {
    border-color: ${({ hasError }) => (hasError ? '#dc3545' : '#007bff')};
  }
`;

const DateGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ErrorMessage = styled.span`
  font-size: 13px;
  color: #dc3545;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  margin-bottom: 4px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;
