import { useState, useEffect, useCallback } from 'react';
import { fetchAssets } from '../api/assetClient';

/**
 * useAssets - Custom hook for fetching and managing the asset list.
 * Handles loading state, error state, and automatic refetching when
 * the search query changes.
 * @param {string} searchQuery - The current search query to filter assets
 * @returns {{ assets: Array, isLoading: boolean, error: Error|null, refetch: Function }}
 */
export function useAssets(searchQuery = '') {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch assets from the API with the current search query.
   * Manages loading and error states throughout the request lifecycle.
   */
  const loadAssets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAssets(searchQuery);
      setAssets(data);
    } catch (fetchError) {
      setError(fetchError);
      setAssets([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  /**
   * Refetch assets — useful after uploads, edits, or deletions.
   */
  const refetch = useCallback(() => {
    loadAssets();
  }, [loadAssets]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  return { assets, isLoading, error, refetch };
}
