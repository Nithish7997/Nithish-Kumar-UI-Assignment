/**
 * Custom React hook to debounce a value over a given delay.
 * @param {string} value - The value to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {string} - The debounced value.
 */
import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
