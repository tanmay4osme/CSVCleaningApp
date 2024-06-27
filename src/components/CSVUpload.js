import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseConfig';
import axios from 'axios';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

const CSVUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [cleanedData, setCleanedData] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      setIsUploading(true); // Indicate upload in progress
      const storageRef = ref(storage, `csv_files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Send the file to the backend for processing
          try {
            const response = await axios.post('http://localhost:5000/clean-csv', {
              downloadURL,
            });

            setCleanedData(response.data.cleanedData);
          } catch (error) {
            console.error('Error processing file:', error);
          }

          setIsUploading(false); // Reset upload state
        }
      );
    }
  };

  return (
    <Box sx={{ textAlign: 'center', padding: '20px' }}>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the input, use a styled button
        id="file-input"
      />
      <label htmlFor="file-input">
        <Button
          variant="contained"
          color="primary"
          component="span"
          disabled={isUploading} // Disable during upload
        >
          {isUploading ? 'Uploading...' : 'Select CSV'}
        </Button>
      </label>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleUpload}
        disabled={isUploading || !file} // Disable during upload or if no file is selected
        sx={{ ml: 2 }}
      >
        Upload CSV
      </Button>
      {isUploading && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}
      {cleanedData && (
        <Box sx={{ marginTop: '20px' }}>
          <h3>Cleaned Data</h3>
          <iframe
            srcDoc={JSON.stringify(cleanedData, null, 2)}
            title="Cleaned CSV"
            style={{ width: '100%', height: '500px', border: '1px solid black' }}
          />
        </Box>
      )}
    </Box>
  );
};

export default CSVUpload;