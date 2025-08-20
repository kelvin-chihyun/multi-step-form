import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Stack,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Button,
  Container,
  Paper,
  Alert,
  Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';

type ReadingStatus = 'want-to-read' | 'reading' | 'read' | 'on-hold';

interface Book {
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  rating: number;
  publishedDate: string;
}

interface BookFormData {
  title: string;
  author: string;
  readingStatus: ReadingStatus;
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
}

interface HomeProps {
  bestsellerBooks: Book[];
}



export default function Home({ bestsellerBooks }: HomeProps) {
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    setFocus,
    setValue,
    formState: { errors }
  } = useForm<BookFormData>({
    defaultValues: {
      title: '',
      author: '',
      readingStatus: 'read', // 기본값을 '읽음'으로 변경 (독서 완료 후 입력)
      startDate: null,
      endDate: null,
    }
  });

  const onSubmit = (data: BookFormData) => {
    try {
      console.log('Form Data:', data);
      setSubmissionStatus('success');
      
      // 3초 후 성공 메시지 제거
      setTimeout(() => {
        setSubmissionStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionStatus('error');
    }
  };

  const onError = (errors: any) => {
    console.log('Validation errors:', errors);
    
    // 첫 번째 에러 필드에 포커스
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      setFocus(firstErrorField as keyof BookFormData);
    }
  };

  return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Paper elevation={2} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              독서 기록 등록
            </Typography>
            
            {submissionStatus === 'success' && (
              <Alert severity="success" sx={{ mb: 2 }}>
                도서가 성공적으로 등록되었습니다!
              </Alert>
            )}
            
            {submissionStatus === 'error' && (
              <Alert severity="error" sx={{ mb: 2 }}>
                등록 중 오류가 발생했습니다. 다시 시도해주세요.
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit(onSubmit, onError)}>
              <Stack spacing={3} sx={{ mt: 4 }}>
              {/* 도서 기본정보 */}
              <Typography variant="h6" component="h2">
                도서 기본정보
              </Typography>
              
              <Controller
                name="title"
                control={control}
                rules={{ required: '제목은 필수입니다' }}
                render={({ field }) => (
                  <Autocomplete
                    freeSolo
                    options={bestsellerBooks.map(book => book.title)}
                    value={field.value}
                    onChange={(_, value) => {
                      field.onChange(value || '');
                      const selectedBook = bestsellerBooks.find(book => book.title === value);
                      if (selectedBook) {
                        setValue('author', selectedBook.author);
                      }
                    }}
                    onInputChange={(_, value) => {
                      field.onChange(value);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label="도서 제목"
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#d32f2f',
                              borderWidth: '2px'
                            }
                          }
                        }}
                      />
                    )}
                  />
                )}
              />
              
              <Controller
                name="author"
                control={control}
                rules={{ required: '저자는 필수입니다' }}
                render={({ field }) => (
                  <Autocomplete
                    freeSolo
                    options={Array.from(new Set(bestsellerBooks.map(book => book.author)))}
                    value={field.value}
                    onChange={(_, value) => field.onChange(value || '')}
                    onInputChange={(_, value) => field.onChange(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label="저자"
                        error={!!errors.author}
                        helperText={errors.author?.message}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#d32f2f',
                              borderWidth: '2px'
                            }
                          }
                        }}
                      />
                    )}
                  />
                )}
              />

              {/* 독서 상태 */}
              <Controller
                name="readingStatus"
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset">
                    <FormLabel component="legend">
                      <Typography variant="h6" component="h2">
                        독서 상태
                      </Typography>
                    </FormLabel>
                    <RadioGroup
                      value={field.value}
                      onChange={field.onChange}
                      sx={{ mt: 1 }}
                      defaultValue="read"
                    >
                      <FormControlLabel 
                        value="want-to-read" 
                        control={<Radio />} 
                        label="읽고 싶음" 
                      />
                      <FormControlLabel 
                        value="reading" 
                        control={<Radio />} 
                        label="읽는 중" 
                      />
                      <FormControlLabel 
                        value="read" 
                        control={<Radio />} 
                        label="읽음" 
                      />
                      <FormControlLabel 
                        value="on-hold" 
                        control={<Radio />} 
                        label="보류" 
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              />

              {/* 독서 시작 및 종료일 */}
              <Typography variant="h6" component="h2">
                독서 기간
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{
                    validate: (value) => {
                      const readingStatus = watch('readingStatus');
                      const title = watch('title');
                      
                      // 읽고 싶은 책은 독서 기간이 입력되면 안 됨
                      if (readingStatus === 'want-to-read' && value) {
                        return '읽고 싶은 책은 독서 기간을 입력할 수 없습니다';
                      }
                      
                      // 읽는 중, 읽음, 보류 중은 시작일 필수
                      if (['reading', 'read', 'on-hold'].includes(readingStatus) && !value) {
                        return '시작일을 선택해주세요';
                      }
                      
                      // 선택된 책의 출판일 찾기
                      const selectedBook = bestsellerBooks.find(book => book.title === title);
                      if (value && selectedBook) {
                        const publishedDate = dayjs(selectedBook.publishedDate);
                        if (dayjs(value).isBefore(publishedDate)) {
                          return '독서 시작일은 출판일 이후여야 합니다';
                        }
                      }
                      
                      return true;
                    }
                  }}
                  render={({ field }) => (
                    <DatePicker
                      label="시작일"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: { 
                          fullWidth: true,
                          error: !!errors.startDate,
                          helperText: errors.startDate?.message,
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#d32f2f',
                                borderWidth: '2px'
                              }
                            }
                          }
                        }
                      }}
                    />
                  )}
                />
                
                <Controller
                  name="endDate"
                  control={control}
                  rules={{
                    validate: (value) => {
                      const readingStatus = watch('readingStatus');
                      const startDate = watch('startDate');
                      
                      // 읽고 싶은 책은 독서 기간이 입력되면 안 됨
                      if (readingStatus === 'want-to-read' && value) {
                        return '읽고 싶은 책은 독서 기간을 입력할 수 없습니다';
                      }
                      
                      // 읽는 중, 보류 중은 종료일이 입력되면 안 됨
                      if (['reading', 'on-hold'].includes(readingStatus) && value) {
                        return '읽는 중/보류 중 상태에서는 종료일을 입력할 수 없습니다';
                      }
                      
                      // 읽음은 종료일 필수
                      if (readingStatus === 'read' && !value) {
                        return '종료일을 선택해주세요';
                      }
                      
                      // 종료일은 시작일 이후여야 함
                      if (value && startDate && dayjs(value).isBefore(dayjs(startDate))) {
                        return '종료일은 시작일보다 빠를 수 없습니다';
                      }
                      
                      return true;
                    }
                  }}
                  render={({ field }) => (
                    <DatePicker
                      label="종료일"
                      value={field.value}
                      onChange={field.onChange}
                      minDate={watch('startDate') || undefined}
                      slotProps={{
                        textField: { 
                          fullWidth: true,
                          error: !!errors.endDate,
                          helperText: errors.endDate?.message,
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#d32f2f',
                                borderWidth: '2px'
                              }
                            }
                          }
                        }
                      }}
                    />
                  )}
                />
              </Stack>

              {/* 제출 버튼 */}
              <Box sx={{ pt: 2 }}>
                <Button 
                  type="submit"
                  variant="contained" 
                  fullWidth
                  size="large"
                >
                  저장
                </Button>
              </Box>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const bestsellerBooks = [
    { title: "소년이 온다", author: "한강", publisher: "창비", isbn: "9788936434120", rating: 4.5, publishedDate: "2018-09-15"},
    { title: "모순", author: "양귀자", publisher: "쓰다", isbn: "9788998441012", rating: 4, publishedDate: "2024-03-20" },
    { title: "작별하지 않는다", author: "한강", publisher: "문학동네", isbn: "9788954682152", rating: 4.5, publishedDate: "2023-11-30" },
    { title: "채식주의자", author: "한강", publisher: "창비", isbn: "9788936434595", rating: 5, publishedDate: "2019-02-15" },
    { title: "스토너", author: "존 윌리엄스", publisher: "알에이치코리아", isbn: "9788925554990", rating: 4.5, publishedDate: "2020-07-22" },
    { title: "급류", author: "정대건", publisher: "민음사", isbn: "9788937473401", rating: 3.5, publishedDate: "2024-05-10" },
    { title: "이처럼 사소한 것들", author: "클레어 키건", publisher: "다산책방", isbn: "9791130646381", rating: 4, publishedDate: "2023-08-05" },
    { title: "아몬드", author: "손원평", publisher: "창비", isbn: "9788936434267", rating: 4, publishedDate: "2020-01-30" },
    { title: "불편한 편의점", author: "김호연", publisher: "나무옆의자", isbn: "9791161571188", rating: 4.5, publishedDate: "2021-04-20" },
    { title: "불편한 편의점2", author: "김호연", publisher: "나무옆의자", isbn: "9791161571423", rating: 4, publishedDate: "2022-08-10" },
    { title: "미드나잇 라이브러리", author: "매트 헤이그", publisher: "인플루엔셜", isbn: "9791191056556", rating: 4.5, publishedDate: "2021-06-15" },
    { title: "지구 끝의 온실", author: "김초엽", publisher: "자이언트북스", isbn: "9791190908696", rating: 4, publishedDate: "2023-02-28" },
    { title: "돌이킬 수 없는 약속", author: "야쿠마루 가쿠", publisher: "북플라자", isbn: "9788998274795", rating: 4, publishedDate: "2019-11-11" },
    { title: "파과", author: "구병모", publisher: "자음과모음", isbn: "9788957076590", rating: 3.5, publishedDate: "2024-01-25" },
    { title: "달러구트 꿈 백화점", author: "이미예", publisher: "팩토리나인", isbn: "9791165341909", rating: 4.5, publishedDate: "2020-07-08" },
    { title: "달러구트 꿈 백화점 2", author: "이미예", publisher: "팩토리나인", isbn: "9791165343729", rating: 4, publishedDate: "2021-07-27" },
    { title: "82년생 김지영", author: "조남주", publisher: "민음사", isbn: "9788937473135", rating: 4, publishedDate: "2018-08-25" },
    { title: "여행의 이유", author: "김영하", publisher: "문학동네", isbn: "9788954655972", rating: 4.5, publishedDate: "2019-04-17" },
    { title: "긴 이별을 위한 짧은 편지", author: "루이제 린저", publisher: "민음사", isbn: "9788937437564", rating: 4, publishedDate: "2024-06-30" },
    { title: "달까지 가자", author: "장강명", publisher: "속삭", isbn: "9791191824001", rating: 4, publishedDate: "2025-02-14" },
    { title: "흔한남매 15", author: "흔한남매", publisher: "아이세움", isbn: "9791167433731", rating: 3.5, publishedDate: "2024-12-20" },
    { title: "말의 품격", author: "이기주", publisher: "황소북스", isbn: "9791187002338", rating: 4.5, publishedDate: "2018-12-31" },
    { title: "도둑맞은 집중력", author: "요한 하리", publisher: "어크로스", isbn: "9791190030816", rating: 4, publishedDate: "2023-05-15" },
    { title: "죽이고 싶은 아이", author: "정유정", publisher: "은행나무", isbn: "9791190216746", rating: 4.5, publishedDate: "2022-03-08" },
    { title: "피프티 피플", author: "정세랑", publisher: "창비", isbn: "9788936474317", rating: 4, publishedDate: "2020-09-22" },
    { title: "물고기는 존재하지 않는다", author: "룰루 밀러", publisher: "곰출판", isbn: "9791190538268", rating: 4.5, publishedDate: "2021-11-30" },
    { title: "달의 조각", author: "장강명", publisher: "민음사", isbn: "9788937429132", rating: 4, publishedDate: "2025-04-01" },
    { title: "하얼빈", author: "김훈", publisher: "문학동네", isbn: "9788954699914", rating: 4, publishedDate: "2022-07-15" }, 
    { title: "엄마를 부탁해", author: "신경숙", publisher: "창비", isbn: "9788936433673", rating: 5, publishedDate: "2018-10-10" },
    { title: "불편당한 진실", author: "앨 고어", publisher: "이음", isbn: "9788964760038", rating: 3.5, publishedDate: "2024-08-20" },
    { title: "저주토끼", author: "정보라", publisher: "아작", isbn: "9791165503399", rating: 4, publishedDate: "2023-09-05" },
    { title: "아주 희미한 빛으로도", author: "정세랑", publisher: "문학동네", isbn: "9788954685733", rating: 4, publishedDate: "2025-06-30" },
    { title: "불안", author: "알랭 드 보통", publisher: "은행나무", isbn: "9788984314435", rating: 4.5, publishedDate: "2019-06-18" },
    { title: "역행자", author: "자청", publisher: "웅진지식하우스", isbn: "9788901260716", rating: 4, publishedDate: "2023-01-15" },
    { title: "1Q84 1", author: "무라카미 하루키", publisher: "문학동네", isbn: "9788954608176", rating: 4, publishedDate: "2018-11-20" },
    { title: "1Q84 2", author: "무라카미 하루키", publisher: "문학동네", isbn: "9788954608183", rating: 3.5, publishedDate: "2019-01-10" },
    { title: "공정하다는 착각", author: "마이클 샌델", publisher: "와이즈베리", isbn: "9788934943754", rating: 4.5, publishedDate: "2022-05-25" },
    { title: "리스타트", author: "김하나", publisher: "위즈덤하우스", isbn: "9791191845679", rating: 3.5, publishedDate: "2024-07-12" },
    { title: "불편의 시대", author: "한스 로슬링", publisher: "김영사", isbn: "9788934985068", rating: 4, publishedDate: "2020-03-30" },
    { title: "카모메 식당", author: "무레 요코", publisher: "소담출판사", isbn: "9788973815911", rating: 4, publishedDate: "2021-02-14" },
    { title: "하마터면 열심히 살 뻔했다", author: "하완", publisher: "웅진지식하우스", isbn: "9788901249483", rating: 4, publishedDate: "2023-04-01" },
    { title: "나미야 잡화점의 기적", author: "히가시노 게이고", publisher: "현대문학", isbn: "9788972756191", rating: 5, publishedDate: "2018-07-07" },
    { title: "불안의 온도", author: "오히라 미쓰요", publisher: "메이븐", isbn: "9791190538060", rating: 3.5, publishedDate: "2024-04-15" },
    { title: "역사 이야기", author: "아서 코난 도일", publisher: "민음사", isbn: "9788937403668", rating: 4, publishedDate: "2020-11-11" },
    { title: "불편한 미래", author: "알랭 드 보통", publisher: "은행나무", isbn: "9788984314473", rating: 4, publishedDate: "2025-03-20" },
    { title: "대도시의 사랑법", author: "박상영", publisher: "창비", isbn: "9788936434496", rating: 4.5, publishedDate: "2022-12-25" },
    { title: "교실 뒤는 열다섯", author: "송은주", publisher: "궁리", isbn: "9788958201939", rating: 3.5, publishedDate: "2024-02-28" },
    { title: "달을 훔치다", author: "정회성", publisher: "자음과모음", isbn: "9788957077425", rating: 4, publishedDate: "2023-07-19" },
    { title: "소프트 스킬", author: "존 손메즈", publisher: "길벗", isbn: "9791187289760", rating: 4.5, publishedDate: "2021-09-09" },
    { title: "기억 전달자", author: "로이스 로리", publisher: "비룡소", isbn: "9788949161301", rating: 4, publishedDate: "2025-05-15" }
  ];

  return {
    props: {
      bestsellerBooks
    }
  };
};