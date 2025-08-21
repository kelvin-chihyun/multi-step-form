// src/components/steps/BasicInfo.tsx
import { Controller, useFormContext } from 'react-hook-form';
import {
  Stack,
  Typography,
  TextField,
  Autocomplete,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { BookFormData } from '@/types/form';
import { Book } from '@/types/api';
import dayjs from 'dayjs';

interface BasicInfoProps {
  bestsellerBooks: Book[];
}

export function BasicInfo({ bestsellerBooks }: BasicInfoProps) {
  const { control, watch, setValue, formState: { errors } } = useFormContext<BookFormData>();

  return (
    <Stack spacing={3}>
      <Typography variant="h6" component="h2">도서 기본정보</Typography>
      
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
            renderInput={(params) => (
              <TextField
                {...params}
                label="도서 제목"
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
        )}
      />
      
      {/* Author Autocomplete */}
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
            renderInput={(params) => (
              <TextField
                {...params}
                label="저자"
                error={!!errors.author}
                helperText={errors.author?.message}
              />
            )}
          />
        )}
      />

      {/* Reading Status */}
      <Controller
        name="readingStatus"
        control={control}
        render={({ field }) => (
          <FormControl component="fieldset">
            <FormLabel component="legend">
              <Typography variant="h6" component="h2">독서 상태</Typography>
            </FormLabel>
            <RadioGroup {...field} sx={{ mt: 1 }}>
              <FormControlLabel value="want-to-read" control={<Radio />} label="읽고 싶음" />
              <FormControlLabel value="reading" control={<Radio />} label="읽는 중" />
              <FormControlLabel value="read" control={<Radio />} label="읽음" />
              <FormControlLabel value="on-hold" control={<Radio />} label="보류" />
            </RadioGroup>
          </FormControl>
        )}
      />

      {/* Reading Period */}
      <Typography variant="h6" component="h2">독서 기간</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Controller
          name="startDate"
          control={control}
          rules={{
            validate: (value) => {
              const readingStatus = watch('readingStatus');
              const title = watch('title');
              
              if (readingStatus === 'want-to-read' && value) {
                return '읽고 싶은 책은 독서 기간을 입력할 수 없습니다';
              }
              
              if (['reading', 'read', 'on-hold'].includes(readingStatus) && !value) {
                return '시작일을 선택해주세요';
              }
              
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
              {...field}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.startDate,
                  helperText: errors.startDate?.message
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
              
              if (readingStatus === 'want-to-read' && value) {
                return '읽고 싶은 책은 독서 기간을 입력할 수 없습니다';
              }
              
              if (['reading', 'on-hold'].includes(readingStatus) && value) {
                return '읽는 중/보류 중 상태에서는 종료일을 입력할 수 없습니다';
              }
              
              if (readingStatus === 'read' && !value) {
                return '종료일을 선택해주세요';
              }
              
              if (value && startDate && dayjs(value).isBefore(dayjs(startDate))) {
                return '종료일은 시작일보다 빠를 수 없습니다';
              }
              
              return true;
            }
          }}
          render={({ field }) => (
            <DatePicker
              label="종료일"
              {...field}
              minDate={watch('startDate') || undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.endDate,
                  helperText: errors.endDate?.message
                }
              }}
            />
          )}
        />
      </Stack>
    </Stack>
  );
}