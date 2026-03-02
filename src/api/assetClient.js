const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Fetch all assets, optionally filtered by a search query.
 * @param {string} [query=''] - Optional search query to filter assets
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [limit=20] - Number of results per page
 * @returns {Promise<Array>} Array of asset objects
 * @throws {Error} If the API request fails
 */
export async function fetchAssets(query = '', page = 1, limit = 20) {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (query.trim()) {
      params.set('query', query.trim());
    }

    const response = await fetch(`${API_BASE_URL}/assets?${params}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch assets');
    }

    return result.data;
  } catch (error) {
    console.error('fetchAssets error:', error.message);
    throw error;
  }
}

/**
 * Upload a new asset file with optional tags.
 * @param {File} file - The file to upload
 * @param {string[]} [tags=[]] - Array of tag strings
 * @returns {Promise<Object>} The created asset object
 * @throws {Error} If the upload fails
 */
export async function uploadAsset(file, tags = []) {
  try {
    const extension = file.name.split('.').pop().toLowerCase();

    const response = await fetch(`${API_BASE_URL}/assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: file.name,
        fileType: extension,
        fileSize: file.size,
        tags,
        uploadedBy: 'Current User',
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }

    return result.data;
  } catch (error) {
    console.error('uploadAsset error:', error.message);
    throw error;
  }
}

/**
 * Update an existing asset's metadata.
 * @param {string} assetId - The unique ID of the asset to update
 * @param {Object} updates - Object containing fields to update (e.g., { tags, name })
 * @returns {Promise<Object>} The updated asset object
 * @throws {Error} If the update fails
 */
export async function updateAsset(assetId, updates) {
  try {
    const response = await fetch(`${API_BASE_URL}/assets/${assetId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Update failed');
    }

    return result.data;
  } catch (error) {
    console.error('updateAsset error:', error.message);
    throw error;
  }
}

/**
 * Delete an asset by ID.
 * @param {string} assetId - The unique ID of the asset to delete
 * @returns {Promise<void>}
 * @throws {Error} If the deletion fails
 */
export async function deleteAsset(assetId) {
  try {
    const response = await fetch(`${API_BASE_URL}/assets/${assetId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Delete failed');
    }
  } catch (error) {
    console.error('deleteAsset error:', error.message);
    throw error;
  }
}
