import React, { useState, useRef, useCallback, useEffect } from 'react';
import SearchBar from './SearchBar';
import AssetGrid from './AssetGrid';
import AssetUploader from './AssetUploader';
import AssetDetail from './AssetDetail';
import { useAssets } from '../hooks/useAssets';

/**
 * App - Root component for the Creative Asset Manager.
 * Manages global state for search queries, selected assets, and upload visibility.
 * @returns {React.ReactElement} The main application layout
 */
function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  const uploadButtonRef = useRef(null);

  const { assets, isLoading, error, refetch } = useAssets(searchQuery);

  useEffect(() => {
    setSelectedAsset((prev) => {
      if (!prev) return prev;
      const updated = assets.find((a) => a.id === prev.id);
      return updated || null;
    });
  }, [assets]);

  /**
   * Handle search input changes with the current query string.
   * @param {string} query - The search term entered by the user
   */
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setSelectedAsset(null);
  }, []);

  /**
   * Handle successful asset upload by refreshing the asset list.
   */
  const handleUploadComplete = () => {
    setShowUploader(false);
    refetch();
    uploadButtonRef.current?.focus();
  };

  const handleCloseUploader = () => {
    setShowUploader(false);
    uploadButtonRef.current?.focus();
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="app">
      <header className="app-header">
        <h1>Creative Asset Manager</h1>
        <p className="app-subtitle">Manage your team's design assets in one place</p>
      </header>

      <nav className="app-toolbar">
        <SearchBar onSearch={handleSearch} />
        <button
          ref={uploadButtonRef}
          type="button"
          className="upload-button"
          onClick={() => setShowUploader(true)}
          aria-label="Upload new asset"
        >
          + Upload Asset
        </button>
      </nav>

      <section className="app-content">
        {error && (
          <article className="error-banner" role="alert">
            <p>Something went wrong: {error.message}</p>
            <button type="button" onClick={refetch}>Try Again</button>
          </article>
        )}

        {isLoading && (
          <p className="loading-indicator" aria-live="polite" aria-busy="true">
            Loading assets...
          </p>
        )}

        {!isLoading && !error && assets.length === 0 && (
          <article className="empty-state" aria-live="polite">
            <p>No assets found. Upload your first design asset to get started.</p>
          </article>
        )}

        {!isLoading && assets.length > 0 && (
          <AssetGrid
            assets={assets}
            onAssetSelect={setSelectedAsset}
          />
        )}
      </section>

      {selectedAsset && (
        <AssetDetail
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onUpdate={refetch}
        />
      )}

      {showUploader && (
        <AssetUploader
          onUploadComplete={handleUploadComplete}
          onClose={handleCloseUploader}
        />
      )}
    </main>
    </>
  );
}

export default App;
