import { useRef } from "react";
import { Link, useFetcher, useLoaderData } from "react-router";

export async function indexLoader() {
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
  return transactions;
}

export type transaction = {
  id: string;
  date: string;
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
  const new_transaction = {
    id: crypto.randomUUID(),
    date: new Date(),
    description: description,
    amount: Number(amount),
  };
  const updated_transactions = [...existing_transanctions, new_transaction];
  localStorage.setItem("transactions", JSON.stringify(updated_transactions));
  return updated_transactions;
}

export const Dashboard = () => {
  const transactions = useLoaderData();
  console.log("transactions", transactions);
  const fetcher = useFetcher();
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div className="px-[40px] py-[40px] flex-1 bg-[#f4f4f4] h-full flex flex-col gap-16">
      <section className="bg-white px-16 py-16 rounded-2xl">
        <main>
          <ul className="flex gap-10">
            <DashboardChipItem label="Dollar" price={100} />
            <DashboardChipItem label="Euro" price={92} />
          </ul>
        </main>
      </section>
      <section className="bg-white px-16 py-16 rounded-2xl h-full">
        <div>
          <header className="flex gap-10 justify-between pb-10">
            <div>Search</div>
            <div className="flex gap-10">
              <button
                className="px-4"
                onClick={() => dialogRef.current?.showModal()}
              >
                New income
              </button>
              <button className="px-4">New expense</button>
            </div>
          </header>
          <main className="outline outline-[0.5px] outline-gray-200 flex justify-between">
            <div className="flex gap-10">
              <dialog ref={dialogRef} className="pb-10">
                <fetcher.Form className="flex flex-col" method="POST">
                  <section className="px-10 pt-10">
                    <header className="flex justify-between pb-10">
                      <span>Create a new income transaction</span>
                      <button
                        type="button"
                        onClick={() => dialogRef.current?.close()}
                      >
                        x
                      </button>
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
            </div>
          </main>
          <footer className="py-10">
            <ul className="flex justify-between">
              <li className="font-medium">Transaction</li>
              <li className="font-medium">Date</li>
              <li className="font-medium">Amount</li>
            </ul>
            <ul>
              {transactions.map((transaction: transaction) => (
                <li key={transaction.id} className="flex gap-10">
                  <Link
                    to={transaction.id}
                    className={`w-full justify-between flex font-medium px-8 py-4 rounded-md hover:bg-[#d9f9e3] hover:text-[#01b741] `}
                  >
                    <span>{transaction.description}</span>
                    <span>
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                    <span>${transaction.amount}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </footer>
        </div>
      </section>
    </div>
  );
};

function DashboardChipItem(props: { label: string; price: number }) {
  return (
    <li className="outline outline-[0.5px] outline-gray-300 rounded-md p-6">
      <header>{props.label}</header>
      <main>{props.price}</main>
      <footer></footer>
    </li>
  );
}
