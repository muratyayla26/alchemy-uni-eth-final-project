import { ethers } from "ethers";

const provider = new ethers.BrowserProvider(window.ethereum);

export const ensResolver = async (
  ensValue: string
): Promise<boolean | string> => {
  let ensResolved: string | null = "";

  if (ensValue.trim() && ensValue.slice(0, 2) !== "0x") {
    ensResolved = await provider.resolveName(ensValue);
    return ensResolved || false;
  }
  return true;
};
