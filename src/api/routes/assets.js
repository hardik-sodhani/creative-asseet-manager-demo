const express = require('express');
const { v4: uuidv4 } = require('uuid');
const {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  searchAssets,
} = require('../../db/assetModel');

const router = express.Router();

/**
 * GET /api/assets
 * Retrieve all assets, optionally filtered by a search query.
 * Supports pagination via `page` and `limit` query params.
 */
router.get('/', (req, res) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;
    const queryStr = Array.isArray(query) ? query[0] || '' : query || '';
    const pageNum = Math.max(1, parseInt(page, 10)) || 1;
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10))) || 20;
    const offset = (pageNum - 1) * limitNum;

    const assets = queryStr
      ? searchAssets(queryStr, limitNum, offset)
      : getAllAssets(limitNum, offset);

    res.json({
      success: true,
      data: assets,
    });
  } catch (error) {
    console.error('Error fetching assets:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve assets.',
    });
  }
});

/**
 * GET /api/assets/:id
 * Retrieve a single asset by its unique ID.
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const asset = getAssetById(id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        error: 'Asset not found.',
      });
    }

    res.json({ success: true, data: asset });
  } catch (error) {
    console.error('Error fetching asset:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve asset.',
    });
  }
});

/**
 * POST /api/assets
 * Create a new asset record.
 * Validates required fields: name, fileType, fileSize.
 */
router.post('/', (req, res) => {
  try {
    const { name, fileType, fileSize, thumbnailUrl, tags, uploadedBy } = req.body;

    if (!name || !fileType || !fileSize) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, fileType, and fileSize are required.',
      });
    }

    const parsedSize = parseInt(fileSize, 10);
    if (isNaN(parsedSize) || parsedSize < 0) {
      return res.status(400).json({
        success: false,
        error: 'fileSize must be a valid non-negative number.',
      });
    }

    const newAsset = {
      id: uuidv4(),
      name: String(name).trim(),
      fileType: String(fileType).toLowerCase().trim(),
      fileSize: parsedSize,
      thumbnailUrl: thumbnailUrl || null,
      tags: Array.isArray(tags) ? tags.filter((t) => typeof t === 'string') : [],
      uploadedBy: uploadedBy || 'Unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = createAsset(newAsset);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error('Error creating asset:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create asset.',
    });
  }
});

/**
 * PATCH /api/assets/:id
 * Update an existing asset's metadata (tags, name, etc.).
 */
router.patch('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existingAsset = getAssetById(id);

    if (!existingAsset) {
      return res.status(404).json({
        success: false,
        error: 'Asset not found.',
      });
    }

    const { name: newName, tags: newTags } = req.body;
    const updates = { updatedAt: new Date().toISOString() };

    if (newName !== undefined) {
      updates.name = String(newName).trim();
    }
    if (newTags !== undefined) {
      updates.tags = Array.isArray(newTags) ? [...new Set(newTags.filter((t) => typeof t === 'string'))] : [];
    }

    const updatedAsset = updateAsset(id, updates);
    res.json({ success: true, data: updatedAsset });
  } catch (error) {
    console.error('Error updating asset:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update asset.',
    });
  }
});

/**
 * DELETE /api/assets/:id
 * Delete an asset by ID.
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existingAsset = getAssetById(id);

    if (!existingAsset) {
      return res.status(404).json({
        success: false,
        error: 'Asset not found.',
      });
    }

    deleteAsset(id);
    res.json({ success: true, data: { message: 'Asset deleted successfully.' } });
  } catch (error) {
    console.error('Error deleting asset:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to delete asset.',
    });
  }
});

module.exports = router;
