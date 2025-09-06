import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  isRouteErrorResponse,
  RouterProvider,
  useRouteError,
} from "react-router";
import { App } from "./App.tsx";
import {
  TransactionItemLoader,
  TransactionItemPage,
} from "./pages/transaction-item/ui/TransactionItem.tsx";
import "./index.css";
import {
  Dashboard,
  indexAction,
  indexLoader,
} from "./pages/index/ui/index.tsx";

import PocketBase from "pocketbase";

const API_URL = "https://cash-app-production-b1fe.up.railway.app";
export const pb = new PocketBase(API_URL);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        action: indexAction,
        loader: indexLoader,
      },
      {
        path: "/:transactionId",
        element: <TransactionItemPage />,
        loader: TransactionItemLoader,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);

export function ErrorBoundary() {
  const error = useRouteError();
  console.error({ error });
  if (isRouteErrorResponse(error)) {
    return (
      <div className="p-20">
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="p-20">
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
