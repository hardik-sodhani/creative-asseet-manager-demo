/**
 * Create a debounced version of a function that delays invocation
 * until after the specified wait time has elapsed since the last call.
 * Useful for limiting API calls during search input.
 * @param {Function} func - The function to debounce
 * @param {number} waitMs - Milliseconds to wait before invoking
 * @returns {Function} The debounced function
 */
export function debounce(func, waitMs) {
  let timeoutId = null;

  const debouncedFunction = (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, waitMs);
  };

  /**
   * Cancel any pending debounced invocation.
   */
  debouncedFunction.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFunction;
}
