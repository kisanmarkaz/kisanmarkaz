import { useEffect } from 'react';

/**
 * Hook to manage custom cursor functionality
 * @param active - Whether the custom cursor is active
 */
export const useCursor = (active: boolean = true) => {
  useEffect(() => {
    // Add or remove the custom-cursor-active class to the body
    if (active) {
      document.body.classList.add('custom-cursor-active');
    } else {
      document.body.classList.remove('custom-cursor-active');
    }

    return () => {
      // Clean up by removing the class when the component unmounts
      document.body.classList.remove('custom-cursor-active');
    };
  }, [active]);

  return null;
};

export default useCursor;