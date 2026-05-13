import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from '@/App.tsx'
import Landing from '@/pages/Landing';
import Login  from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/components/Dashboard';

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path:"/",
          element: <Landing/>
        },
        {
          path:"/login",
          element: <Login/>
        },
        {
          path:"/signup",
          element: <Signup/>
        },
         {
          path:"/dashboard",
          element: <Dashboard/>
        },
      ]
    }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
