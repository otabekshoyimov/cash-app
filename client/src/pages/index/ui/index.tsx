import { XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { data, useFetcher, useLoaderData } from "react-router";
import { runtimeEnv } from "../../../env";
import { pb } from "../../../shared/api/pocketbase";
import { DashboardBarChart } from "../../../widgets/dashboard-chart/ui/dashboard-chart";
import { ActionButton } from "../../cash/ui/cash-page";
import z from "zod";

export type Rate = {
  amount: number;
  base: string;
  rates: {
    [currenCode: string]: number;
  };
};

export type Transaction = {
  id: string;
  type: string;
  date: string;
  description: string;
  amount: number;
};

export async function indexLoader(): Promise<{
  transactions: Transaction[];
  rates: Rate;
}> {
  const transactions = await pb
    .collection("transactions")
    .getFullList<Transaction>();
  const BASE_URL = runtimeEnv.BACKEND_URL;
  const res = await fetch(`${BASE_URL}/rates`);
  const rates: Rate = await res.json();
  return { transactions, rates };
}

const TransactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
});

function validateFormInput(formData: FormData) {
  const result = TransactionSchema.safeParse({
    type: formData.get("type"),
    description: formData.get("description"),
    amount: formData.get("amount"),
  });

  return result;
}

export async function indexAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const result = validateFormInput(formData);

  if (!result.success) {
    const errors: Record<string, string> = {};
    console.log(result.error.issues);
    result.error.issues.forEach((issue) => {
      const field = issue.path[0];
      if (field && typeof field === "string") {
        errors[field] = issue.message;
      }
    });
    return data({ errors }, { status: 400 });
  }

  const newTransaction = {
    date: new Date(),
    type: result.data.type,
    description: result.data.description,
    amount: result.data.amount,
  };
  const transactionRecord = await pb
    .collection("transactions")
    .create(newTransaction);
  return transactionRecord;
}

export type IndexLoaderData = Awaited<ReturnType<typeof indexLoader>>;

export const Dashboard = () => {
  const { transactions, rates } = useLoaderData<IndexLoaderData>();
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "income",
  );
  const fetcher = useFetcher();
  let errors = fetcher.data?.errors;
  console.log("err", errors);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const chartSectionRef = useRef<HTMLElement>(null);
  const transactionTypeInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="pl-8 flex-1 bg-[#f4f4f4] h-full flex flex-col gap-8">
      <section className="bg-white px-16 py-16 rounded-2xl outline outline-1 outline-black/10">
        <main>
          <ul className="flex gap-10">
            {Object.entries(rates.rates).map(([key, value]) => (
              <DashboardChipItem key={key} currency={key} value={value} />
            ))}
          </ul>
        </main>
      </section>
      <section className="bg-white px-16 py-16 rounded-2xl h-full outline outline-1 outline-black/10">
        <div>
          <header className="flex gap-10 justify-between pb-10">
            <div>Search</div>
            <div className="flex gap-10">
              <ActionButton
                label="New income"
                onClick={() => {
                  setTransactionType("income");
                  dialogRef.current?.showModal();
                  descriptionInputRef.current?.focus();
                }}
              ></ActionButton>
              <ActionButton
                label="New expense"
                onClick={() => {
                  setTransactionType("expense");
                  dialogRef.current?.showModal();
                  descriptionInputRef.current?.focus();
                }}
              ></ActionButton>
            </div>
          </header>
          <main className="outline outline-[0.5px] outline-gray-200 flex justify-between">
            <div className="flex gap-10">
              <dialog ref={dialogRef} className="pb-10 rounded-2xl">
                <fetcher.Form className="flex flex-col" method="POST">
                  <section className="px-16 pt-8">
                    <header className="flex justify-between">
                      <span className=" text-gray-400 ">
                        Create a new income transaction
                      </span>
                      <button
                        type="button"
                        className="px-8 py-4 rounded-2xl bg-[#f4f4f4] font-medium shadow-sm outline outline-1 outline-black/10 "
                        onClick={() => dialogRef.current?.close()}
                      >
                        <XIcon size={16} />
                      </button>
                    </header>
                    <main className="pb-10 flex flex-col gap-8 ">
                      <div className="flex gap-8">
                        <label className="text-zinc-600">Description</label>
                        {errors?.description && (
                          <span className="text-red-600 ">
                            {errors.description}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        name="description"
                        ref={descriptionInputRef}
                        placeholder="Description"
                        className="px-8 rounded-lg py-2 text-base border-none outline-solid outline-zinc-300/10 shadow"
                      />
                      <div className="flex gap-8">
                        <label>Amount</label>
                        {errors?.amount && (
                          <span className="text-red-600 ">{errors.amount}</span>
                        )}
                      </div>

                      <input
                        type="number"
                        name="amount"
                        placeholder="$0"
                        className="px-8 py-2 rounded-lg text-base border-none outline-solid outline-zinc-300/10 shadow"
                      />

                      <input
                        ref={transactionTypeInputRef}
                        type="hidden"
                        name="type"
                        value={transactionType}
                      />
                    </main>
                    <footer className="flex justify-end gap-10">
                      <button
                        type="submit"
                        className="px-16 py-4 rounded-2xl bg-[#f4f4f4] font-medium shadow-sm outline outline-1 outline-black/10 "
                      >
                        {fetcher.state != "idle" ? "creating" : "create"}
                      </button>
                    </footer>
                  </section>
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
            <div className="grid grid-rows-[1fr_1fr_1fr] gap-4  ">
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </div>
          </footer>
        </div>
      </section>
      <DashboardBarChart chartSectionRef={chartSectionRef} />
    </div>
  );
};

function DashboardChipItem(props: { currency: string; value: number }) {
  return (
    <li className="outline outline-[0.5px] outline-gray-300 rounded-xl p-8">
      <header className="text-center text-sm">{props.currency}</header>
      <main className="text-2xl ">
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
    <section className="bg-white rounded-md  gap-8  flex justify-between">
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
