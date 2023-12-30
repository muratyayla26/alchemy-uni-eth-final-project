"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import Image from "next/image";
import LockNewDeposit from "@/components/Dashboard/LockNewDeposit";
import QueryExistingDeposit from "@/components/Dashboard/QueryExistingDeposit";
import ConnectWallet from "@/components/Layout/ConnectWallet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useETH from "@/lib/useETH";

export default function Dashboard() {
  const { toast } = useToast();
  const [windowETH] = useETH();
  const [network, setNetwork] = useState("ETH_SEPOLIA");

  const handleNetworkChange = async (e: string) => {
    try {
      if (e === "POLYGON") {
        await windowETH?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x5A2" }],
        });
      } else {
        await windowETH?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }],
        });
      }
      setNetwork(e);
    } catch (err: any) {
      console.log(err);
      toast({
        variant: "destructive",
        title: !windowETH
          ? "You must have a compatible wallet extension installed in your browser."
          : "Something went wrong.",
      });
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 h-20  px-10 bg-gradient-to-r from-blue-500 to-purple-600 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          Ether Lock Box
        </Link>
        <ConnectWallet />
      </div>
      <main className="flex flex-col p-10 gap-10">
        <div className="w-80">
          <Select onValueChange={handleNetworkChange} value={network}>
            <SelectTrigger>
              <SelectValue placeholder="Select a network" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ETH_SEPOLIA">
                <div className="flex items-center justify-start">
                  <Image
                    width={0}
                    height={0}
                    alt="Ethereum logo"
                    src="/eth_logo.svg"
                    className="w-3 h-auto mr-2"
                  />
                  <p>Ethereum (Sepolia)</p>
                </div>
              </SelectItem>
              <SelectItem value="POLYGON">
                <div className="flex items-center justify-start">
                  <Image
                    width={0}
                    height={0}
                    alt="Polygon logo"
                    src="/polygon_logo.svg"
                    className="w-4 h-auto mr-2"
                  />
                  <p>Polygon zkEVM (Testnet)</p>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-10">
          <LockNewDeposit />
          <QueryExistingDeposit />
        </div>
      </main>
    </>
  );
}

