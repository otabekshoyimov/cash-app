import { useLoaderData } from "react-router";
import type { Transaction } from "../../index/ui";
import { pb } from "../../../shared/api/pocketbase";

export async function CashPageLoader() {
  const transactions = await pb.collection("transactions").getFullList();
  return transactions;
}

export function CashPage() {
  return (
    <div className="px-[40px] py-[40px] flex-1 bg-[#f4f4f4] h-full flex flex-col gap-16">
      <CashBalance />
      <div className="flex gap-16 justify-between">
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
    <section className="bg-white rounded-lg p-8 pt-16 shadow-sm">
      <header className="flex justify-center flex-col items-center">
        <span>Cash balance</span>
      </header>
      <main className="flex justify-center pb-16">
        <span className="text-4xl">${totalAmount}</span>
      </main>
      <footer className="flex justify-center pb-16 gap-16">
        <ActionButton label="Add cash" />
        <ActionButton label="Cash out" />
      </footer>
    </section>
  );
}

function AccountDetails() {
  return (
    <section className="bg-white rounded-lg py-16 w-full px-16 shadow-sm">
      <header className="font-medium pb-8">Account details</header>
      <main className="flex  flex-col gap-16 pr-[54px]">
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
    <section className="bg-white rounded-lg py-16 w-full px-16 shadow-sm">
      <header className="font-medium pb-8">More ways to add money</header>
      <main className="flex gap-16 flex-col pr-[54px]">
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
      className="px-16 py-4 rounded-2xl bg-[#f4f4f4] font-medium shadow-sm"
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
