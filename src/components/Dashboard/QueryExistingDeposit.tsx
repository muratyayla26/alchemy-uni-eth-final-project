"use client";
import { useState } from "react";
import { useMainContext } from "@/app/Context";
import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import { ensResolver } from "@/lib/ensResolver.helper";
import { timeLockContractAddress } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReloadIcon, CheckIcon } from "@radix-ui/react-icons";
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
  const [otherSideAddress, setOtherSideAddress] = useState("");
  const [userStatus, setUserStatus] = useState("userIsSender");
  const [queryProcessing, setQueryProcessing] = useState(false);
  const [withdrawProcessing, setWithdrawProcessing] = useState(false);
  const [releaseProcessing, setReleaseProcessing] = useState(false);
  const [depositData, setDepositData] = useState<string[]>([]);
  const userIsSender = userStatus === "userIsSender";

  const handleQuery = async () => {
    if (!otherSideAddress) return;

    try {
      setQueryProcessing(true);
      const deployedContract = new ethers.Contract(
        timeLockContractAddress,
        TimeLockContract.abi,
        signer
      );

      const ensResolvedOtherSide = await ensResolver(otherSideAddress);
      if (!ensResolvedOtherSide) {
        toast({
          variant: "destructive",
          title: "There is no valid address for provided ENS Domain of sender.",
        });
        return;
      }

      const senderParam = userIsSender
        ? signer?.address
        : typeof ensResolvedOtherSide === "string"
        ? ensResolvedOtherSide
        : otherSideAddress;

      const recipientParam = userIsSender
        ? typeof ensResolvedOtherSide === "string"
          ? ensResolvedOtherSide
          : otherSideAddress
        : signer?.address;

      let existingDeposit = await deployedContract.deposits(
        senderParam,
        recipientParam
      );
      if (existingDeposit) {
        existingDeposit = existingDeposit.toString().split(",");
      }

      setDepositData(existingDeposit);
    } catch (err) {
      console.log(err);
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

  const withdrawToSender = async () => {
    try {
      setWithdrawProcessing(true);
      const deployedContract = new ethers.Contract(
        timeLockContractAddress,
        TimeLockContract.abi,
        signer
      );

      const withdrawTxn = await deployedContract.withdrawToSender(
        otherSideAddress
      );
      await withdrawTxn.wait();

      toast({
        title: "Successful",
        action: (
          <div className="w-full flex items-center">
            <CheckIcon className="mr-2 w-10 h-10 text-green-900" />
            <span className="first-letter:capitalize">
              Withdrawal is successful.
            </span>
          </div>
        ),
      });
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Something went wrong.",
      });
    } finally {
      setWithdrawProcessing(false);
    }
  };

  const releaseForRecipient = async () => {
    try {
      setReleaseProcessing(true);
      const deployedContract = new ethers.Contract(
        timeLockContractAddress,
        TimeLockContract.abi,
        signer
      );

      const releaseTxn = await deployedContract.releaseForRecipient(
        otherSideAddress
      );
      await releaseTxn.wait();

      toast({
        title: "Successful",
        action: (
          <div className="w-full flex items-center">
            <CheckIcon className="mr-2 w-10 h-10 text-green-900" />
            <span className="first-letter:capitalize">
              Withdrawal is successful.
            </span>
          </div>
        ),
      });
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Something went wrong.",
      });
    } finally {
      setReleaseProcessing(false);
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
        <CardTitle>Query and Withdraw Existing Deposit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full max-w-sm items-center gap-3.5">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <RadioGroup
              defaultValue="userIsSender"
              value={userStatus}
              onValueChange={(e) => setUserStatus(e)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="userIsSender" id="radioSender" />
                <Label htmlFor="radioSender">I am sender</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="userIsRecipient" id="radioRecipient" />
                <Label htmlFor="radioRecipient">I am recipient</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="Sender">
              {userIsSender ? "Recipient" : "Sender"} address or ENS Domain
            </Label>
            <Input
              id="Sender"
              placeholder={userIsSender ? "Recipient" : "Sender"}
              value={otherSideAddress}
              onChange={(e) => setOtherSideAddress(e.target.value)}
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
                There is no deposit for above address.
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
        {!queryProcessing && depositData.length && !depositInvalidOrEmpty() ? (
          <>
            {userIsSender && Number(depositData[2]) * 1000 > Date.now() ? (
              <>
                <div className="text-sm">
                  You can withdraw the deposit until the above-mentioned date.
                </div>
                <Button
                  onClick={withdrawToSender}
                  disabled={withdrawProcessing}
                >
                  {withdrawProcessing ? (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Withdraw
                </Button>
              </>
            ) : null}
            {userIsSender && Number(depositData[2]) * 1000 < Date.now() ? (
              <div className="text-sm">
                The deposit lock-in date has passed, so you can no longer
                withdraw it.
              </div>
            ) : null}
            {!userIsSender && Number(depositData[2]) * 1000 < Date.now() ? (
              <>
                <div className="text-sm">
                  The deposit lock-in period has ended, so you can now withdraw
                  the deposit.
                </div>
                <Button
                  onClick={releaseForRecipient}
                  disabled={releaseProcessing}
                >
                  {releaseProcessing ? (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Withdraw
                </Button>
              </>
            ) : null}
            {!userIsSender && Number(depositData[2]) * 1000 > Date.now() ? (
              <div className="text-sm">
                You cannot withdraw the deposit before the lock-in period
                expires.
              </div>
            ) : null}
          </>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default QueryExistingDeposit;
