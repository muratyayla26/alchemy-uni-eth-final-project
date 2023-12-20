"use client";
import { useState } from "react";
import { useMainContext } from "@/app/Context";
import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import { ensResolver } from "@/lib/ensResolver.helper";
import { timeLockContractAddress } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";
import { timestampConvertor } from "@/lib/timestamp.helper";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TimeLockContract from "@/lib/contracts/TimeLockEscrow.sol/TimeLockEscrow.json";

const QueryExistingDeposit = () => {
  const { toast } = useToast();
  const { signer } = useMainContext();
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [queryProcessing, setQueryProcessing] = useState(false);
  const [depositData, setDepositData] = useState<string[]>([]);

  const handleQuery = async () => {
    if (!recipient || !sender) return;

    try {
      setQueryProcessing(true);
      const deployedContract = new ethers.Contract(
        timeLockContractAddress,
        TimeLockContract.abi,
        signer
      );

      const ensResolvedSender = await ensResolver(sender);
      if (!ensResolvedSender) {
        toast({
          variant: "destructive",
          title: "There is no valid address for provided ENS Domain of sender.",
        });
        return;
      }

      const ensResolvedRecipient = await ensResolver(recipient);
      if (!ensResolvedRecipient) {
        toast({
          variant: "destructive",
          title:
            "There is no valid address for provided ENS Domain of recipient.",
        });
        return;
      }

      let existingDeposit = await deployedContract.deposits(
        typeof ensResolvedSender === "string" ? ensResolvedSender : sender,
        typeof ensResolvedRecipient === "string"
          ? ensResolvedRecipient
          : recipient
      );
      if (existingDeposit) {
        existingDeposit = existingDeposit.toString().split(",");
      }

      setDepositData(existingDeposit);
    } catch (e) {
      console.log(e);
      toast({
        variant: "destructive",
        title: !window.ethereum
          ? "You must have a compatible wallet extension installed in your browser."
          : "Something went wrong.",
      });
    } finally {
      setQueryProcessing(false);
    }
  };

  const depositInvalidOrEmpty = () => {
    return (
      depositData.length < 4 ||
      (depositData[2] === "0" && depositData[3] === "0")
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Query Existing Deposit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full max-w-sm items-center gap-3.5">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="Sender">Sender address or ENS Domain</Label>
            <Input
              id="Sender"
              placeholder="Sender"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="Recipient">Recipient address or ENS Domain</Label>
            <Input
              id="Recipient"
              placeholder="Recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2">
        <Button onClick={handleQuery} disabled={queryProcessing}>
          {queryProcessing ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Query
        </Button>
        <br />
        {!queryProcessing && depositData.length ? (
          <>
            {depositInvalidOrEmpty() ? (
              <div className="text-sm">
                There is no deposit for above addresses.
              </div>
            ) : (
              <>
                <div className="text-sm">
                  <p className="font-medium inline">Unlock date:</p>
                  <br />
                  {timestampConvertor(Number(depositData[2]))}
                </div>
                <div className="text-sm">
                  <p className="font-medium inline">Amount:</p>
                  <br />
                  {ethers.formatEther(depositData[3])} ETH
                </div>
              </>
            )}
          </>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default QueryExistingDeposit;
