import React from 'react';
import { Paper, Typography, Box, styled } from '@mui/material';
import demo2 from '../src/assets/demo-02.jpg'

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  borderRadius: theme.spacing(1), // Rounded corners for a softer look
  boxShadow: '0px 0px 0px rgba(0, 0, 0, 0.1)', // Subtle shadow
  maxWidth: '400px', // Limit the width for better centering
  margin: '0 auto', // Center the paper horizontally
}));

const StyledImage = styled('img')({
  height: '300px', // Adjusted height
  width: 'auto',
  marginBottom: '1rem',
  borderRadius: '8px', // Slightly rounded image corners
  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow on image
});

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 600, // Semi-bold for emphasis
  marginTop: theme.spacing(2),
  color: theme.palette.primary.main, // Use primary color for title
}));

const StyledBody = styled(Typography)(({ theme }) => ({
  fontFamily: 'Roboto, sans-serif',
  marginTop: theme.spacing(1),
  color: theme.palette.text.secondary, // Use secondary text color
}));

function Hero() {
  return (
    <StyledPaper elevation={3}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <StyledImage src={demo2} alt="Demo" />
        <StyledTitle variant="h6">
          Automatically remove background of the image
        </StyledTitle>
        <StyledBody variant="body2">
          Free 100%
        </StyledBody>
        <StyledBody variant="body2">
          made with ❤️ by taher tadpatri
        </StyledBody>
      </Box>
    </StyledPaper>
  );
}

export default Hero;