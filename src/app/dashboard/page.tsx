"use client";
import { Button } from "@/components/ui/button";
import { CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
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
import { ethers } from "ethers";
import { timeLockContractAddress } from "@/lib/utils";
import TimeLockContract from "@/lib/contracts/TimeLockEscrow.sol/TimeLockEscrow.json";
import { useToast } from "@/components/ui/use-toast";

const provider = new ethers.BrowserProvider(window.ethereum);

export default function Dashboard() {
  const { toast } = useToast();
  const { signer } = useMainContext();
  const [network, setNetwork] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [lockTime, setLockTime] = useState("");
  const [txnProcessing, setTxnProcessing] = useState(false);
  const [txnData, setTxnData] = useState({ hash: "" });

  const handleStartTxn = async () => {
    try {
      setTxnProcessing(true);
      const deployedContract = await new ethers.Contract(
        timeLockContractAddress,
        TimeLockContract.abi,
        signer
      );

      let ensResolved: string | null = "";
      if (recipient.trim() && recipient.slice(0, 2) !== "0x") {
        ensResolved = await provider.resolveName(recipient);
        if (!ensResolved) {
          toast({
            variant: "destructive",
            title: "There is no valid address for provided ENS Domain.",
          });
          return;
        }
      }
      const lockTimestamp = Math.trunc(Number(lockTime) * 24 * 60 * 60);
      const createDeposit = await deployedContract.createDeposit(
        ensResolved || recipient,
        lockTimestamp,
        {
          value: ethers.parseEther(amount),
        }
      );
      const data = await createDeposit.wait();
      setTxnData(data);

      toast({
        title: "Successful",
        action: (
          <div className="w-full flex items-center">
            <CheckIcon className="mr-2 w-10 h-10 text-green-900" />
            <span className="first-letter:capitalize">
              Transaction created successfully.
            </span>
          </div>
        ),
      });
    } catch (e) {
      console.log(e);
      toast({
        variant: "destructive",
        title: !window.ethereum
          ? "You must have a compatible wallet extension installed in your browser."
          : "Something went wrong.",
      });
    } finally {
      setTxnProcessing(false);
    }
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
              <Label htmlFor="Recipient">Recipient address or ENS Domain</Label>
              <Input
                id="Recipient"
                placeholder="Recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="Amount">Amount {coinSymbol}</Label>
              <Input
                id="Amount"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="TimeLock">Time Lock (Day)</Label>
              <Input
                id="TimeLock"
                placeholder="Time Lock"
                value={lockTime}
                onChange={(e) => setLockTime(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2">
          <Button onClick={handleStartTxn} disabled={txnProcessing}>
            {txnProcessing ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Start Transaction
          </Button>
          {!txnProcessing && txnData?.hash ? (
            <div>Transaction hash: {txnData?.hash}</div>
          ) : null}
        </CardFooter>
      </Card>
    </main>
  );
}
