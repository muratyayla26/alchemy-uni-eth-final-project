import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timeLockContractAddress =
  "0xFB183f90D8f16Bd73690647Dd26f763fe72da613";

