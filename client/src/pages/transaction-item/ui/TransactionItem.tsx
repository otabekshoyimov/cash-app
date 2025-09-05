import { useLoaderData, type Params } from "react-router";
import { TransactionItem, type Transaction } from "../../index/ui";
import { pb } from "../../../main";

export async function TransactionItemLoader({ params }: { params: Params }) {
  const param = params.transactionId;
  console.log("param", param);
  if (!param) {
    console.error("err");
    return;
  }
  const transaction = await pb.collection("transactions").getOne(param);
  return transaction;
}

export function TransactionItemPage() {
  const transaction = useLoaderData() as Transaction;

  return (
    <section className="bg-[#f4f4f4] px-16 pt-[32px] w-full">
      <header className="pb-6">Transaction details</header>
      <div className="bg-white rounded-md px-16">
        <TransactionItem transaction={transaction} />
      </div>
    </section>
  );
}
