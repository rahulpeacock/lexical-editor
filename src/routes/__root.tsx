import { ThemeProvider } from '@/client/providers/theme-provider';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { scan } from 'react-scan';
import { Fragment } from 'react/jsx-runtime';

function scanReactApp() {
  scan({
    enabled: true,
    log: true, // logs render info to console (default: false)
  });
}

process.env.NODE_ENV === 'development' && scanReactApp();

export const Route = createRootRoute({
  component: () => (
    <Fragment>
      <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
        <Outlet />
      </ThemeProvider>
    </Fragment>
  ),
});
