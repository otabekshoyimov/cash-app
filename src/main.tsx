import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { App } from "./App.tsx";
import {
  TransactionItem,
  TransactionItemLoader,
} from "./pages/transaction-item/ui/TransactionItem.tsx";
import "./index.css";
import { Dashboard, indexAction, indexLoader } from "./index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        action: indexAction,
        loader: indexLoader,
      },
      {
        path: "/:transactionId",
        element: <TransactionItem />,
        loader: TransactionItemLoader,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
