import { useLoaderData } from "react-router";
import * as echarts from "echarts";
import { pb } from "../../../shared/api/pocketbase";
import {
  ActionButton,
  getTotalTransactionAmount,
} from "../../cash/ui/cash-page";
import { useEffect, useRef } from "react";
import type { Transaction } from "../../index/ui";

export async function SavingsPageLoader() {
  const transactions = await pb.collection("transactions").getFullList();
  return transactions;
}

export function SavingsPage() {
  return (
    <div className="flex h-full flex-1 flex-col gap-8 bg-[#f4f4f4] px-8">
      <Savings />
      <div className="flex gap-8">
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
      <section className="rounded-lg bg-white p-8 pt-16 shadow-sm outline outline-1 outline-black/10">
        <header className="flex flex-col items-center justify-center">
          <span>Savings</span>
        </header>
        <main className="flex justify-center pb-16">
          <span className="text-4xl">${totalAmount}</span>
        </main>
        <footer className="flex justify-center gap-16 pb-16">
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
            fontSize: 20,
            color: "black",
            formatter: "${value}",
          },
        },
      ],
    });
  }, [ringChartRef]);
  return (
    <section className="rounded-lg bg-white px-16 py-16 shadow-sm outline outline-1 outline-black/10">
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
    <section className="w-full rounded-lg bg-white px-16 py-16 shadow-sm outline outline-1 outline-black/10">
      <header className="pb-8 font-medium">Transfers</header>
      <main>
        {transaction.map((transaction: Transaction) => (
          <li
            key={transaction.id}
            className="flex items-center justify-between gap-16"
          >
            <div className="flex flex-col">
              <span>{transaction.description}</span>
              <span className="text-zinc-500">
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
