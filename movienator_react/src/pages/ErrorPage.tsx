import { Paper } from '@mui/material';
import { useEffect } from 'react';
import { Link, useRouteError } from 'react-router-dom';

/**
 * Exports a standard error page to show if any errors are thrown.
 * Provides a link to get back to the homepage
 */
export default function ErrorPage() {
  // 'any' is ok here because useRouteError is not typed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error: any = useRouteError();
  console.error(error);

  useEffect(() => {
    document.title = 'Error';
  }, []);

  return (
    <Paper id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to={'/home'}>Back to Homepage</Link>
    </Paper>
  );
}
