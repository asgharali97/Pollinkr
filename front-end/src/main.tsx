import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "@/App";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import CreatePoll from "@/pages/CreatePoll";
import PollResponse from "@/pages/PollResponse";
import Analytics from "@/pages/Analytics";
import PublishedResults from "@/pages/PublishedResults";
import NotFound from "@/pages/NotFound";
import { useAuthStore } from "@/store/auth.store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export function ProtectedRoute() {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function GuestRoute() {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Landing /> },

      // Guest only
      {
        element: <GuestRoute />,
        children: [
          { path: "login", element: <Login /> },
          { path: "signup", element: <Signup /> },
        ],
      },

      // Protected
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "polls/create", element: <CreatePoll /> },
          { path: "polls/:id/edit", element: <CreatePoll /> },
          { path: "polls/:id/analytics", element: <Analytics /> },
        ],
      },

      // Public
      { path: "p/:shareId", element: <PollResponse /> },
      { path: "p/:shareId/results", element: <PublishedResults /> },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
