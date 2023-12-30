"use client";
import { usePathname } from "next/navigation";
import { JsonRpcSigner } from "ethers";
import { useToast } from "@/components/ui/use-toast";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useETH from "@/lib/useETH";

interface MainContextType {
  signer: JsonRpcSigner | undefined;
  setSigner: React.Dispatch<React.SetStateAction<JsonRpcSigner | undefined>>;
}

export const Context = createContext<MainContextType>({
  signer: undefined,
  setSigner: () => {},
});

const Provider = ({ children }: { children: ReactNode }) => {
  const pathName = usePathname();
  const { toast } = useToast();
  const [windowETH, provider] = useETH();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [account, setAccount] = useState("");

  useEffect(() => {
    async function getAccounts() {
      try {
        const accounts = await provider?.send("eth_requestAccounts", []);
        const _signer = await provider?.getSigner();

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
    if (windowETH && pathName === "/dashboard") {
      getAccounts();
    }
  }, [account, provider, windowETH, pathName, toast]);

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
