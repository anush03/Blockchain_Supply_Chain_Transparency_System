require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`, // Replace with your Infura project ID
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Replace with your private key
    },
  },
  solidity: "0.8.28",
};
