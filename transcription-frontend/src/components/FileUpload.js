// src/components/FileUpload.js

import React, { useState } from 'react';
import { FaUpload, FaTrashAlt, FaFileAlt } from 'react-icons/fa';
import './FileUpload.css';

const FileUpload = React.forwardRef(({
  selectedFile,
  onFileChange,
  onRemoveFile,
  onSubmit,
  loading
}, ref) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const event = { target: { files: [file] } };
      onFileChange(event);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div
      className={`file-upload ${isDragging ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {!selectedFile ? (
        <div>
          <div className="hover-icon">
            <FaFileAlt size={48}/>
          </div>
          <input
            type="file"
            accept="audio/*,video/*"
            ref={ref}
            onChange={onFileChange}
            style={{ display: 'none' }}
            id="fileInput"
          />
          <label htmlFor="fileInput" className="upload-label">
            Click to browse or drag a file here
          </label>
        </div>
      ) : (
        <div className="file-details">
  <p><strong>Selected:</strong> {selectedFile.name}</p>
  <button
    className="button button-remove"
    onClick={onRemoveFile}
    disabled={loading}
  >
    <FaTrashAlt style={{ marginRight: '8px' }} />
    Remove
  </button>
  <button
    className="button button-upload"
    onClick={onSubmit}
    disabled={loading}
  >
    <FaUpload style={{ marginRight: '8px' }} />
    {loading ? 'Uploading...' : 'Upload'}
  </button>
</div>
      
      )}
    </div>
  );
});

export default FileUpload;
