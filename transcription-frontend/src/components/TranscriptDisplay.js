// src/components/TranscriptDisplay.js

import React from 'react';
import '../App.css';
import { FaRegCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Convert milliseconds to "minutes:seconds" format
const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const TranscriptDisplay = ({ transcript, utterances }) => {
  if (!transcript) return null;

  // Prepare text to copy structured like the frontend display.
  const getCopyText = () => {
    let text = '';
    if (utterances && utterances.length > 0) {
      text += 'Transcript (with Timestamps & Speaker Labels):\n\n';
      utterances.forEach((utt) => {
        const time = `[${formatTime(utt.start)} - ${formatTime(utt.end)}]`;
        text += `• Speaker ${utt.speaker}: ${utt.text} ${time}\n\n`;
      });
    } else {
      text += 'Transcript:\n\n';
      // Split transcript text into sentences based on punctuation followed by space.
      const sentences = transcript.split(/(?<=[.!?])\s+/);
      sentences.forEach((sentence) => {
        text += `• ${sentence}\n\n`;
      });
    }
    return text.trim();
  };


  // Handler for copying the transcript to the clipboard
  const handleCopy = () => {
    const copyText = getCopyText();
    navigator.clipboard.writeText(copyText)
      .then(() => toast.success('Transcript copied to clipboard!'))
      .catch(() => toast.error('Failed to copy transcript.'));
  };

  // If utterances exist, display them with timestamps and speaker info
  if (utterances && utterances.length > 0) {
    return (
      <div className="transcript-container">
        <div className="transcript-header">
          <h2>Transcript (with Timestamps & Speaker Labels):</h2>
          <button className="copy-button" onClick={handleCopy}>
            <FaRegCopy /> Copy
          </button>
        </div>
        <ul className="transcript-list">
          {utterances.map((utt, index) => (
            <li key={index}>
              <strong>Speaker {utt.speaker}</strong>
              <em> ({formatTime(utt.start)} - {formatTime(utt.end)})</em>: {utt.text}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Fallback: split and show plain text sentences with bullet points
  const sentences = transcript.split(/(?<=[.!?])\s+/);
  return (
    <div className="transcript-container">
      <div className="transcript-header">
        <h2>Transcript:</h2>
        <button className="copy-button" onClick={handleCopy}>
          <FaRegCopy /> Copy
        </button>
      </div>
      <ul className="transcript-list">
        {sentences.map((sentence, index) => (
          <li key={index}>{sentence}</li>
        ))}
      </ul>
    </div>
  );
};

export default TranscriptDisplay;
