import { useLoaderData, type Params } from "react-router";
import type { transaction } from "../../..";

export async function TransactionItemLoader({ params }: { params: Params }) {
  const param = params.transactionId;
  const transactions = JSON.parse(localStorage.getItem("transactions") ?? "[]");
  const transaction_record = transactions.filter((transaction: transaction) => {
    return transaction.id === param;
  });
  return transaction_record;
}

export function TransactionItem() {
  const transaction_async = useLoaderData();

  return (
    <section className="bg-[#f4f4f4] px-16 pt-[32px] w-full">
      {transaction_async.map((transaction: transaction) => (
        <div
          key={transaction.id}
          className="bg-white px-16 rounded-md flex gap-10"
        >
          <span>{transaction.description}</span>
          <span>{transaction.amount}</span>
        </div>
      ))}
    </section>
  );
}
