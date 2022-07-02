import { upgrades, ethers, run } from "hardhat";

type constructorArgumentsType = (string | string[] | number | number[])[];

var deployedContracts: {
  address: string;
  constructorArguments: constructorArgumentsType;
}[] = [];

const deploy = async ({
  deployer,
  contractName,
  constructorArguments,
  libraries,
}: {
  deployer: string;
  contractName: string;
  constructorArguments: constructorArgumentsType;
  libraries?: any;
}) => {
  const contractInstance = await ethers.getContractFactory(contractName, {
    signer: await ethers.getSigner(deployer),
    libraries: libraries ? libraries : {},
  });

  const contract = await contractInstance.deploy(...constructorArguments);
  await contract.deployed();
  console.log(contractName, "deployed to:", contract.address);

  deployedContracts.push({
    address: contract.address,
    constructorArguments: constructorArguments,
  });

  return contract;
};

const deployProxy = async ({
  deployer,
  contractName,
  constructorArguments,
  libraries,
}: {
  deployer: string;
  contractName: string;
  constructorArguments: constructorArgumentsType;
  libraries?: any;
}) => {
  const contractInstance = await ethers.getContractFactory(contractName, {
    signer: await ethers.getSigner(deployer),
    libraries: libraries ? libraries : {},
  });

  const contract = await upgrades.deployProxy(
    contractInstance,
    constructorArguments,
    { unsafeAllow: ["external-library-linking"] }
  );

  try {
    console.log(
      contractName,
      "implementation is: ",
      await upgrades.erc1967.getImplementationAddress(contract.address)
    );
  } catch {}
  console.log(contractName, "proxy deployed to: ", contract.address);

  deployedContracts.push({
    address: contract.address,
    constructorArguments: constructorArguments,
  });

  return contract;
};

const verifyAll = async () => {
  for (const contract of deployedContracts) {
    console.log("Verifing", contract.address);
    try {
      await run("verify", contract);
    } catch (e) {
      console.log("Error on verification:");
      console.log(e);
      console.log("You can verify it manually using this command:");
      console.log(
        `npx hardhat verify ${
          contract.address
        } ${contract.constructorArguments.join(" ")}`
      );
      console.log();
    }
  }
  deployedContracts = [];
};

export { deploy, deployProxy, verifyAll };
