"use client";
import { JsonRpcSigner, ethers } from "ethers";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface MainContextType {
  signer: JsonRpcSigner | undefined;
  setSigner: React.Dispatch<React.SetStateAction<JsonRpcSigner | undefined>>;
}

const provider = new ethers.BrowserProvider(window.ethereum);

export const Context = createContext<MainContextType>({
  signer: undefined,
  setSigner: () => {},
});

const Provider = ({ children }: { children: ReactNode }) => {
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [account, setAccount] = useState("");

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);
      console.log("context accounts", accounts);
      const _signer = await provider.getSigner();
      console.log("context signer", _signer);

      setAccount(accounts[0]);
      setSigner(_signer);
    }
    if (window.ethereum) {
      getAccounts();
    }
  }, [account]);

  const exposed = useMemo(
    () => ({
      signer,
      setSigner,
    }),
    [signer]
  );
  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useMainContext = () => useContext(Context);

export default Provider;
