const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'assets.json');

let store = null;

/**
 * Get or create the in-memory data store, backed by a JSON file.
 * Provides a lightweight persistence layer without native dependencies.
 * @returns {{ assets: Array, tags: Array }} The data store object
 */
function getDatabase() {
  if (!store) {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      store = JSON.parse(raw);
    } else {
      store = { assets: [], tags: [] };
    }
  }
  return store;
}

/**
 * Persist the current in-memory store to the JSON file.
 * Called after every write operation to ensure durability.
 */
function saveDatabase() {
  const data = getDatabase();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Initialize the data directory and database file.
 * Creates the data folder and an empty store if they don't exist.
 */
function initializeDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    store = { assets: [], tags: [] };
    saveDatabase();
  } else {
    getDatabase();
  }
}

/**
 * Close the database by flushing any pending writes.
 * Should be called during server shutdown.
 */
function closeDatabase() {
  if (store) {
    saveDatabase();
    store = null;
  }
}

module.exports = { getDatabase, saveDatabase, initializeDatabase, closeDatabase };
