import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from '@/App.tsx'
import Landing from '@/pages/Landing.tsx';

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path:"/",
          element: <Landing/>
        }
      ]
    }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
