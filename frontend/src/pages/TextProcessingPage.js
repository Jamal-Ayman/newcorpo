import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Alert } from '@mui/material';
import api from '../utils/api'; // Axios setup for API calls

const TextProcessingPage = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [keywords, setKeywords] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(''); // State to hold the result

  // Function to get emoji based on polarity
  const getEmoji = (polarity) => {
    if (polarity > 0.1) {
      return '😊'; // Positive
    } else if (polarity < -0.1) {
      return '😞'; // Negative
    } else {
      return '😐'; // Neutral
    }
  };

  // Handle text summarization
  const handleSummarize = async () => {
    try {
      const response = await api.post('/summary', { text });
      setSummary(response.data.message); // Assuming the response contains { "message": "summarized text" }
      setResult(response.data.message); // Update result state with summary
      setError('');
    } catch (err) {
      setError('Failed to summarize text');
      console.error(err);
    }
  };

  // Handle keyword extraction
  const handleExtractKeywords = async () => {
    try {
      const response = await api.post('/extract_keywords', { text });
      setKeywords(response.data.keywords); // Assuming the response contains { "keywords": ["keyword1", "keyword2", ...] }
      setResult(response.data.keywords.join(', ')); // Update result state with keywords
      setError('');
    } catch (err) {
      setError('Failed to extract keywords');
      console.error(err);
    }
  };

  // Handle sentiment analysis
  const handleSentimentAnalysis = async () => {
    try {
      const response = await api.post('/sentiment', { text });
      const { polarity, subjectivity } = response.data;
      // Get emoji based on polarity
      const emoji = getEmoji(polarity);
      // Display the sentiment result in the result field
      setResult(`Polarity: ${polarity}, Subjectivity: ${subjectivity} ${emoji}`);
      setError('');
    } catch (err) {
      setError('Failed to analyze sentiment');
      console.error(err);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Text Processing
      </Typography>

      <TextField
        label="Enter text"
        variant="outlined"
        fullWidth
        margin="normal"
        multiline
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSummarize}
        style={{ marginTop: '20px', marginRight: '10px' }}
      >
        Summarize Text
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleExtractKeywords}
        style={{ marginTop: '20px', marginRight: '10px' }}
      >
        Extract Keywords
      </Button>

      <Button
        variant="contained"
        color="success"
        onClick={handleSentimentAnalysis}
        style={{ marginTop: '20px' }}
      >
        Analyze Sentiment
      </Button>

      {error && <Alert severity="error" style={{ marginTop: '20px' }}>{error}</Alert>}

      {/* Result Text Field */}
      <TextField
        label="Result"
        variant="outlined"
        fullWidth
        margin="normal"
        multiline
        rows={4}
        value={result}
        InputProps={{
          readOnly: true,
        }}
      />
    </Container>
  );
};

export default TextProcessingPage;
