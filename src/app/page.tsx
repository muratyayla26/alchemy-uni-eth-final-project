import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-10 flex flex-col items-center justify-start space-y-12">
      <div className="absolute flex top-5 px-10 justify-between w-full items-center">
        <div className="text-2xl font-bold text-white">Ether Lock Box</div>
        <Link href="/dashboard">
          <Button>Escrow Page</Button>
        </Link>
      </div>
      <h1 className="text-4xl text-white font-bold tracking-tight text-center !mt-32 mb-8">
        Welcome to our secure ETH Escrow Platform – where you control your
        deposits and transactions with ease!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <PencilLineIcon />
              <h2 className="text-2xl font-bold text-gray-800">
                Flexible Deposits
              </h2>
            </div>
            <p className="text-gray-600">
              Deposit ETH for chosen periods, withdraw anytime before the
              deadline.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <LockIcon />
              <h2 className="text-2xl font-bold text-gray-800">
                Locked-in Security
              </h2>
            </div>
            <p className="text-gray-600">
              Time-lock your ETH deposits; receiver access after the deadline.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <ShieldIcon />
              <h2 className="text-2xl font-bold text-gray-800">
                Secure Escrow
              </h2>
            </div>
            <p className="text-gray-600">
              Trust our smart contract for safe ETH holding till the deadline.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
function PencilLineIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8 text-blue-500"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      <path d="m15 5 3 3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8 text-blue-500"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8 text-blue-500"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

