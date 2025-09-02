import { useEffect, useRef, useState, type RefObject } from "react";
import { Link, useFetcher, useLoaderData } from "react-router";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { SVGRenderer } from "echarts/renderers";
import { pb } from "./main";

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
  return transactions;
}

export type Transaction = {
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

  const newTransaction = {
    date: new Date(),
    description: description,
    amount: Number(amount),
  };
  const transactionRecord = await pb
    .collection("transactions")
    .create(newTransaction);
  return transactionRecord;
}

export const Dashboard = () => {
  const transactions = useLoaderData();
  console.log("transactions", transactions);
  const fetcher = useFetcher();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const chartSectionRef = useRef<HTMLElement>(null);

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

            {/* <div> {JSON.stringify(transactions) }</div> */}
            {transactions.map((transaction: Transaction) => (
              <Link to={transaction.id} key={transaction.id}>
                <TransactionItem transaction={transaction} />
              </Link>
              // <li key={transaction.id} className="flex gap-10">
              //   <Link
              //     to={transaction.id}
              //     className={`w-full justify-between flex font-medium px-8 py-4 rounded-md hover:bg-[#d9f9e3] hover:text-[#01b741] `}
              //   >
              //     <span>{transaction.description}</span>
              //     <span className="text-[#6e6e6e]">
              //       {new Date(transaction.date).toLocaleDateString()}
              //     </span>
              //     <span>${transaction.amount}</span>
              //   </Link>
              // </li>
            ))}
          </footer>
        </div>
      </section>
      <ChartItem chartSectionRef={chartSectionRef} />
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

export function TransactionItem(props: { transaction: Transaction }) {
  return (
    <section className="bg-white rounded-md  gap-10 font-medium flex justify-between">
      <span>{props.transaction.description}</span>
      <span className="text-[#6e6e6e]">
        {new Date(props.transaction.date).toLocaleDateString()}
      </span>
      <span>${props.transaction.amount}</span>
    </section>
  );
}

function ChartItem(props: { chartSectionRef: RefObject<HTMLElement | null> }) {
  const transactions = useLoaderData() as Transaction[];

  const monthsNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [currentMonth, setCurrentMonth] = useState(() => {
    const month = new Date().getMonth();
    return monthsNames[month];
  });
  console.log(currentMonth);

  const [currentYear, setCurrentYear] = useState(() => {
    const year = new Date().getFullYear();
    return year;
  });

  function getDaysInMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return daysInMonth;
  }

  const amountsByDay = Array.from({ length: getDaysInMonth() }, () => 0);
  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const day = date.getDate();
    amountsByDay[day - 1] = amountsByDay[day - 1] + transaction.amount;
  });
  useEffect(() => {
    if (!props.chartSectionRef) {
      console.error("err");
      return;
    }
    const myChart = echarts.init(props.chartSectionRef.current);

    myChart.setOption({
      title: {
        text: "",
      },
      tooltip: {},
      xAxis: {
        data: Array.from({ length: getDaysInMonth() }, (_, i: number) => i + 1),
      },
      yAxis: {},
      series: [
        {
          name: "transactions",
          type: "bar",
          data: amountsByDay,
        },
      ],
    });
    return () => {
      myChart.dispose();
    };
  }, [props.chartSectionRef]);

  return (
    <section>
      <header className="flex gap-8">
        <div className="flex gap-8">
          <form action="" className="flex">
            <input type="text" value={"month"} />
            <input type="text" value={"year"} />
          </form>
          <form action="" className="flex">
            <input type="text" value={currentMonth} />
            <input type="text" value={currentYear} />
          </form>
        </div>

        <div className="flex gap-8">
          <span>income</span>
          <span>expense</span>
        </div>
      </header>
      <main
        ref={props.chartSectionRef}
        style={{ width: "600px", height: "400px" }}
      ></main>
    </section>
  );
}
