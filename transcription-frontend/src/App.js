// src/App.js

import React, { useState, useRef } from 'react';
import FileUpload from './components/FileUpload';
import TranscriptDisplay from './components/TranscriptDisplay';
import { uploadVideo } from './controllers/transcriptionController';
import './App.css';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  // transcriptData contains both the full transcript and structured utterances
  const [transcriptData, setTranscriptData] = useState({ transcript: '', utterances: [] });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type (audio/video)
      if (!file.type.startsWith("video/") && !file.type.startsWith("audio/")) {
        toast.error("Please upload a valid audio or video file.");
        event.target.value = '';
        return;
      }
      setSelectedFile(file);
      setTranscriptData({ transcript: '', utterances: [] });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setTranscriptData({ transcript: '', utterances: [] });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;
    setLoading(true);
    try {
      const result = await uploadVideo(selectedFile);
      setTranscriptData(result);
    } catch (error) {
      console.error('Error uploading video:', error);
      setTranscriptData({ transcript: 'Error uploading video', utterances: [] });
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Video Transcription Tool</h1>
        <p className="description">
          Upload a video or audio file to get an AI-generated transcript.
        </p>
        <FileUpload
          ref={fileInputRef}
          selectedFile={selectedFile}
          onFileChange={handleFileChange}
          onRemoveFile={handleRemoveFile}
          onSubmit={handleSubmit}
          loading={loading}
        />
        {loading && <div className="spinner"></div>}
        <TranscriptDisplay 
          transcript={transcriptData.transcript} 
          utterances={transcriptData.utterances} 
        />
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
}

export default App;
