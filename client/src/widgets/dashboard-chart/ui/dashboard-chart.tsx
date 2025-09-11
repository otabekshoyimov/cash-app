import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";
import * as echarts from "echarts/core";
import {
  Button,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  ToggleButton,
  ToggleButtonGroup,
  type Key,
} from "react-aria-components";
import { useLoaderData } from "react-router";
import type { IndexLoaderData, Transaction } from "../../../pages/index/ui";
import { BarChart } from "echarts/charts";
import {
  DatasetComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
} from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { SVGRenderer } from "echarts/renderers";

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

export function DashboardBarChart(props: {
  chartSectionRef: RefObject<HTMLElement | null>;
}) {
  const { transactions } = useLoaderData<IndexLoaderData>();

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
          left: 0,
          textStyle: {
            fontSize: 18,
            fontWeight: "normal",
          },
          padding: [0, 0, 0, 16],
        },
        grid: {
          left: 50,
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
        grid: {
          left: 50,
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
    <section className="pb-8">
      <header className="flex flex-wrap gap-8 justify-between text-base py-8 px-8 ">
        <div className="flex gap-8">
          <ToggleButtonGroup
            selectionMode="single"
            selectedKeys={selectedActiveChartTab}
            className={"bg-white items-center flex px-8 rounded-2xl"}
            onSelectionChange={(key) => {
              setSelectedActiveChartTab(key);
            }}
          >
            <ToggleButton
              id={"month"}
              className={({ isSelected }) =>
                `py-1  border-none px-16 rounded-2xl ${isSelected ? "bg-gray-300 shadow" : "bg-white "} `
              }
            >
              Month
            </ToggleButton>
            <ToggleButton
              id={"year"}
              className={({ isSelected }) =>
                `border-none  px-16 rounded-2xl  ${isSelected ? "bg-gray-300 shadow" : "bg-white"}`
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
            <Button className="flex items-center gap-4 py-4 rounded-2xl px-16 bg-white">
              <SelectValue />
              <span aria-hidden="true">
                <ChevronDown size={16} className="pt-4" />
              </span>
            </Button>
            <Popover>
              <ListBox className={"bg-green-400 px-16 py-4 rounded-2xl"}>
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
            <Button className="flex items-center gap-4  py-4 rounded-2xl px-16 bg-white">
              <SelectValue />
              <span aria-hidden="true">
                <ChevronDown size={16} className="pt-4" />
              </span>
            </Button>
            <Popover>
              <ListBox className={"bg-green-400 px-16 py-4 rounded-md"}>
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
          <span className="flex items-center gap-6 font-normal">
            <div className="w-14 h-14 bg-green-600 rounded-lg"></div>
            Income
          </span>
          <span className="flex items-center gap-6">
            <div className="w-14 h-14 bg-red-600 rounded-lg"></div>
            Expense
          </span>
        </div>
      </header>
      <main
        ref={props.chartSectionRef}
        className="bg-white rounded-2xl outline outline-1 outline-black/10"
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
