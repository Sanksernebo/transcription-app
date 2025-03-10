// src/controllers/transcriptionController.js

export const uploadVideo = async (file) => {
    const formData = new FormData();
    formData.append('video', file);
  
    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error uploading video');
    }
    return data;
  };
  