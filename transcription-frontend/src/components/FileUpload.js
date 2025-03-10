// src/components/FileUpload.js
import React from 'react';
import '../App.css';

const FileUpload = React.forwardRef(
  ({ selectedFile, onFileChange, onRemoveFile, onSubmit, loading }, ref) => {
    return (
      <form onSubmit={onSubmit}>
        <div className="file-input-container">
          <input
            type="file"
            accept="video/*"
            id="file-upload"
            onChange={onFileChange}
            ref={ref}
          />
          <label htmlFor="file-upload" className="file-input-label">
            Select Video
          </label>
        </div>
        {selectedFile && (
          <div className="file-name">
            Selected file: <strong>{selectedFile.name}</strong>
            <span className="remove-button" onClick={onRemoveFile}>
              ✖
            </span>
          </div>
        )}
        <button
          type="submit"
          className="upload-button"
          disabled={!selectedFile || loading}
        >
          {loading ? 'Processing...' : 'Upload & Transcribe'}
        </button>
      </form>
    );
  }
);

export default FileUpload;
