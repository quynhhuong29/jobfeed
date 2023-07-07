import { LayoutMain } from "@/components/layout";
import withAuth from "@/hocs/withAuth";

function Dashboard() {
  return (
    <LayoutMain>
      <section className="w-full bg-[url('/assets/images/page-title.png')] bg-cover bg-[#029663] bg-center border-radius-custom relative pt-14 pb-16">
        <div className="md:max-w-[1140px] mx-auto flex items-center justify-between text-white">
          <div className="mx-auto pr-20">
            <h3 className="text-2xl font-medium">Dashboard</h3>
          </div>
        </div>
      </section>
    </LayoutMain>
  );
}

export default withAuth(Dashboard);
