# Multi-Step Form 단계별 개발 계획

---

## Phase 1: 기본 5단계 폼 동작 (MVP)

### 목표
5단계 폼이 처음부터 끝까지 동작하는 최소 기능 구현

### 구현 범위
```
/pages/book-review/[step].tsx    # 1~5 단계 동적 라우팅
/components/BookReviewForm/
  - Basic.tsx               # 도서 기본정보 + 독서상태 + 기간
  - Rating.tsx              # 추천여부 + 별점
  - Review.tsx              # 독후감
  - Quotes.tsx              # 인용구 (1개만)
  - Visibility.tsx          # 공개여부
  - FormLayout.tsx               # 이전/다음 버튼
/store/formAtoms.ts              # Jotai 전역 상태
/types/bookReview.ts
```

### 구현 기능
- 5단계 폼 순차 진행 (1→2→3→4→5)
- 이전/다음 버튼으로 단계 이동
- React Hook Form으로 각 단계 폼 관리
- Jotai로 단계별 데이터 저장
- 각 단계 넘어갈 때 기본 유효성 검증 (필수값, 형식)
- 에러 메시지 인풋 하단 표시

### 유효성 검증 (Phase 1에서 구현)4
- 독서 상태별 날짜 필드 검증 (읽고싶은책/읽는중/읽음/보류중)
- 시작일 < 종료일 검증
- 별점 1점 또는 5점일 때 독후감 100자 검증
- 출판일 검증 제외 (데이터 없음, Phase 3에서 구현)
- 인용구 페이지 검증 제외 (도서 페이지수 데이터 없음, Phase 3에서 구현)

### 제외 사항
- 새로고침 시 상태 유지
- 쿼리 파라미터
- 미리보기 화면
- 인용구 여러개 추가/삭제xw
- 재사용 컴포넌트

---

## Phase 2: 데이터 지속성 + 미리보기 (Persistence & Preview)

### 목표
새로고침해도 폼 유지, 실시간 미리보기 추가

### 추가 구현
```
/hooks/
  - useFormPersistence.ts        # localStorage + query params 동기화
  - useDebounce.ts               # 500ms 디바운스
  - useResponsive.ts             # viewport 1024px 감지
/components/
  - PreviewPanel.tsx             # 앱 화면 미리보기 (>= 1024px만 노출)
```

### 구현 기능
- localStorage에 폼 상태 저장
- 새로고침 시 localStorage에서 복원
- Query params에 현재 단계 저장 (`?step=3`)
- URL 직접 접근 시 해당 단계로 이동
- 1024px 이상에서 오른쪽에 앱 미리보기 화면
- 폼 입력 → 500ms 디바운스 → 미리보기 업데이트
- 1024px 미만에서는 미리보기 숨김 (window resize 이벤트)

### 핵심 로직
```typescript
// useFormPersistence.ts 개념
const useFormPersistence = () => {
  // 1. mount 시 localStorage → Jotai 복원
  // 2. formData 변경 시 → localStorage 저장
  // 3. step 변경 시 → query params 업데이트
};

// PreviewPanel.tsx 개념
const PreviewPanel = () => {
  const formData = useAtomValue(bookReviewAtom);
  const debouncedData = useDebounce(formData, 500);
  const isDesktop = useResponsive(1024);
  
  if (!isDesktop) return null;
  return <MobilePreview data={debouncedData} />;
};
```

---

## Phase 3: 고급 기능 + 재사용 컴포넌트 (Advanced Features)

### 목표
복잡한 기능 구현, 컴포넌트 재사용성 확보

### 추가 구현
```
/components/form-controls/
  - CommaSeparatedInput.tsx           # 숫자 콤마 입력
  - RHFCommaSeparatedInput.tsx        # RHF 래핑 버전
  - AutoComplete/
    - AsyncAutoComplete.tsx           # Suspense 기반
    - RHFAsyncAutoComplete.tsx
/hooks/
  - useQuoteValidation.ts
```

### 구현 기능

