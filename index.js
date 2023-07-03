import express from 'express';
import multer from 'multer';
import request from 'request';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Define the upload route
app.post('/api/affinda/resume/upload', upload.single('file'), (req, res) => {
  // Read the file from the uploads folder
  const filePath = req.file.path;

  // Set up the options for the Affinda API request
  const options = {
    method: 'POST',
    url: 'https://api.affinda.com/v3/documents',
    headers: {
      accept: 'application/json',
      'content-type': 'multipart/form-data; boundary=---011000010111000001101001',
      authorization: `Bearer ${process.env.KEY}`
    },
    formData: {
      wait: 'true',
      file: {
        value: fs.createReadStream(filePath),
        options: { filename: req.file.originalname, contentType: req.file.mimetype }
      },
      collection: 'lxiwtSAC',
      workspace: 'UPOhqDGy'
    }
  };

  // Make the request to the Affinda API
  request(options, (error, response, body) => {
    if (error) {
      console.error(error);
      res.status(500).send({ error: 'An error occurred while processing the file.' });
    } else {
      // Parse the response body as JSON
      const data = JSON.parse(body);

      // Send the parsed data back to the client
      res.send(data);
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
