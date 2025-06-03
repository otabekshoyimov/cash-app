export function App() {
  return (
    <>
      <section className="px-5 pt-5">
        <Dashboard />
      </section>
    </>
  );
}
const Dashboard = () => {
  return (
    <>
      <DashboardHeader />
      <DashboardOverview />
      <DashboardHistoy />
    </>
  );
};

const DashboardHeader = () => {
  return (
    <>
      <section>
        <header>dash header</header>
        <main className="outline outline-1">dash header content</main>
      </section>
    </>
  );
};

const DashboardOverview = () => {
  return (
    <>
      <section>
        <header>dash overview</header>
        <main className="outline outline-1">dash overview content</main>
      </section>
    </>
  );
};

const DashboardHistoy = () => {
  return (
    <section>
      <header>dash history</header>
      <main className="outline outline-1">dash history content</main>
    </section>
  );
};
