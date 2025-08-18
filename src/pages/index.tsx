import { useState } from 'react';
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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

type ReadingStatus = 'want-to-read' | 'reading' | 'read' | 'on-hold';
interface BookFormData {
  title: string;
  author: string;
  readingStatus: ReadingStatus;
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
}



export default function Home() {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    readingStatus: 'want-to-read',
    startDate: null,
    endDate: null,
  });

  const handleInputChange = (field: keyof BookFormData) => (
    value: string | dayjs.Dayjs | null
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    // TODO: 실제 제출 로직 구현
  };

  return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Paper elevation={2} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              독서 기록 등록
            </Typography>
            
            <Stack spacing={3} sx={{ mt: 4 }}>
              {/* 도서 기본정보 */}
              <Typography variant="h6" component="h2">
                도서 기본정보
              </Typography>
              
              <TextField
                label="도서 제목"
                value={formData.title}
                onChange={(e) => handleInputChange('title')(e.target.value)}
                fullWidth
                required
              />
              
              <TextField
                label="저자"
                value={formData.author}
                onChange={(e) => handleInputChange('author')(e.target.value)}
                fullWidth
                required
              />

              {/* 독서 상태 */}
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  <Typography variant="h6" component="h2">
                    독서 상태
                  </Typography>
                </FormLabel>
                <RadioGroup
                  value={formData.readingStatus}
                  onChange={(e) => handleInputChange('readingStatus')(e.target.value)}
                  sx={{ mt: 1 }}
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

              {/* 독서 시작 및 종료일 */}
              <Typography variant="h6" component="h2">
                독서 기간
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <DatePicker
                  label="시작일"
                  value={formData.startDate}
                  onChange={(value) => handleInputChange('startDate')(value)}
                  slotProps={{
                    textField: { fullWidth: true }
                  }}
                />
                
                <DatePicker
                  label="종료일"
                  value={formData.endDate}
                  onChange={(value) => handleInputChange('endDate')(value)}
                  slotProps={{
                    textField: { fullWidth: true }
                  }}
                />
              </Stack>

              {/* 제출 버튼 */}
              <Box sx={{ pt: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleSubmit}
                  fullWidth
                  size="large"
                >
                  저장
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Container>
  );
}