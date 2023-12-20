import LockNewDeposit from "@/components/Dashboard/LockNewDeposit";
import QueryExistingDeposit from "@/components/Dashboard/QueryExistingDeposit";

export default function Dashboard() {
  return (
    <main className="flex min-h-screen p-12 gap-10">
      <LockNewDeposit />
      <QueryExistingDeposit />
    </main>
  );
}
