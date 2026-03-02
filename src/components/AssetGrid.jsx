import React, { useMemo } from 'react';
import AssetCard from './AssetCard';

/**
 * AssetGrid - Displays a responsive grid of asset cards.
 * Memoizes the sorted asset list to avoid unnecessary re-renders.
 * @param {Object} props
 * @param {Array} props.assets - Array of asset objects to display
 * @param {Function} props.onAssetSelect - Callback when a user clicks an asset card
 * @returns {React.ReactElement} A grid layout of AssetCard components
 */
function AssetGrid({ assets, onAssetSelect }) {
  /**
   * Sort assets by most recently updated, memoized to avoid recomputation
   * on every render unless the assets array changes.
   */
  const sortedAssets = useMemo(() => {
    return [...assets].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }, [assets]);

  return (
    <section className="asset-grid" aria-label="Asset gallery">
      {sortedAssets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onClick={() => onAssetSelect(asset)}
        />
      ))}
    </section>
  );
}

export default AssetGrid;
