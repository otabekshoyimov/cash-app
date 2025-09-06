import { useLoaderData } from "react-router";
import * as echarts from "echarts";
import { pb } from "../../shared/api/pocketbase";
import { ActionButton, getTotalTransactionAmount } from "../cash/ui/cash-page";
import { useEffect, useRef } from "react";
import type { Transaction } from "../index/ui";

export async function SavingsPageLoader() {
  const transactions = await pb.collection("transactions").getFullList();
  return transactions;
}

export function SavingsPage() {
  return (
    <div className="px-[40px] py-[40px] flex-1 bg-[#f4f4f4] h-full flex flex-col gap-16">
      <Savings />
      <div className="flex gap-16">
        <Goal />
        <Transfers />
      </div>
    </div>
  );
}

function Savings() {
  const transactions = useLoaderData();
  const totalAmount = getTotalTransactionAmount(transactions);

  return (
    <>
      <section className="bg-white rounded-lg p-8 pt-16 shadow-sm">
        <header className="flex justify-center flex-col items-center">
          <span>Savings</span>
        </header>
        <main className="flex justify-center pb-16">
          <span className="text-4xl">${totalAmount}</span>
        </main>
        <footer className="flex justify-center pb-16 gap-16">
          <ActionButton label="Transfer in" />
          <ActionButton label="Transfer out" />
        </footer>
      </section>
    </>
  );
}

const gaugeData = [
  {
    value: 50,
    name: "☔️ to Goal",
    title: {
      offsetCenter: ["0%", "10%"],
    },
    detail: {
      valueAnimation: true,
      offsetCenter: ["0%", "-10%"],
    },
  },
];

function Goal() {
  const ringChartRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ringChartRef) {
      console.error("err");
      return;
    }
    const ringChartDom = ringChartRef.current;
    const ringChart = echarts.init(ringChartDom);

    ringChart.setOption({
      series: [
        {
          type: "gauge",
          startAngle: 90,
          endAngle: -270,
          pointer: {
            show: false,
          },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              color: "#01b741",
            },
          },
          axisLine: {
            lineStyle: {
              width: 40,
            },
          },
          splitLine: {
            show: false,
            distance: 0,
            length: 10,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
            distance: 50,
          },
          data: gaugeData,
          title: {
            fontSize: 14,
          },
          detail: {
            width: 50,
            height: 14,
            fontSize: 16,
            color: "black",
            formatter: "${value}",
          },
        },
      ],
    });
  }, [ringChartRef]);
  return (
    <section className="bg-white rounded-lg py-16 px-16 shadow-sm">
      <header className="font-medium">Goal</header>
      <main
        ref={ringChartRef}
        style={{ width: "360px", height: "360px" }}
      ></main>
    </section>
  );
}

function Transfers() {
  const transaction = useLoaderData();
  return (
    <section className="bg-white rounded-lg py-16 px-16 w-full shadow-sm">
      <header className="font-medium pb-8">Transfers</header>
      <main>
        {transaction.map((transaction: Transaction) => (
          <li
            key={transaction.id}
            className="flex items-center gap-16 justify-between"
          >
            <div className="flex flex-col">
              <span>{transaction.description}</span>
              <span className="text-gray-400">
                {new Date(transaction.date).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span>${transaction.amount}</span>
            </div>
          </li>
        ))}
      </main>
    </section>
  );
}
