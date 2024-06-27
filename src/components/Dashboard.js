import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const Dashboard = () => {
  const [cleanedData, setCleanedData] = useState([]);
  const [downloadLink, setDownloadLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5000/get-cleaned-data')
      .then((response) => {
        if (response.data.cleanedData) {
          setCleanedData(response.data.cleanedData);
          setDownloadLink(response.data.downloadLink);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching cleaned data:', error);
        setLoading(false);
      });
  }, []);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      axios.post('http://localhost:5000/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      })
      .then((response) => {
        console.log('File uploaded successfully');
        // Handle the response as needed
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
    }
  };

  const handleDownload = () => {
    if (downloadLink) {
      window.location.href = downloadLink;
    }
  };

  return (
    <Box sx={{ textAlign: 'center', padding: '20px' }}>
      <h2>Cleaned Data</h2>
      <input type="file" onChange={handleUpload} />
      {uploadProgress > 0 && <LinearProgress variant="determinate" value={uploadProgress} />}
      {loading && <LinearProgress />}
      {!loading && cleanedData.length > 0 ? (
        <>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(cleanedData[0]).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {cleanedData.map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, cellIndex) => (
                    <TableCell key={cellIndex}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="contained" color="secondary" onClick={handleDownload}>
            Download Cleaned CSV
          </Button>
        </>
      ) : (
        <p>No data available. Please upload and clean a CSV file.</p>
      )}
    </Box>
  );
};

export default Dashboard;