import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-web3";
import "@openzeppelin/hardhat-upgrades";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  networks: {
    fantom: {
      url: "https://rpc.ankr.com/fantom/" + process.env.ANKR_STRING,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
      chainId: 250,
      gas: "auto",
      gasPrice: "auto",
      // gasMultiplier: 1.2
    },
    localhostFantom: {
      url: "http://127.0.0.1:8547/",
    },
    localhost: {
      url: "http://127.0.0.1:8547/",
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100000,
          },
        },
      },
    ],
  },
  etherscan: {
    apiKey: process.env.FANTOM_API_KEY,
  },
};

export default config;
