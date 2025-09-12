export function CardPage() {
  return (
    <div className="flex h-full flex-1 flex-col gap-8 bg-[#f4f4f4] px-8">
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
    <section className="rounded-lg bg-white">
      <header></header>
      <main className="flex justify-center py-16">
        <div className="h-[220px] w-[320px] rounded-2xl bg-gray-300"></div>
      </main>
    </section>
  );
}

function Security() {
  return (
    <section className="w-full rounded-lg bg-white px-16 py-16">
      <header className="pb-8 font-medium">Security</header>
      <main className="flex flex-col gap-16">
        <span>Lock card</span>
        <span>Change PIN</span>
      </main>
    </section>
  );
}

function ReplaceCard() {
  return (
    <section className="w-full rounded-lg bg-white px-16 py-16">
      <header className="pb-8 font-medium">Security</header>
      <main className="flex flex-col gap-16">
        <span>Design a new card</span>
        <span>Order a replacement card</span>
      </main>
    </section>
  );
}
