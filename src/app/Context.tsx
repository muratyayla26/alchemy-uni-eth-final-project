"use client";
import { usePathname } from "next/navigation";
import { JsonRpcSigner, ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";
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
  const pathName = usePathname();
  const { toast } = useToast();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [account, setAccount] = useState("");

  useEffect(() => {
    async function getAccounts() {
      try {
        const accounts = await provider.send("eth_requestAccounts", []);
        const _signer = await provider.getSigner();

        setAccount(accounts[0]);
        setSigner(_signer);
      } catch (err) {
        console.log(err);
        toast({
          variant: "destructive",
          title: "Something went wrong, could not connect wallet.",
        });
      }
    }
    if (window.ethereum && pathName === "/dashboard") {
      getAccounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
