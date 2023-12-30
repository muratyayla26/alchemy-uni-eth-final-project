"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMainContext } from "@/app/Context";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const provider = new ethers.BrowserProvider(window.ethereum);

const ConnectWallet = () => {
  const { toast } = useToast();
  const { signer, setSigner } = useMainContext();
  const [addWalletDialogOpen, setAddWalletDialogOpen] = useState(false);

  const handleConnectWallet = async () => {
    if (window.ethereum && !signer) {
      try {
        const _signer = await provider.getSigner();
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
