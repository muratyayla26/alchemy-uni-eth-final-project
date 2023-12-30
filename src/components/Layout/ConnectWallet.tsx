"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMainContext } from "@/app/Context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useETH from "@/lib/useETH";

const ConnectWallet = () => {
  const { toast } = useToast();
  const { signer, setSigner } = useMainContext();
  const [windowETH, provider] = useETH();
  const [addWalletDialogOpen, setAddWalletDialogOpen] = useState(false);

  const handleConnectWallet = async () => {
    if (windowETH && !signer) {
      try {
        const _signer = await provider?.getSigner();
        setSigner(_signer);
      } catch (err) {
        console.log(err);
        toast({
          variant: "destructive",
          title: "Something went wrong, could not connect wallet.",
        });
      }
    } else {
      setAddWalletDialogOpen(true);
    }
  };

  return (
    <>
      <Button onClick={handleConnectWallet}>
        {signer ? "Wallet Connected" : "Connect Wallet"}
      </Button>
      <Dialog open={addWalletDialogOpen} onOpenChange={setAddWalletDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>
              You must have a compatible wallet extension installed in your
              browser.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConnectWallet;
