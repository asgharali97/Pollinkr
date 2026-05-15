import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from '@/App.tsx'
import Landing from '@/pages/Landing';
import Login  from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import CreatePoll from '@/pages/CreatePoll';
import PollResponse from '@/pages/PollResponse';
import Analytics from '@/pages/Analytics';
import PublishedResults from '@/pages/PublishedResults';

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
        {
          path:"/polls/create",
          element: <CreatePoll/>
        },
        {
          path:"/polls",
          element: <PollResponse/>
        },
        {
          path:"/result",
          element: <Analytics/>
        },
        {
          path:"/poll/result",
          element: <PublishedResults/>
        },
      ]
    }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
