import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import type { JsonifiedClient } from "@orpc/openapi-client";
import type { ContractRouterClient } from "@orpc/contract";
import { createORPCClient, onError } from "@orpc/client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { contract } from "../../shared/contract.ts";
import { App } from "./App.tsx";
import {
  TransactionItem,
  TransactionItemLoader,
} from "./pages/transaction-item/ui/TransactionItem.tsx";
import "./index.css";
import { Dashboard, indexAction, indexLoader } from "./index.tsx";

const link = new OpenAPILink(contract, {
  url: "http://localhost:3000/api",
  headers: () => ({
    "x-api-key": "my-api-key",
  }),
  fetch: (request, init) => {
    return globalThis.fetch(request, {
      ...init,
      credentials: "include", // Include cookies for cross-origin requests
    });
  },
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

const client: JsonifiedClient<ContractRouterClient<typeof contract>> =
  createORPCClient(link);

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
