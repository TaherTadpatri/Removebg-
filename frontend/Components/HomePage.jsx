import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Grid, Paper, Box, styled, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import demo2 from '../src/assets/demo-02.jpg';
import Hero from './Hero';
import ImageBackgroundRemoval from './ImageBackgroundRemoval';
// Styled Components
const MainContent = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(4), // Adjust for fixed AppBar
  padding: theme.spacing(4),
}));

const ImageRemoverPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
}));

function HomePage() {
  const [selectedModel, setSelectedModel] = useState('normal');
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <AppBar color="default" position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Background Remover
          </Typography>
        </Toolbar>
      </AppBar>

      <MainContent container spacing={3}>
        <Grid item xs={12} md={6}>
          {/* <Paper elevation={0} sx={{ padding: 3 }}>
            <Box sx={{display :'flex',flexDirection:"column",justifyContent:"center",alignItem  : "center"}}> 
                <img src={demo2} height='400px' width='auto' /> 
                <Typography variant="h5" fontFamily='sans-serif' sx={{mt :2}}>
              Automatically remove background of the image
            </Typography>
            <Typography variant="body1" fontFamily='sans-serif' sx={{mt :1}}>
              Free 100%
            </Typography>
            <Typography variant="body1" fontFamily='sans-serif' sx={{mt :1}}>
              made with ❤️ by taher tadpatri
            </Typography>
            </Box>
            
          </Paper> */}
          <Hero/>
        </Grid>

        <Grid item xs={12} md={6}>
         <ImageBackgroundRemoval/>
        </Grid>
      </MainContent>
    </div>
  );
}

export default HomePage;