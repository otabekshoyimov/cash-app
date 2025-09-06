import { BarChart } from "echarts/charts";
import {
  DatasetComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { SVGRenderer } from "echarts/renderers";
import { useRef, useState } from "react";
import { Link, useFetcher, useLoaderData } from "react-router";

import { runtimeEnv } from "../../../env";
import { pb } from "../../../shared/api/pocketbase";
import { DashboardBarChart } from "../../../widgets/dashboard-chart/dashboard-chart";
import { ActionButton } from "../../cash/ui/cash-page";

echarts.use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  SVGRenderer,
]);

export async function indexLoader() {
  const transactions = await pb.collection("transactions").getFullList();
  const BASE_URL = runtimeEnv.BACKEND_URL;
  const res = await fetch(`${BASE_URL}/rates`);
  const rates = await res.json();
  return [transactions, rates];
}

export type Transaction = {
  id: string;
  type: string;
  date: string;
  description: string;
  amount: number;
};
export async function indexAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const type = formData.get("type");
  const description = formData.get("description");
  const amount = formData.get("amount");

  const newTransaction = {
    date: new Date(),
    type: type,
    description: description,
    amount: Number(amount),
  };
  const transactionRecord = await pb
    .collection("transactions")
    .create(newTransaction);
  console.log("t record", transactionRecord);
  return transactionRecord;
}

type RateResponse = {
  amount: number;
  base: string;
  rates: Record<string, number>;
};

type LoaderData = [Transaction[], RateResponse];

export const Dashboard = () => {
  const [transactions, rates] = useLoaderData() as LoaderData;
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "income",
  );
  const fetcher = useFetcher();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const chartSectionRef = useRef<HTMLElement>(null);
  const transactionTypeInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="px-[40px] py-[40px] flex-1 bg-[#f4f4f4] h-full flex flex-col gap-16">
      <section className="bg-white px-16 py-16 rounded-2xl">
        <main>
          <ul className="flex gap-10">
            {Object.entries(rates.rates).map(([key, value]) => (
              <DashboardChipItem key={key} currency={key} value={value} />
            ))}
          </ul>
        </main>
      </section>
      <section className="bg-white px-16 py-16 rounded-2xl h-full">
        <div>
          <header className="flex gap-10 justify-between pb-10">
            <div>Search</div>
            <div className="flex gap-10">
              <ActionButton
                label="New income"
                onClick={() => {
                  setTransactionType("income");
                  dialogRef.current?.showModal();
                }}
              ></ActionButton>
              <ActionButton
                label="New expense"
                onClick={() => {
                  setTransactionType("expense");
                  dialogRef.current?.showModal();
                }}
              ></ActionButton>
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

                      <input
                        ref={transactionTypeInputRef}
                        type="hidden"
                        name="type"
                        value={transactionType}
                      />
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
            {transactions.map((transaction: Transaction) => (
              <Link to={transaction.id} key={transaction.id}>
                <TransactionItem transaction={transaction} />
              </Link>
            ))}
          </footer>
        </div>
      </section>
      <DashboardBarChart chartSectionRef={chartSectionRef} />
    </div>
  );
};

function DashboardChipItem(props: { currency: string; value: number }) {
  return (
    <li className="outline outline-[0.5px] outline-gray-300 rounded-lg px-8">
      <header className="text-center text-sm">{props.currency}</header>
      <main className="text-2xl font-medium">
        {props.currency === "USD" && <span>$</span>}
        {props.currency === "EUR" && <span>€</span>}

        {props.value.toFixed(2)}
      </main>
      <footer></footer>
    </li>
  );
}

export function TransactionItem(props: { transaction: Transaction }) {
  return (
    <section className="bg-white rounded-md  gap-10 font-medium flex justify-between">
      <span>{props.transaction.description}</span>
      <span className="text-[#6e6e6e]">
        {new Date(props.transaction.date).toLocaleDateString()}
      </span>
      <span
        className={`${props.transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
      >
        ${props.transaction.amount}
      </span>
    </section>
  );
}
