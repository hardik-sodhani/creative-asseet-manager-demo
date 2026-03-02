import React from 'react';
import { formatFileSize, formatRelativeDate } from '../utils/formatters';

/**
 * AssetCard - Displays a single asset as a clickable card with thumbnail,
 * name, file type badge, and metadata.
 * @param {Object} props
 * @param {Object} props.asset - The asset object containing name, type, size, tags, etc.
 * @param {Function} props.onClick - Callback when the card is clicked
 * @returns {React.ReactElement} A card component for one asset
 */
function AssetCard({ asset, onClick }) {
  const { name, fileType, fileSize, thumbnailUrl, tags, updatedAt } = asset;

  /**
   * Map file types to display-friendly badge colors.
   * @param {string} type - The file extension (e.g., "psd", "ai", "svg")
   * @returns {string} CSS class name for the badge color
   */
  const getBadgeClass = (type) => {
    const badgeMap = {
      psd: 'badge-blue',
      ai: 'badge-orange',
      svg: 'badge-green',
      png: 'badge-purple',
      jpg: 'badge-purple',
      xd: 'badge-pink',
      figma: 'badge-red',
    };
    return badgeMap[type.toLowerCase()] || 'badge-gray';
  };

  return (
    <article
      className="asset-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${name}`}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault(); // Space: prevent page scroll (WCAG 2.1.1)
          onClick();
        }
      }}
    >
      <figure className="asset-thumbnail">
        <img src={thumbnailUrl || '/placeholder.svg'} alt={`Preview of ${name}`} />
        <span className={`file-type-badge ${getBadgeClass(fileType)}`}>
          .{fileType}
        </span>
      </figure>

      <section className="asset-info">
        <h3 className="asset-name">{name}</h3>
        <p className="asset-meta">
          {formatFileSize(fileSize)} · Updated {formatRelativeDate(updatedAt)}
        </p>
        {tags && tags.length > 0 && (
          <ul className="asset-tags" aria-label="Tags">
            {tags.slice(0, 3).map((tag, index) => (
              <li key={`${tag}-${index}`} className="tag">{tag}</li>
            ))}
            {tags.length > 3 && (
              <li className="tag tag-more">+{tags.length - 3}</li>
            )}
          </ul>
        )}
      </section>
    </article>
  );
}

export default AssetCard;
