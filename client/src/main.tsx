import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  isRouteErrorResponse,
  RouterProvider,
  useRouteError,
} from "react-router";
import "./index.css";
import { CardPage } from "./pages/card/card-page.tsx";
import { CashPage, CashPageLoader } from "./pages/cash/ui/cash-page.tsx";
import {
  Dashboard,
  indexAction,
  indexLoader,
} from "./pages/index/ui/index.tsx";
import { Root } from "./pages/root/ui/root.tsx";
import {
  SavingsPage,
  SavingsPageLoader,
} from "./pages/savings/savings-page.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        action: indexAction,
        loader: indexLoader,
      },
      {
        path: "/cash",
        element: <CashPage />,
        loader: CashPageLoader,
      },
      {
        path: "/savings",
        element: <SavingsPage />,
        loader: SavingsPageLoader,
      },
      {
        path: "/card",
        element: <CardPage />,
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
