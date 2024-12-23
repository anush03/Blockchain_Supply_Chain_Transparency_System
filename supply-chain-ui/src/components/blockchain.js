import { ethers } from "ethers";

// Contract details

const CONTRACT_ADDRESS = "0x3547B39ae2cc0bC194234D04C9D936eb49C05aaD";
const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_origin", type: "string" },
    ],
    name: "addProduct",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
    name: "getJourney",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_id", type: "uint256" },
      { internalType: "string", name: "_stage", type: "string" },
    ],
    name: "updateJourney",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "productCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "products",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "origin", type: "string" },
      { internalType: "address", name: "owner", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// export async function connectToBlockchain() {
//   console.log("Checking for MetaMask...");

//   if (typeof window.ethereum === "undefined") {
//     console.error("MetaMask not found.");
//     alert(
//       "MetaMask is not installed. Please install it from https://metamask.io."
//     );
//     throw new Error("MetaMask not found");
//   }

//   try {
//     console.log("MetaMask detected. Requesting accounts...");

//     // Request account access
//     const accounts = await window.ethereum.request({
//       method: "eth_requestAccounts",
//     });
//     if (!accounts || accounts.length === 0) {
//       throw new Error("No accounts found. Please connect MetaMask.");
//     }
//     console.log("Connected account:", accounts[0]);

//     // Initialize ethers provider and signer
//     const provider = new ethers.providers.Web3Provider(window.ethereum, "any"); // Use "any" to support multiple networks
//     const signer = provider.getSigner();

//     console.log("Provider and signer initialized:", provider, signer);
//     return { provider, signer };
//   } catch (error) {
//     console.error("Error connecting to MetaMask:", error);
//     throw new Error("Unable to connect to MetaMask");
//   }
// }

const INFURA_URL =
  "https://sepolia.infura.io/v3/207b70c1a1464149ba8c3c2b8c97b365";

// Create the provider using Infura for Sepolia
const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);

export async function connectToBlockchain() {
  console.log("Connecting to Sepolia network via Infura...");

  if (typeof window.ethereum === "undefined") {
    console.error("MetaMask not found.");
    alert(
      "MetaMask is not installed. Please install it from https://metamask.io."
    );
    throw new Error("MetaMask not found");
  }

  try {
    console.log("MetaMask detected. Requesting accounts...");

    // Request account access from MetaMask
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found. Please connect MetaMask.");
    }
    console.log("Connected account:", accounts[0]);

    // Create a signer using MetaMask
    const signer = new ethers.BrowserProvider(window.ethereum).getSigner();

    console.log("Provider and signer initialized:", provider, signer);
    return { provider, signer };
  } catch (error) {
    console.error("Error connecting to MetaMask or Infura:", error);
    throw new Error("Unable to connect to MetaMask or Infura");
  }
}

// To check the latest block number using the Infura provider
provider
  .getBlockNumber()
  .then((blockNumber) => {
    console.log("Latest block number:", blockNumber);
  })
  .catch((error) => {
    console.error("Error getting block number:", error);
  });

export async function addProduct(name, origin) {
  try {
    const { signer } = await connectToBlockchain();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    // Call the smart contract method
    const tx = await contract.addProduct(name, origin);
    await tx.wait(); // Wait for transaction to be mined
    console.log("Product added successfully:", tx);
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error(
      "Failed to add product. Check MetaMask and blockchain connection."
    );
  }
}

export async function updateJourney(id, stage) {
  const { contract } = await connectToBlockchain();
  const tx = await contract.updateJourney(id, stage);
  await tx.wait();
  console.log("Journey updated:", tx);
}

export async function getJourney(id) {
  const { contract } = await connectToBlockchain();
  const journey = await contract.getJourney(id);
  console.log("Journey for product ID", id, journey);
  return journey;
}
