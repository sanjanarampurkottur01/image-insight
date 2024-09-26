import React, { useEffect, useState } from 'react';
import { Box, Typography, AppBar, Toolbar, IconButton, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { dynamoDB } from '../utils/aws'; // Import DynamoDB

const ImageView = () => {
  const { imageUrl } = useParams();
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImageCaption = async () => {
      const params = {
        TableName: "ImageInfo",
        Key: {
          path: decodeURIComponent(imageUrl.split("us-east-1.").join("")),
        },
      };

      try {
        const response = await dynamoDB.get(params).promise();
        if (response.Item) {
          setCaption(response.Item.caption);
        } else {
          setCaption('Caption not found in the database');
        }
      } catch (error) {
        console.error('Error fetching data from DynamoDB:', error);
        setCaption('Could not fetch image caption');
      }
      setLoading(false);
    };

    fetchImageCaption();
  }, [imageUrl]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleBack}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6">
            Image View
          </Typography>
        </Toolbar>
      </AppBar>

      <Box mt={2} textAlign="center">
        <img src={decodeURIComponent(imageUrl)} alt="Selected" style={{ maxWidth: '100%', height: 'auto' }} />
        {loading ? (
          <CircularProgress />
        ) : (
          <Typography variant="body1" mt={2}>
            {caption}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ImageView;
