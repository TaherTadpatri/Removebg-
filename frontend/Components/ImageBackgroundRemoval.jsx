import React, { useState } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Typography, Box, Paper, styled } from '@mui/material';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '500px',
  margin: '20px auto',
}));

const StyledImage = styled('img')({
  maxWidth: '100%',
  marginTop: '1rem',
  borderRadius: '8px',
});

const StyledError = styled(Typography)({
  color: 'red',
  marginTop: '1rem',
});

function ImageBackgroundRemoval() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null); // Add this state

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setProcessedImage(null);
    setError(null);
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        setSelectedImageUrl(imageUrl); // Store the URL
      } else {
          setSelectedImageUrl(null);
      }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/remove_background/', formData, {
        responseType: 'blob',
      });

      const imageUrl = URL.createObjectURL(response.data);
      setProcessedImage(imageUrl);
      setError(null);
    } catch (err) {
      console.error('Error uploading image:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('An error occurred during upload.');
      }
      setProcessedImage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledPaper elevation={0}>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span">
          Upload Image
        </Button>
      </label>
      {selectedFile && (
        <div>
        <Typography variant="body2" style={{marginTop: '10px'}}>
          {selectedFile.name}
        </Typography>
        <img src={selectedImageUrl}/>
        </div>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={loading}
        style={{ marginTop: '1rem' }}
      >
        {loading ? <CircularProgress size={24} /> : 'Remove Background'}
      </Button>

      {error && <StyledError>{error}</StyledError>}

      {processedImage && (
        <Box mt={2} textAlign="center">
          <Typography variant="h6">Processed Image:</Typography>
          <StyledImage src={processedImage} alt="Processed" />
        </Box>
      )}
    </StyledPaper>
  );
}

export default ImageBackgroundRemoval;