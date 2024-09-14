import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Alert } from '@mui/material';
import api from '../utils/api'; // Axios setup for API calls

const TextAnalysisPage = () => {
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  const [keyword, setKeyword] = useState('');
  const [minLength, setMinLength] = useState(0);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  // Handle Search
  const handleSearch = async () => {
    try {
      const response = await api.post('/search', { text, query });
      setResult(response.data.results.join(', '));
      setError('');
    } catch (err) {
      setError('Failed to perform search');
      console.error(err);
    }
  };

  // Handle Categorization
  const handleCategorization = async () => {
    try {
      const response = await api.post('/categorize', { text });
      setResult(response.data.categories.join(', '));
      setError('');
    } catch (err) {
      setError('Failed to categorize text');
      console.error(err);
    }
  };

  // Handle Custom Query
  const handleCustomQuery = async () => {
    try {
      const response = await api.post('/custom_query', { text, keyword, min_length: minLength });
      setResult(`Keyword in text: ${response.data.keyword_in_text}, Meets length condition: ${response.data.meets_length_condition}`);
      setError('');
    } catch (err) {
      setError('Failed to perform custom query');
      console.error(err);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Text Analysis
      </Typography>

      {/* Main Text Input */}
      <TextField
        label="Enter Text"
        variant="outlined"
        fullWidth
        margin="normal"
        multiline
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Search Input */}
      <TextField
        label="Search Query"
        variant="outlined"
        fullWidth
        margin="normal"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Keyword for Custom Query */}
      <TextField
        label="Keyword for Custom Query"
        variant="outlined"
        fullWidth
        margin="normal"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      {/* Min Length for Custom Query */}
      <TextField
        label="Minimum Length for Custom Query"
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
        value={minLength}
        onChange={(e) => setMinLength(e.target.value)}
      />

      {/* Buttons */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        style={{ marginTop: '20px', marginRight: '10px' }}
      >
        Search
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleCategorization}
        style={{ marginTop: '20px', marginRight: '10px' }}
      >
        Categorize
      </Button>

      <Button
        variant="contained"
        color="info"
        onClick={handleCustomQuery}
        style={{ marginTop: '20px' }}
      >
        Custom Query
      </Button>

      {/* Error Message */}
      {error && <Alert severity="error" style={{ marginTop: '20px' }}>{error}</Alert>}

      {/* Result Field */}
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
        style={{ marginTop: '20px' }}
      />
    </Container>
  );
};

export default TextAnalysisPage;
