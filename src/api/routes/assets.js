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
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const assets = query
      ? searchAssets(query, limitNum, offset)
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

    const newAsset = {
      id: uuidv4(),
      name: name.trim(),
      fileType: fileType.toLowerCase().trim(),
      fileSize: parseInt(fileSize, 10),
      thumbnailUrl: thumbnailUrl || null,
      tags: Array.isArray(tags) ? tags : [],
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

    const updates = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

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
