import React, { useState, useCallback } from 'react';
import { debounce } from '../utils/debounce';

/**
 * SearchBar - A debounced search input for filtering assets by name, tag, or type.
 * Implements debouncing to avoid excessive API calls on every keystroke.
 * @param {Object} props
 * @param {Function} props.onSearch - Callback invoked with the search query string
 * @returns {React.ReactElement} A search input with real-time filtering
 */
function SearchBar({ onSearch }) {
  const [inputValue, setInputValue] = useState('');

  /**
   * Debounced version of onSearch to limit API requests.
   * Waits 300ms after the user stops typing before triggering.
   */
  const debouncedSearch = useCallback(
    debounce((query) => {
      onSearch(query);
    }, 300),
    [onSearch]
  );

  /**
   * Handle input change — update local state immediately for responsive UI,
   * but debounce the actual search callback.
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleChange = (event) => {
    const query = event.target.value;
    setInputValue(query);
    debouncedSearch(query);
  };

  /**
   * Clear the search input and reset results.
   */
  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <div className="search-bar" role="search">
      <label htmlFor="asset-search" className="visually-hidden">
        Search assets
      </label>
      <input
        id="asset-search"
        type="search"
        placeholder="Search by name, tag, or file type..."
        value={inputValue}
        onChange={handleChange}
        aria-label="Search assets by name, tag, or file type"
      />
      {inputValue && (
        <button
          className="search-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
