"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import { useMainContext } from "@/app/Context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const provider = new ethers.BrowserProvider(window.ethereum);

const ConnectWallet = () => {
  const { signer, setSigner } = useMainContext();
  const [addWalletDialogOpen, setAddWalletDialogOpen] = useState(false);

  const handleConnectWallet = async () => {
    if (window.ethereum && !signer) {
      const _signer = await provider.getSigner();
      setSigner(_signer);
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
