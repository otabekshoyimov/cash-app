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
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";
import type { Key } from "react-aria-components";
import {
  Button,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  ToggleButton,
  ToggleButtonGroup,
} from "react-aria-components";
import { Link, useFetcher, useLoaderData } from "react-router";

import { runtimeEnv } from "../../../env";
import { pb } from "../../../shared/api/pocketbase";

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
              <button
                className="px-4"
                onClick={() => {
                  setTransactionType("income");
                  dialogRef.current?.showModal();
                }}
              >
                New income
              </button>
              <button
                className="px-4"
                onClick={() => {
                  setTransactionType("expense");
                  dialogRef.current?.showModal();
                }}
              >
                New expense
              </button>
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
      <ChartItem chartSectionRef={chartSectionRef} />
    </div>
  );
};

function DashboardChipItem(props: { currency: string; value: number }) {
  return (
    <li className="outline outline-[0.5px] outline-gray-300 rounded-md px-8">
      <header>{props.currency}</header>
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
const years = [2022, 2023, 2024, 2025];

function ChartItem(props: { chartSectionRef: RefObject<HTMLElement | null> }) {
  const [transactions] = useLoaderData();
  console.log("t", transactions);

  const [currentMonth, setCurrentMonth] = useState(() => {
    const month = new Date().getMonth();
    return monthsNames[month];
  });

  const [currentYear, setCurrentYear] = useState<number>(() => {
    const year = new Date().getFullYear();
    return year;
  });

  const [selectedActiveChartTab, setSelectedActiveChartTab] = useState<
    Set<Key>
  >(new Set(["month"]));

  let chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!props.chartSectionRef) {
      console.error("err");
      return;
    }
    chartRef.current = echarts.init(props.chartSectionRef.current);

    return () => {
      chartRef.current?.dispose();
    };
  }, [props.chartSectionRef]);

  useEffect(() => {
    if (!chartRef.current) {
      console.error("err");
      return;
    }
    if (selectedActiveChartTab.has("month")) {
      const filteredTransactions = filterTransactionsByMonth(
        transactions,
        currentMonth,
        currentYear,
      );
      return chartRef.current.setOption({
        title: {
          text: `${currentMonth} activity graph`,
          textStyle: {
            fontSize: 18,
            fontWeight: "normal",
          },
        },
        tooltip: {},
        xAxis: {
          data: Array.from(
            { length: getDaysInMonth(currentMonth) },
            (_, i: number) => i + 1,
          ),
        },
        yAxis: {},
        series: [
          {
            name: "Income",
            type: "bar",
            data: getIncomeTransactionsByDay(
              filteredTransactions,
              currentMonth,
            ),
            itemStyle: {
              color: "#01b741",
              borderRadius: 6,
            },
          },
          {
            name: "Expense",
            type: "bar",
            data: getExpenseTransactionsByDay(
              filteredTransactions,
              currentMonth,
            ),
            itemStyle: {
              color: "red",
              borderRadius: 6,
            },
          },
        ],
      });
    }
    if (selectedActiveChartTab.has("year")) {
      const filteredTransactions = filterTransactionsByYear(
        transactions,
        currentYear,
      );
      console.log(
        "Income:",
        getIncomeTransactionsByMonth(filteredTransactions),
      );
      console.log(
        "Expense:",
        getExpenseTransactionsByMonth(filteredTransactions),
      );

      return chartRef.current.setOption({
        title: {
          text: `${currentYear} graph`,
          textStyle: {
            fontSize: 18,
            fontWeight: "normal",
          },
        },
        tooltip: {},
        xAxis: {
          data: monthsNames,
        },
        yAxis: {},
        series: [
          {
            name: "Income",
            type: "bar",
            data: getIncomeTransactionsByMonth(filteredTransactions),
            itemStyle: {
              color: "#01b741",
              borderRadius: 6,
            },
          },
          {
            name: "Expense",
            type: "bar",
            data: getExpenseTransactionsByMonth(filteredTransactions),
            itemStyle: {
              color: "red",
              borderRadius: 6,
            },
          },
        ],
      });
    }
  }, [selectedActiveChartTab, currentMonth, currentYear, transactions]);

  return (
    <section>
      <header className="flex gap-8 justify-between text-base pb-8">
        <div className="flex gap-8">
          <ToggleButtonGroup
            selectionMode="single"
            selectedKeys={selectedActiveChartTab}
            className={"bg-white px-4 py-2 rounded-md"}
            onSelectionChange={(key) => {
              setSelectedActiveChartTab(key);
            }}
          >
            <ToggleButton
              id={"month"}
              className={({ isSelected }) =>
                `px-4 border-none rounded-md ${isSelected ? "bg-gray-300 shadow-md" : "bg-white "} `
              }
            >
              Month
            </ToggleButton>
            <ToggleButton
              id={"year"}
              className={({ isSelected }) =>
                `border-none px-4 rounded-md ${isSelected ? "bg-gray-300 shadow-md" : "bg-white"}`
              }
            >
              Year
            </ToggleButton>
          </ToggleButtonGroup>
          <Select
            name="month"
            selectedKey={currentMonth}
            onSelectionChange={(selected) => {
              setCurrentMonth(String(selected));
            }}
          >
            <Button className="flex items-center gap-4 px-4 py-2">
              <SelectValue />
              <span aria-hidden="true">
                <ChevronDown size={16} className="pt-4" />
              </span>
            </Button>
            <Popover>
              <ListBox className={"bg-white px-8 py-4 rounded-md"}>
                {monthsNames.map((month) => (
                  <ListBoxItem id={month} key={month}>
                    {month}
                  </ListBoxItem>
                ))}
              </ListBox>
            </Popover>
          </Select>

          <Select
            name="year"
            selectedKey={currentYear}
            onSelectionChange={(key) => {
              setCurrentYear(Number(key));
            }}
          >
            <Button className="flex items-center gap-4 px-4 py-2">
              <SelectValue />
              <span aria-hidden="true">
                <ChevronDown size={16} className="pt-4" />
              </span>
            </Button>
            <Popover>
              <ListBox className={"bg-white px-8 py-4 rounded-md"}>
                {years.map((year) => (
                  <ListBoxItem id={year} key={year}>
                    {year}
                  </ListBoxItem>
                ))}
              </ListBox>
            </Popover>
          </Select>
        </div>

        <div className="flex gap-8">
          <span className="flex items-center gap-6">
            <div className="w-14 h-14 bg-green-600 rounded-lg"></div>
            income
          </span>
          <span className="flex items-center gap-6">
            <div className="w-14 h-14 bg-red-600 rounded-lg"></div>
            expense
          </span>
        </div>
      </header>
      <main
        ref={props.chartSectionRef}
        className="bg-white rounded-2xl"
        style={{ width: "100%", height: "360px" }}
      ></main>
    </section>
  );
}

