import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { App, indexAction, indexLoader } from "./App.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    action: indexAction,
    loader: indexLoader,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
