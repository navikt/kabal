import { useEffect } from 'react';

export const useMarkVisited = (urls: string[]) => {
  useEffect(() => {
    if (urls.length === 0) {
      return;
    }

    const currentUrl = window.location.href;

    for (const url of urls) {
      window.history.replaceState(null, '', url);
    }

    window.history.replaceState(null, '', currentUrl);
  }, [urls]);
};
