import { ethers } from "hardhat";
import { deploy, deployProxy, verifyAll } from "./helpers/deploy-contract";
import { sleep } from "./helpers/sleep";

async function deployLpToken(deployer: string) {
  const contract = await deploy({
    deployer,
    contractName: "LPToken",
    constructorArguments: [],
  });

  await contract.initialize("Sync LP Token", "syncLPToken");

  return contract;
}

async function deploySyncToken(deployer: string) {
  const contract = await deployProxy({
    deployer,
    contractName: "SyncToken",
    constructorArguments: [],
  });
  return contract;
}

async function deployAmplificationUtils(deployer: string) {
  const contract = await deploy({
    deployer,
    contractName: "AmplificationUtils",
    constructorArguments: [],
  });

  return contract;
}

async function deploySwapUtils(deployer: string) {
  const contract = await deploy({
    deployer,
    contractName: "SwapUtils",
    constructorArguments: [],
  });

  return contract;
}

async function deploySwapDeployer(deployer: string) {
  const contract = await deploy({
    deployer,
    contractName: "SwapDeployer",
    constructorArguments: [],
  });

  return contract;
}

async function deployPool(
  deployer: string,
  swapUtilsAddress: string,
  amplificationUtilsAddress: string,
  {
    tokenAddresses,
    tokenDecimals,
    lpTokenName,
    lpTokenSymbol,
    initialA,
    swapFee,
    adminFee,
    lpTokenTargetAddress,
  }: {
    tokenAddresses: string[];
    tokenDecimals: number[];
    lpTokenName: string;
    lpTokenSymbol: string;
    initialA: number;
    swapFee: number;
    adminFee: number;
    lpTokenTargetAddress: string;
  }
) {
  await deployProxy({
    deployer,
    contractName: "SwapFlashLoan",
    libraries: {
      SwapUtils: swapUtilsAddress,
      AmplificationUtils: amplificationUtilsAddress,
    },
    constructorArguments: [
      tokenAddresses,
      tokenDecimals,
      lpTokenName,
      lpTokenSymbol,
      initialA,
      swapFee,
      adminFee,
      lpTokenTargetAddress,
    ],
  });
}

async function deployTestToken(deployer: string, name: string, symbol: string) {
  const contract = await deploy({
    deployer,
    contractName: "TestToken",
    constructorArguments: [name, symbol],
  });

  return contract;
}

async function main() {
  const [deployerSigner] = await ethers.getSigners();
  const deployer = deployerSigner.address;

  // TODO: deploy two test token (TOKEN0, TOKEN1)
  const token0 = await deployTestToken(deployer, "Test Token 0", "TOKEN0");
  await sleep(10000);

  const token1 = await deployTestToken(deployer, "Test Token 1", "TOKEN1");
  await sleep(10000);

  const tokenAddresses = [token0.address, token1.address];
  const tokenDecimals = [18, 18]; // DEI, bDEI
  const lpTokenName = "Sync TOKEN0/TOKEN1";
  const lpTokenSymbol = "TOKEN0/TOKEN1";
  const initialA = 100;
  const swapFee = 5e6;
  const adminFee = 5e6;

  await deploySwapDeployer(deployer);
  await sleep(10000);

  const lpToken = await deployLpToken(deployer);
  await sleep(15000);

  await deploySyncToken(deployer);
  await sleep(10000);

  const amplificationUtils = await deployAmplificationUtils(deployer);
  await sleep(10000);

  const swapUtils = await deploySwapUtils(deployer);
  await sleep(10000);

  await deployPool(deployer, swapUtils.address, amplificationUtils.address, {
    tokenAddresses,
    tokenDecimals,
    lpTokenName,
    lpTokenSymbol,
    initialA,
    swapFee,
    adminFee,
    lpTokenTargetAddress: lpToken.address,
  });
  await sleep(10000);

  await verifyAll();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
