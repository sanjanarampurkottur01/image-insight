import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, AppBar, Toolbar, IconButton, Input, Menu, MenuItem, Fab, Paper } from '@mui/material';
import { Add, AccountCircle, Delete } from '@mui/icons-material';
import Cookies from 'js-cookie';
import { logoutUser } from '../utils/auth';
import { s3, rekognition, dynamoDB } from '../utils/aws';
import './GalleryPage.css';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const bucketName = process.env.REACT_APP_S3_BUCKET_NAME;
  const region = process.env.REACT_APP_REGION_NAME;

  useEffect(() => {
    if (!Cookies.get("email")) {
      navigate("/");
    } else {
      fetchImages();
    }
  }, []);

  const fetchImages = () => {
    const userId = Cookies.get('userId');
    const prefix = `${userId}/`;
    const params = {
      Bucket: bucketName,
      Prefix: prefix,
    };

    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        console.error('Error fetching images:', err);
        return;
      }

      if (!data || !data.Contents) {
        console.log('No images found.');
        return;
      }

      const imageUrls = data.Contents.map(item => `https://${bucketName}.s3.${region}.amazonaws.com/${item.Key}`);
      setImages(imageUrls);
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const userId = Cookies.get('userId');
    const fileName = `${userId}/${file.name}`;

    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: file,
        ACL: 'public-read',
    };

    s3.upload(params, async (err, data) => {
        if (err) {
            console.error('Error uploading image:', err);
            alert(`Error uploading image: ${err.message}`);
            return;
        }

        console.log('Upload successful', data);
        setImages([...images, data.Location]);

        // Extract labels from the uploaded image using Rekognition
        const rekognitionParams = {
            Image: {
                S3Object: {
                    Bucket: bucketName,
                    Name: fileName,
                },
            },
            MaxLabels: 10,
            MinConfidence: 75,
        };

        try {
            const response = await rekognition.detectLabels(rekognitionParams).promise();
            const labels = response.Labels.map(label => label.Name).join(', ');

            // Store the image data and labels in DynamoDB
            const dynamoDBParams = {
                TableName: "ImageInfo",
                Item: {
                    path: data.Location,
                    uploadedBy: Cookies.get("userId"),
                    caption: `This image contains: ${labels}`,
                    timestamp: new Date().toISOString(),
                },
            };

            await dynamoDB.put(dynamoDBParams).promise();
            console.log('DynamoDB update successful');
        } catch (error) {
            console.error('Error processing image labels or updating DynamoDB:', error);
        }
    });
  };

  const handleImageDelete = (index) => {
    const imageUrl = images[index];
    const key = imageUrl.split(`https://${bucketName}.s3.${region}.amazonaws.com/`)[1];

    const params = {
      Bucket: bucketName,
      Key: key,
    };

    s3.deleteObject(params, (err) => {
      if (err) {
        console.error('Error deleting image:', err);
        return;
      }

      setImages(images.filter((_, i) => i !== index));
    });
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove('name');
    Cookies.remove('email');
    Cookies.remove('userId');
    Cookies.remove('token');
    logoutUser();

    navigate("/");
  };

  const handleImageClick = (url) => {
    navigate(`/view/${encodeURIComponent(url)}`);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Gallery
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" component="div" sx={{ marginRight: 1 }}>
              {Cookies.get("name")}
            </Typography>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box position="fixed" bottom={16} right={16}>
        <label htmlFor="fab-button-file">
          <Input
            accept="image/*"
            id="fab-button-file"
            type="file"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <Fab color="primary" aria-label="add" component="span">
            <Add />
          </Fab>
        </label>
      </Box>

      <Box className="ImageGallery" mt={5} textAlign="center">
        <Grid padding={2} container spacing={2}>
          {images.map((url, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{ position: 'relative' }}>
              <Paper sx={{ position: 'relative' }} onClick={() => handleImageClick(url)}>
                <img src={url} alt={`Number ${index}`} style={{ padding: "10px", width: '95%' }} />
                <IconButton
                  sx={{ position: 'absolute', top: 8, right: 8, display: 'none' }}
                  className="delete-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageDelete(index);
                  }}
                >
                  <Delete />
                </IconButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default GalleryPage;
