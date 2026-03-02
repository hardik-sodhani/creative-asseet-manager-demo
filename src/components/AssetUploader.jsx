import React, { useState, useRef, useEffect } from 'react';
import { uploadAsset } from '../api/assetClient';

const ALLOWED_FILE_TYPES = ['psd', 'ai', 'svg', 'png', 'jpg', 'jpeg', 'xd', 'figma', 'pdf'];
const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * AssetUploader - A modal dialog for uploading new creative assets.
 * Validates file type and size before submission.
 * @param {Object} props
 * @param {Function} props.onUploadComplete - Callback after successful upload
 * @param {Function} props.onClose - Callback to close the uploader
 * @returns {React.ReactElement} An upload form with drag-and-drop support
 */
function AssetUploader({ onUploadComplete, onClose }) {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Move focus into dialog and handle Escape (WCAG 2.1.1, 2.4.3)
  useEffect(() => {
    closeButtonRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isUploading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isUploading]);

  /**
   * Validate that the selected file meets type and size requirements.
   * @param {File} fileToValidate - The file object to validate
   * @returns {{ isValid: boolean, error: string|null }}
   */
  const validateFile = (fileToValidate) => {
    const extension = fileToValidate.name.split('.').pop().toLowerCase();

    if (!ALLOWED_FILE_TYPES.includes(extension)) {
      return {
        isValid: false,
        error: `File type .${extension} is not supported. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`,
      };
    }

    if (fileToValidate.size > MAX_FILE_SIZE_BYTES) {
      return {
        isValid: false,
        error: `File exceeds the ${MAX_FILE_SIZE_MB}MB size limit.`,
      };
    }

    return { isValid: true, error: null };
  };

  /**
   * Handle file selection from the file input or drag-and-drop.
   * @param {File} selectedFile - The selected file
   */
  const handleFileSelect = (selectedFile) => {
    setUploadError(null);
    const validation = validateFile(selectedFile);

    if (!validation.isValid) {
      setUploadError(validation.error);
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  /**
   * Handle the form submission to upload the asset.
   * @param {React.FormEvent} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setUploadError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const tagList = tags
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0);

      await uploadAsset(file, tagList);
      onUploadComplete();
    } catch (error) {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <aside
      className="uploader-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-dialog-title"
      aria-label="Upload asset"
    >
      <form className="uploader-panel" onSubmit={handleSubmit}>
        <header className="uploader-header">
          <h2 id="upload-dialog-title">Upload New Asset</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close uploader"
          >
            ✕
          </button>
        </header>

        <section
          className={`drop-zone ${isDragOver ? 'drop-zone-active' : ''}`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragOver(false);
            const droppedFile = event.dataTransfer.files[0];
            if (droppedFile) {
              handleFileSelect(droppedFile);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Drop a file here or click to browse"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_FILE_TYPES.map((type) => `.${type}`).join(',')}
            onChange={(event) => {
              const selectedFile = event.target.files[0];
              if (selectedFile) {
                handleFileSelect(selectedFile);
              }
            }}
            hidden
          />
          {file ? (
            <p className="selected-file">{file.name}</p>
          ) : (
            <p>Drag and drop a file here, or click to browse</p>
          )}
        </section>

        <fieldset className="uploader-fields">
          <label htmlFor="asset-tags">Tags (comma-separated)</label>
          <input
            id="asset-tags"
            type="text"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="e.g., hero-image, campaign-2024, photoshop"
            disabled={isUploading}
          />
        </fieldset>

        {uploadError && (
          <p className="error-message" role="alert">{uploadError}</p>
        )}

        <footer className="uploader-actions">
          <button type="button" onClick={onClose} disabled={isUploading}>
            Cancel
          </button>
          <button type="submit" disabled={isUploading || !file} className="primary-button">
            {isUploading ? 'Uploading...' : 'Upload Asset'}
          </button>
        </footer>
      </form>
    </aside>
  );
}

export default AssetUploader;