function getDaysInMonth(currentMonth: string) {
  const year = new Date().getFullYear();
  const monthName = monthsNames.indexOf(currentMonth);
  const daysInMonth = new Date(year, monthName + 1, 0).getDate();
  return daysInMonth;
}

function getIncomeTransactionsByDay(
  transactions: Transaction[],
  currentMonth: string,
) {
  let daysInMonth = Array.from(
    { length: getDaysInMonth(currentMonth) },
    () => 0,
  );
  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      const day = new Date(transaction.date).getDate();
      daysInMonth[day - 1] = daysInMonth[day - 1] + transaction.amount;
    }
  });
  return daysInMonth;
}
function getExpenseTransactionsByDay(
  transactions: Transaction[],
  currentMonth: string,
) {
  let daysInMonth = Array.from(
    { length: getDaysInMonth(currentMonth) },
    () => 0,
  );
  transactions.forEach((transaction) => {
    if (transaction.type === "expense") {
      const day = new Date(transaction.date).getDate();
      daysInMonth[day - 1] = daysInMonth[day - 1] + transaction.amount;
    }
  });
  return daysInMonth;
}
function getIncomeTransactionsByMonth(filteredTransactions: Transaction[]) {
  let months = Array.from({ length: 12 }, () => 0);
  filteredTransactions.forEach((transaction) => {
    if (transaction.type === "income") {
      const month = new Date(transaction.date).getMonth();
      months[month] = months[month] + transaction.amount;
    }
  });
  return months;
}

function getExpenseTransactionsByMonth(filteredTransactions: Transaction[]) {
  let months = Array.from({ length: 12 }, () => 0);
  filteredTransactions.forEach((transaction) => {
    if (transaction.type === "expense") {
      const month = new Date(transaction.date).getMonth();
      months[month] = months[month] + transaction.amount;
    }
  });

  return months;
}
function filterTransactionsByMonth(
  transactions: Transaction[],
  currentMonth: string,
  currentYear: number,
) {
  return transactions.filter((transaction) => {
    const date = new Date(transaction.date);
    const monthIndex = date.getMonth();
    const monthName = monthsNames[monthIndex];
    const year = date.getFullYear();
    return monthName === currentMonth && year === currentYear;
  });
}
function filterTransactionsByYear(
  transactions: Transaction[],
  currentYear: number,
) {
  return transactions.filter((transaction) => {
    const year = new Date(transaction.date).getFullYear();
    return year === currentYear;
  });
}
