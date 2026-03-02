const { v4: uuidv4 } = require('uuid');
const { initializeDatabase } = require('./database');
const { createAsset } = require('./assetModel');

/**
 * Seed the database with sample creative assets.
 * Provides realistic Adobe Creative Cloud-style demo data.
 */
function seedDatabase() {
  initializeDatabase();

  const sampleAssets = [
    {
      id: uuidv4(),
      name: 'Hero Banner - Spring Campaign',
      fileType: 'psd',
      fileSize: 45000000,
      thumbnailUrl: null,
      tags: ['hero-image', 'campaign-spring', 'photoshop', 'marketing'],
      uploadedBy: 'Sarah Chen',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-02-01T14:22:00Z',
    },
    {
      id: uuidv4(),
      name: 'Brand Logo - Dark Variant',
      fileType: 'ai',
      fileSize: 2400000,
      thumbnailUrl: null,
      tags: ['logo', 'brand', 'illustrator', 'dark-mode'],
      uploadedBy: 'Marcus Johnson',
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-28T11:15:00Z',
    },
    {
      id: uuidv4(),
      name: 'Icon Set - Creative Cloud',
      fileType: 'svg',
      fileSize: 850000,
      thumbnailUrl: null,
      tags: ['icons', 'creative-cloud', 'ui', 'vector'],
      uploadedBy: 'Priya Patel',
      createdAt: '2024-01-20T13:45:00Z',
      updatedAt: '2024-02-05T16:30:00Z',
    },
    {
      id: uuidv4(),
      name: 'Product Screenshot - Lightroom',
      fileType: 'png',
      fileSize: 8900000,
      thumbnailUrl: null,
      tags: ['screenshot', 'lightroom', 'product', 'documentation'],
      uploadedBy: 'David Kim',
      createdAt: '2024-02-01T08:00:00Z',
      updatedAt: '2024-02-03T10:45:00Z',
    },
    {
      id: uuidv4(),
      name: 'Mobile App Prototype - Express',
      fileType: 'xd',
      fileSize: 15600000,
      thumbnailUrl: null,
      tags: ['prototype', 'mobile', 'adobe-xd', 'ux'],
      uploadedBy: 'Elena Rodriguez',
      createdAt: '2024-01-25T15:20:00Z',
      updatedAt: '2024-02-04T09:10:00Z',
    },
    {
      id: uuidv4(),
      name: 'Typography Guide - Brand Standards',
      fileType: 'pdf',
      fileSize: 3200000,
      thumbnailUrl: null,
      tags: ['typography', 'brand', 'guide', 'standards'],
      uploadedBy: 'Sarah Chen',
      createdAt: '2024-01-05T11:00:00Z',
      updatedAt: '2024-01-05T11:00:00Z',
    },
    {
      id: uuidv4(),
      name: 'Social Media Templates - Q1',
      fileType: 'psd',
      fileSize: 28000000,
      thumbnailUrl: null,
      tags: ['social-media', 'templates', 'photoshop', 'marketing', 'q1'],
      uploadedBy: 'Marcus Johnson',
      createdAt: '2024-01-18T14:30:00Z',
      updatedAt: '2024-02-02T08:45:00Z',
    },
    {
      id: uuidv4(),
      name: 'Color Palette - Accessibility Update',
      fileType: 'svg',
      fileSize: 120000,
      thumbnailUrl: null,
      tags: ['colors', 'accessibility', 'a11y', 'design-system'],
      uploadedBy: 'Priya Patel',
      createdAt: '2024-02-06T10:00:00Z',
      updatedAt: '2024-02-06T10:00:00Z',
    },
  ];

  console.log('Seeding database with sample assets...');

  for (const asset of sampleAssets) {
    try {
      createAsset(asset);
      console.log(`  Created: ${asset.name}`);
    } catch (error) {
      console.error(`  Failed to create ${asset.name}:`, error.message);
    }
  }

  console.log('Database seeding complete.');
}

seedDatabase();
