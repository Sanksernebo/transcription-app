require('dotenv').config(); // Load env variables
const express = require('express');
const multer  = require('multer');
const cors = require('cors');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { AssemblyAI } = require('assemblyai');

const app = express();
const port = 5000;

// Enable CORS for your frontend
app.use(cors());

// Use multer to handle file uploads (stored in the "uploads" folder)
const upload = multer({ dest: 'uploads/' });

// Initialize the AssemblyAI client with your API key
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
   baseUrl: 'https://api.eu.assemblyai.com'
});

/**
 * Uploads a local file to AssemblyAI’s upload endpoint.
 * Returns the URL that AssemblyAI provides.
 */
const uploadFileToAssemblyAI = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const response = await fetch('https://api.eu.assemblyai.com/v2/upload', {
    method: 'POST',
    headers: {
      'authorization': process.env.ASSEMBLYAI_API_KEY,
    },
    body: fileStream
  });
  const data = await response.json();
  return data.upload_url;
};

// Endpoint to handle video/audio uploads
app.post('/api/upload', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const filePath = req.file.path;
    // Upload file to AssemblyAI and get a publicly accessible URL
    const audioUrl = await uploadFileToAssemblyAI(filePath);

    // Set up configuration for transcription using AssemblyAI
    const config = {
        audio_url: audioUrl,
        speaker_labels: true,
     };

    // Transcribe the audio/video using AssemblyAI.
    // NOTE: In a real-world scenario, this might require polling until the transcription job is complete.
    const transcriptResponse = await client.transcripts.transcribe(config);

    // Remove the local file after uploading
    fs.unlinkSync(filePath);

    // Send back the transcript text to the frontend
    res.json({ 
        transcript: transcriptResponse.text,
        utterances: transcriptResponse.utterances
     });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Transcription failed" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
