import { Link, useRouteError } from 'react-router-dom';

/**
 * Exports a standard error page to show if any errors are thrown.
 * Provides a link to get back to the homepage
 */
export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to={'/home'}>Back to Homepage</Link>
    </div>
  );
}
