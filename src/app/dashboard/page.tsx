"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useMainContext } from "../Context";

export default function Dashboard() {
  const { signer } = useMainContext();
  console.log("signer from card", signer);

  const [network, setNetwork] = useState("");

  const handleStartTxn = () => {
    console.log("handleStartTxn");
  };

  const handleNetworkChange = (e: string) => {
    console.log(e);
    setNetwork(e);
  };

  const coinSymbol =
    network === "ETH_SEPOLIA" ? "(ETH)" : network === "POLYGON" ? "(MTC)" : "";

  return (
    <main className="flex min-h-screen p-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Lock New Coin</CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-3.5">
            <Select onValueChange={handleNetworkChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ETH_SEPOLIA">ETH (Sepolia)</SelectItem>
                <SelectItem value="POLYGON">POLYGON</SelectItem>
              </SelectContent>
            </Select>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="Recipient">Recipient</Label>
              <Input id="Recipient" placeholder="Recipient" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="Amount">Amount {coinSymbol}</Label>
              <Input id="Amount" placeholder="Amount" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="TimeLock">Time Lock (Day)</Label>
              <Input id="TimeLock" placeholder="Time Lock" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleStartTxn}>Start Transaction</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
