import { useLoaderData } from "react-router";
import type { Transaction } from "../../index/ui";
import { pb } from "../../../shared/api/pocketbase";

export async function CashPageLoader() {
  const transactions = await pb.collection("transactions").getFullList();
  return transactions;
}

export function CashPage() {
  return (
    <div className="flex h-full flex-1 flex-col gap-8 bg-[#f4f4f4] px-8">
      <CashBalance />
      <div className="flex justify-between gap-8">
        <AccountDetails />
        <MoreWaysToAddMoney />
      </div>
    </div>
  );
}

function CashBalance() {
  const transactions = useLoaderData();
  const totalAmount = getTotalTransactionAmount(transactions);

  return (
    <section className="rounded-lg bg-white p-8 pt-16 shadow-sm outline outline-1 outline-black/10">
      <header className="flex flex-col items-center justify-center">
        <span>Cash balance</span>
      </header>
      <main className="flex justify-center pb-16">
        <span className="text-4xl">${totalAmount}</span>
      </main>
      <footer className="flex justify-center gap-16 pb-16">
        <ActionButton label="Add cash" />
        <ActionButton label="Cash out" />
      </footer>
    </section>
  );
}

function AccountDetails() {
  return (
    <section className="w-full rounded-lg bg-white px-16 py-16 shadow-sm outline outline-1 outline-black/10">
      <header className="pb-8 font-medium">Account details</header>
      <main className="flex flex-col gap-16 pr-[54px]">
        <div className="flex flex-col">
          <span className="text-xs">ROUTING</span>
          <span>123 456 789</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs">ACCOUNT</span>
          <div className="flex gap-24">
            <span>*** *** 8910</span>

            <ActionButton label="Show" />
          </div>
        </div>
      </main>
    </section>
  );
}

function MoreWaysToAddMoney() {
  return (
    <section className="w-full rounded-lg bg-white px-16 py-16 shadow-sm">
      <header className="pb-8 font-medium">More ways to add money</header>
      <main className="flex flex-col gap-16 pr-[54px]">
        <div>
          <span>Set up direct deposit</span>
        </div>
        <div>
          <span>Recurring deposits</span>
        </div>
      </main>
    </section>
  );
}

export function ActionButton(props: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={props.onClick}
      className="outline-solid rounded-2xl bg-primary-green px-16 py-4 shadow outline-zinc-300/10"
    >
      {props.label}
    </button>
  );
}

export function getTotalTransactionAmount(transactions: Transaction[]) {
  let total = 0;
  for (const transaction of transactions) {
    if (transaction.type === "income") {
      total = total + transaction.amount;
    }
  }
  return total;
}
