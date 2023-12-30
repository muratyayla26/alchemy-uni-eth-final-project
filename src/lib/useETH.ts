import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { ethers } from "ethers";

interface Ethereum {
  request: (args: any) => Promise<any>;
}

const useETH = (): [Ethereum | null, BrowserProvider | null] => {
  const [windowETH, setWindowETH] = useState(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      setWindowETH(window.ethereum);

      const providerEthers = new ethers.BrowserProvider(window.ethereum);
      setProvider(providerEthers);
    }
  }, []);

  return [windowETH, provider];
};

export default useETH;
