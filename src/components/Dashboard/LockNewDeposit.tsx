import { useState } from "react";
import { useMainContext } from "@/app/Context";
import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import { timeLockContractAddress } from "@/lib/utils";
import { ensResolver } from "@/lib/ensResolver.helper";
import { Button } from "@/components/ui/button";
import { CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TimeLockContract from "@/lib/contracts/TimeLockEscrow.sol/TimeLockEscrow.json";

const LockNewDeposit = () => {
  const { toast } = useToast();
  const { signer } = useMainContext();
  const [timeUnit, setTimeUnit] = useState("DAY");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [lockTime, setLockTime] = useState("");
  const [txnProcessing, setTxnProcessing] = useState(false);
  const [txnData, setTxnData] = useState({ hash: "" });

  const handleStartTxn = async () => {
    if (!recipient || !amount || !lockTime) return;

    try {
      setTxnProcessing(true);
      const deployedContract = await new ethers.Contract(
        timeLockContractAddress,
        TimeLockContract.abi,
        signer
      );

      const ensResolved = await ensResolver(recipient);
      if (!ensResolved) {
        toast({
          variant: "destructive",
          title:
            "There is no valid address for provided ENS Domain of recipient.",
        });
        return;
      }

      const lockTimestamp =
        timeUnit === "DAY"
          ? Math.trunc(Number(lockTime) * 24 * 60 * 60)
          : Math.trunc(Number(lockTime) * 60 * 60);

      const createDeposit = await deployedContract.createDeposit(
        typeof ensResolved === "string" ? ensResolved : recipient,
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
    } catch (err) {
      console.log(err);
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lock New Deposit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full max-w-sm items-center gap-3.5">
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
            <Label htmlFor="Amount">Amount (ETH)</Label>
            <Input
              id="Amount"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="flex w-full max-w-sm items-end gap-1.5">
            <div className="grid flex-1 max-w-sm items-center gap-1.5">
              <Label htmlFor="TimeLock">Time Lock</Label>
              <Input
                id="TimeLock"
                placeholder="Time Lock"
                value={lockTime}
                onChange={(e) => setLockTime(e.target.value)}
              />
            </div>
            <div className="w-36">
              <Select onValueChange={(e) => setTimeUnit(e)} value={timeUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day / hour" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAY">Day(s)</SelectItem>
                  <SelectItem value="HOUR">Hour(s)</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
        <br />
        {!txnProcessing && txnData?.hash ? (
          <div className="text-sm">
            <p className="font-medium inline">Transaction hash:</p>
            <br />
            {txnData?.hash}
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default LockNewDeposit;