#### 인용구 여러개 등록/삭제 (useFieldArray)
- 추가 버튼으로 인용구 필드 동적 추가
- 삭제 버튼으로 제거
- 인용구 2개 이상일 때 모든 필드에 페이지 번호 인풋 추가
- 페이지 번호 유효성 검증:
  - 숫자만 입력 가능
  - 도서 전체 페이지수보다 작아야 함
  - 2개 이상일 때 required, 1개 이하일 때 optional

#### CommaSeparatedInput
```typescript
// 역할
// - 사용자: 숫자만 입력 가능, 1000단위 콤마 자동 삽입
// - 개발자: value를 number로 받음
// - RHF 래핑으로 register 없이 재사용

<RHFCommaSeparatedInput name="totalPages" />
// 사용자 입력: "1234567" → 화면 표시: "1,234,567"
// form value: 1234567 (숫자)
```

#### AsyncAutoComplete
```typescript
// 내부적으로 Suspense 발생시키는 API 호출
// - 로딩 중: LoadingBar
// - 에러: RejectedFallback + 서버 에러 메시지
// - 성공: AutoComplete Options 노출

<RHFAsyncAutoComplete 
  name="bookTitle"
  fetchOptions={fetchBookTitles}  // Promise 반환
/>
```

### Phase 3에서 추가되는 검증
- 출판일 검증 (시작일 >= 출판일)
- 인용구 페이지 검증 (페이지 <= 도서 전체 페이지수)

---

## Phase 4: 완성도 + 에러 처리 고도화 (Polish)

### 목표
모든 에지 케이스 처리, UX 극대화

### 추가 구현
```
/components/
  - ValidationSummary.tsx         # 전체 검증 결과 요약
  - FormProgress.tsx              # 5단계 진행률 표시
/hooks/
  - useAutoFocus.ts               # 첫 에러 필드로 포커스
/utils/validation/
  - errorAggregator.ts            # 모든 검증 에러 수집
```

### 구현 기능

#### 유효성 검증 실패 시 UX
- 실패한 필드 중 순서상 가장 첫 번째 필드로 자동 포커스
- 실패한 모든 필드 인풋 아웃라인 빨간색
- 각 인풋 하단에 에러 메시지 표시

```typescript
// useAutoFocus.ts 개념
const useAutoFocus = (errors: FieldErrors) => {
  useEffect(() => {
    if (errors) {
      const firstErrorField = Object.keys(errors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.focus();
    }
  }, [errors]);
};
```

#### 마지막 단계 전체 검증
- 5단계(공개여부)에서 "제출" 버튼 클릭 시
- 1~5단계 전체 재검증
- 에러 있으면 → 해당 단계로 이동 + 첫 번째 에러 필드 포커스
- ValidationSummary: "3단계에 2개 에러, 4단계에 1개 에러" 표시

#### 진행률 표시
```
[●]━━[○]━━[○]━━[○]━━[○]
 1   2   3   4   5
```
- 현재 단계 강조
- 완료된 단계 체크 표시
- 미완료 단계 흐리게

#### 에지 케이스 처리
- 인용구 0개일 때 처리
- 별점 0점일 때 처리
- 독후감 10,000자 제한
- 인용구 500자 제한
- 연속으로 빠르게 "다음" 버튼 클릭 시 중복 저장 방지

---

## Phase별 정리

| Phase | 핵심 키워드 | 결과물 |
|-------|------------|--------|
| **Phase 1** | 5단계 폼 동작, 기본 검증 | 처음부터 끝까지 제출 가능한 MVP |
| **Phase 2** | 새로고침 대응, 미리보기 | 실사용 가능한 수준 |
| **Phase 3** | 복잡한 필드, 재사용 컴포넌트 | 고급 기능 완성 |
| **Phase 4** | 에러 처리, UX 극대화 | 프로덕션 레벨 |

---

## 유효성 검증의 진화

### Phase 1
- 각 단계 넘어갈 때 검증
- 간단한 에러 메시지

### Phase 2
- 검증 로직 변화 없음
- 새로고침 후에도 검증 유지

### Phase 3
- 복잡한 필드 검증 추가 (인용구 배열, 페이지 번호)
- 도서 메타데이터 기반 검증 (출판일, 전체 페이지수)

### Phase 4
- 전체 단계 재검증
- 에러 발생 시 자동 포커스 + 시각적 강조
- 검증 결과 요약 UI