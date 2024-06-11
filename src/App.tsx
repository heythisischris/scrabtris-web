import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';
import { Home } from '#src/routes';
import { Navigation } from '#src/components';
import { PostHogProvider } from 'posthog-js/react'

const router = createBrowserRouter([
  {
    path: '',
    element: <Navigation />,
    children: [
      { path: '', element: <Home /> },
    ],
    errorElement: <>
      <Navigation />
      <Link to='/dashboard' className='absolute top-[calc(50%_-_100px)] left-[calc(50%_-_200px)] text-text text-center w-[400px] hover:opacity-50'>
        404 - Error!
      </Link>
    </>
  },
]);

export const App = () => <PostHogProvider apiKey={import.meta.env.VITE_POSTHOG_KEY} options={{ api_host: 'https://us.posthog.com' }}>
  <RouterProvider router={router} />
</PostHogProvider>