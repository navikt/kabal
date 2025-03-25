import { AppErrorBoundary } from '@app/components/app/error-boundary';
import { StaticDataLoader } from '@app/components/app/static-data-context';
import { Keys, isMetaKey } from '@app/keys';
import { reduxStore } from '@app/redux/configure-store';
import { StrictMode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './router';

export const App = () => {
  // Prevent browser from saving the page when pressing Ctrl+S or Cmd+S.
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (isMetaKey(event) && event.key === Keys.S) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);

  return (
    <StrictMode>
      <AppErrorBoundary>
        <Provider store={reduxStore}>
          <StaticDataLoader>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </StaticDataLoader>
        </Provider>
      </AppErrorBoundary>
    </StrictMode>
  );
};
