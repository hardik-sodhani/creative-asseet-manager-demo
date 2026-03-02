import React, { useState, useRef, useEffect } from 'react';
import { updateAsset } from '../api/assetClient';
import { formatFileSize, formatRelativeDate } from '../utils/formatters';

/**
 * AssetDetail - A slide-out panel showing full details for a selected asset.
 * Allows editing tags and metadata inline.
 * @param {Object} props
 * @param {Object} props.asset - The asset to display
 * @param {Function} props.onClose - Callback to close the detail panel
 * @param {Function} props.onUpdate - Callback after a successful update
 * @returns {React.ReactElement} A detail panel overlay
 */
function AssetDetail({ asset, onClose, onUpdate }) {
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const closeButtonRef = useRef(null);

  // Move focus into dialog and handle Escape (WCAG 2.1.1, 2.4.3)
  useEffect(() => {
    closeButtonRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  /**
   * Add a new tag to the asset.
   * Validates that the tag is non-empty and not a duplicate.
   */
  const handleAddTag = async () => {
    const trimmedTag = newTag.trim().toLowerCase();

    if (!trimmedTag) {
      return;
    }

    if ((asset.tags || []).includes(trimmedTag)) {
      setSaveError('This tag already exists');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const updatedTags = [...(asset.tags || []), trimmedTag];
      await updateAsset(asset.id, { tags: updatedTags });
      setNewTag('');
      onUpdate();
    } catch (error) {
      setSaveError('Failed to add tag. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Remove a tag from the asset by value.
   * @param {string} tagToRemove - The tag string to remove
   */
  const handleRemoveTag = async (tagToRemove) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const updatedTags = (asset.tags || []).filter((tag) => tag !== tagToRemove);
      await updateAsset(asset.id, { tags: updatedTags });
      onUpdate();
    } catch (error) {
      setSaveError('Failed to remove tag. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <aside
      className="asset-detail-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="asset-detail-title"
      aria-label="Asset details"
    >
      <article className="asset-detail-panel">
        <header className="detail-header">
          <h2 id="asset-detail-title">{asset.name}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close detail panel"
          >
            ✕
          </button>
        </header>

        <figure className="detail-preview">
          <img
            src={asset.thumbnailUrl || '/placeholder.svg'}
            alt={`Full preview of ${asset.name}`}
          />
        </figure>

        <section className="detail-metadata">
          <dl>
            <dt>File Type</dt>
            <dd>.{asset.fileType}</dd>

            <dt>File Size</dt>
            <dd>{formatFileSize(asset.fileSize)}</dd>

            <dt>Uploaded By</dt>
            <dd>{asset.uploadedBy}</dd>

            <dt>Created</dt>
            <dd>{formatRelativeDate(asset.createdAt)}</dd>

            <dt>Last Updated</dt>
            <dd>{formatRelativeDate(asset.updatedAt)}</dd>
          </dl>
        </section>

        <section className="detail-tags">
          <h3>Tags</h3>
          <ul className="tag-list">
            {(asset.tags || []).map((tag, index) => (
              <li key={`${tag}-${index}`} className="tag tag-removable">
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  disabled={isSaving}
                  aria-label={`Remove tag ${tag}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <form
            className="add-tag-form"
            onSubmit={(event) => {
              event.preventDefault();
              handleAddTag();
            }}
          >
            <input
              type="text"
              value={newTag}
              onChange={(event) => setNewTag(event.target.value)}
              placeholder="Add a tag..."
              disabled={isSaving}
              aria-label="New tag name"
            />
            <button type="submit" disabled={isSaving || !newTag.trim()}>
              Add
            </button>
          </form>

          {saveError && (
            <p className="error-message" role="alert">{saveError}</p>
          )}
        </section>
      </article>
    </aside>
  );
}

export default AssetDetail;
