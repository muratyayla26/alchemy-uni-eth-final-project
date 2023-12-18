"use client";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import { useMainContext } from "@/app/Context";

const provider = new ethers.BrowserProvider(window.ethereum);

const ConnectWallet = () => {
  const { setSigner } = useMainContext();

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      const _signer = await provider.getSigner();
      console.log(" layout_signer", _signer);
      setSigner(_signer);
    }
  };

  return <Button onClick={handleConnectWallet}>Connect Wallet</Button>;
};

export default ConnectWallet;
