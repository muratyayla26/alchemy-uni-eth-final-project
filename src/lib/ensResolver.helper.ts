import { BrowserProvider } from "ethers";

export const ensResolver = async (
  ensValue: string,
  provider: BrowserProvider | null
): Promise<boolean | string> => {
  if (!provider) return "";
  let ensResolved: string | null = "";

  if (ensValue.trim() && ensValue.slice(0, 2) !== "0x") {
    ensResolved = await provider.resolveName(ensValue);
    return ensResolved || false;
  }
  return true;
};
