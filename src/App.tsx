import { useRef } from "react";
import { useFetcher, useLoaderData } from "react-router";

export async function indexLoader() {
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
  return transactions;
}

type transaction = {
  description: string;
  amount: number;
};
export async function indexAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const description = formData.get("description");
  const amount = formData.get("amount");
  console.log("Action received data:", { description, amount });

  const existing_transanctions = JSON.parse(
    localStorage.getItem("transactions") || "[]",
  );
  const new_transaction = { description: description, amount: Number(amount) };
  const updated_transactions = [...existing_transanctions, new_transaction];
  localStorage.setItem("transactions", JSON.stringify(updated_transactions));
  return updated_transactions;
}

export function App() {
  return (
    <div className="flex px-16 h-screen ">
      <Sidebar />

      <Dashboard />
    </div>
  );
}

const Sidebar = () => {
  return (
    <>
      <nav className="w-[250px] pt-[36px] h-full">
        <header className="pb-20 text-xl font-medium">Cash app</header>
        <ul className="font-medium ">
          <li>Activity</li>
          <li>Cash</li>
          <li>Savings</li>
          <li>Card</li>
          <li>Pay & Request</li>
          <li>Tax filling</li>
          <li>Documents</li>
          <li>Account</li>
          <li>Support</li>
          <li>Log out</li>
        </ul>
      </nav>
    </>
  );
};
const Dashboard = () => {
  return (
    <section className="px-[40px] py-[40px] flex-1 bg-[#f4f4f4] h-full">
      <div className="bg-white px-16 py-16 rounded-2xl h-full">
        <DashboardHeader />
        <DashboardOverview />
        <DashboardHistoy />
      </div>
    </section>
  );
};

const DashboardHeader = () => {
  const fetcher = useFetcher();
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <section>
      <header>dash header</header>
      <main className="outline outline-1 flex justify-between">
        <span>dash header content</span>
        <div className="flex gap-10">
          <button onClick={() => dialogRef.current?.showModal()}>
            new income
          </button>
          <dialog ref={dialogRef} className="pb-10">
            <fetcher.Form className="flex flex-col" method="POST" action="/">
              <section className="px-10 pt-10">
                <header className="flex justify-between pb-10">
                  <span>Create a new income transaction</span>
                  <button onClick={() => dialogRef.current?.close()}>x</button>
                </header>
                <main className="pb-10 flex flex-col">
                  <label htmlFor="">Description</label>
                  <input type="text" name="description" />

                  <label htmlFor="">Amount</label>
                  <input type="number" name="amount" placeholder="0" />

                  <label htmlFor="">Category</label>
                  <select name="category" id="">
                    <option value="">select an option</option>
                    <option value="salary">salary</option>
                    <option value="investments">investments</option>
                  </select>

                  <label htmlFor="">Transaction date</label>
                  <input type="date" name="date" />
                </main>
              </section>
              <footer className="flex justify-end pr-10 gap-10">
                <button type="submit">
                  {fetcher.state != "idle" ? "creating" : "create"}
                </button>
              </footer>
            </fetcher.Form>
          </dialog>
          <button>new expense</button>
        </div>
      </main>
    </section>
  );
};

const DashboardOverview = () => {
  const transactions = useLoaderData();
  console.log("transactions", transactions);

  return (
    <>
      <section>
        <header>dash overview</header>
        <main className="outline outline-1">
          <span>dash overview content</span>
        </main>
        <ul>
          {transactions.map((transaction: transaction) => (
            <li className="flex gap-10">
              <span>{transaction.description}</span>
              <span>{transaction.amount}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

const DashboardHistoy = () => {
  return (
    <section>
      <header>dash history</header>
      <main className="outline outline-1">dash history content</main>
    </section>
  );
};
