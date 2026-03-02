const { getDatabase, saveDatabase } = require('./database');

/**
 * Format an asset record with its associated tags for API responses.
 * @param {Object} asset - Raw asset object from the store
 * @param {string[]} tags - Array of tag strings for this asset
 * @returns {Object} Formatted asset object with camelCase keys
 */
function formatAsset(asset, tags) {
  return {
    id: asset.id,
    name: asset.name,
    fileType: asset.fileType,
    fileSize: asset.fileSize,
    thumbnailUrl: asset.thumbnailUrl,
    uploadedBy: asset.uploadedBy,
    tags: tags,
    createdAt: asset.createdAt,
    updatedAt: asset.updatedAt,
  };
}

/**
 * Fetch all tags for a given asset ID.
 * @param {string} assetId - The asset's unique ID
 * @returns {string[]} Array of tag strings
 */
function getTagsForAsset(assetId) {
  const db = getDatabase();
  return db.tags
    .filter((entry) => entry.assetId === assetId)
    .map((entry) => entry.tag);
}

/**
 * Retrieve all assets with pagination.
 * Returns assets sorted by most recently updated.
 * @param {number} limit - Max number of results
 * @param {number} offset - Number of results to skip
 * @returns {Array} Array of formatted asset objects
 */
function getAllAssets(limit = 20, offset = 0) {
  const db = getDatabase();

  const sorted = [...db.assets].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  const paginated = sorted.slice(offset, offset + limit);
  return paginated.map((asset) => formatAsset(asset, getTagsForAsset(asset.id)));
}

/**
 * Retrieve a single asset by its unique ID.
 * @param {string} id - The asset's unique ID
 * @returns {Object|null} The formatted asset, or null if not found
 */
function getAssetById(id) {
  const db = getDatabase();
  const asset = db.assets.find((a) => a.id === id);

  if (!asset) {
    return null;
  }

  return formatAsset(asset, getTagsForAsset(asset.id));
}

/**
 * Search assets by name, file type, or tag.
 * Uses case-insensitive partial matching.
 * @param {string} query - The search term
 * @param {number} limit - Max number of results
 * @param {number} offset - Number of results to skip
 * @returns {Array} Array of matching asset objects
 */
function searchAssets(query, limit = 20, offset = 0) {
  const db = getDatabase();
  const lowerQuery = query.toLowerCase();

  const matches = db.assets.filter((asset) => {
    const nameMatch = asset.name.toLowerCase().includes(lowerQuery);
    const typeMatch = asset.fileType.toLowerCase().includes(lowerQuery);
    const tags = getTagsForAsset(asset.id);
    const tagMatch = tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
    return nameMatch || typeMatch || tagMatch;
  });

  const sorted = matches.sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  const paginated = sorted.slice(offset, offset + limit);
  return paginated.map((asset) => formatAsset(asset, getTagsForAsset(asset.id)));
}

/**
 * Create a new asset record with associated tags.
 * Persists to the JSON store after insertion.
 * @param {Object} asset - The asset data to insert
 * @returns {Object} The created asset with tags
 */
function createAsset(asset) {
  const db = getDatabase();

  db.assets.push({
    id: asset.id,
    name: asset.name,
    fileType: asset.fileType,
    fileSize: asset.fileSize,
    thumbnailUrl: asset.thumbnailUrl,
    uploadedBy: asset.uploadedBy,
    createdAt: asset.createdAt,
    updatedAt: asset.updatedAt,
  });

  for (const tag of asset.tags) {
    const existingTag = db.tags.find(
      (t) => t.assetId === asset.id && t.tag === tag
    );
    if (!existingTag) {
      db.tags.push({ assetId: asset.id, tag: tag });
    }
  }

  saveDatabase();
  return getAssetById(asset.id);
}

/**
 * Update an asset's metadata and/or tags.
 * @param {string} id - The asset's unique ID
 * @param {Object} updates - Fields to update
 * @returns {Object} The updated asset
 */
function updateAsset(id, updates) {
  const db = getDatabase();
  const assetIndex = db.assets.findIndex((a) => a.id === id);

  if (assetIndex === -1) {
    return null;
  }

  if (updates.name) {
    db.assets[assetIndex].name = updates.name;
  }

  db.assets[assetIndex].updatedAt = updates.updatedAt || new Date().toISOString();

  if (updates.tags) {
    db.tags = db.tags.filter((t) => t.assetId !== id);
    for (const tag of updates.tags) {
      db.tags.push({ assetId: id, tag: tag });
    }
  }

  saveDatabase();
  return getAssetById(id);
}

/**
 * Delete an asset and its associated tags.
 * @param {string} id - The asset's unique ID
 */
function deleteAsset(id) {
  const db = getDatabase();
  db.assets = db.assets.filter((a) => a.id !== id);
  db.tags = db.tags.filter((t) => t.assetId !== id);
  saveDatabase();
}

module.exports = {
  getAllAssets,
  getAssetById,
  searchAssets,
  createAsset,
  updateAsset,
  deleteAsset,
};
