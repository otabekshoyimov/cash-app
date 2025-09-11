export function CardPage() {
  return (
    <div className="px-8 flex-1 bg-[#f4f4f4] h-full flex flex-col gap-8">
      <CardDetails />
      <div className="flex gap-8">
        <Security />
        <ReplaceCard />
      </div>
    </div>
  );
}

function CardDetails() {
  return (
    <section className="bg-white rounded-lg ">
      <header></header>
      <main className="flex justify-center py-16">
        <div className="rounded-2xl bg-gray-300 w-[320px] h-[220px]"></div>
      </main>
    </section>
  );
}

function Security() {
  return (
    <section className="bg-white rounded-lg w-full px-16 py-16">
      <header className="font-medium pb-8">Security</header>
      <main className="flex flex-col gap-16">
        <span>Lock card</span>
        <span>Change PIN</span>
      </main>
    </section>
  );
}

function ReplaceCard() {
  return (
    <section className="bg-white rounded-lg w-full px-16 py-16">
      <header className="font-medium pb-8">Security</header>
      <main className="flex flex-col gap-16">
        <span>Design a new card</span>
        <span>Order a replacement card</span>
      </main>
    </section>
  );
}
