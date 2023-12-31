import { ethers } from "hardhat";

async function main() {
  const contract = await ethers.deployContract("TimeLockEscrow");

  await contract.waitForDeployment();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
