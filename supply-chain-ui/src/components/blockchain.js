import { ethers } from "ethers";

const infuraUrl =
  "https://sepolia.infura.io/v3/207b70c1a1464149ba8c3c2b8c97b365";
const provider = new ethers.JsonRpcProvider(infuraUrl);
const contractABI = [
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
const contractAddress = "0x3547B39ae2cc0bC194234D04C9D936eb49C05aaD";

const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Connect to the wallet
export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      // Request account access from the user
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Use BrowserProvider to interact with the Ethereum network
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Get the signer (the account from the wallet)
      const signer = await provider.getSigner();

      console.log("Wallet connected:", await signer.getAddress());

      // Return the signer to be used for transactions
      return signer;
    } catch (err) {
      console.error("Connection failed:", err);
      return null;
    }
  } else {
    console.error("Please install MetaMask!");
    return null;
  }
};

// Add product
export const addProduct = async (name, origin) => {
  const signer = await connectWallet();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  try {
    const tx = await contract.addProduct(name, origin);
    console.log("Transaction sent. Waiting for confirmation...");
    const receipt = await tx.wait();

    // Log the entire receipt for debugging purposes
    console.log("Transaction Receipt:", receipt);

    // Look for the 'ProductAdded' event in the receipt
    const productAddedEvent = receipt.events?.find(
      (event) => event.event === "ProductAdded"
    );

    if (productAddedEvent) {
      const productId = productAddedEvent.args.id.toString();
      console.log(`Product added with ID: ${productId}`);
      return productId; // Return the product ID
    } else {
      console.error("ProductAdded event not found in receipt.");
      return null; // Return null if event is not found
    }
  } catch (err) {
    console.error("Error adding product:", err);
    return null; // Return null if error occurs
  }
};

// Update journey
export const updateJourney = async (_id, _stage) => {
  const signer = provider.getSigner();
  const contractWithSigner = contract.connect(signer);
  const tx = await contractWithSigner.updateJourney(_id, _stage);
  await tx.wait();
  console.log("Journey updated:", tx);
};

// Get journey
export const getJourney = async (_id) => {
  try {
    // Get the provider
    const provider = new ethers.BrowserProvider(window.ethereum);

    // Connect to the contract
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );

    // Call the getJourney function from the smart contract
    const journey = await contract.getJourney(_id);

    return journey; // This will return the journey array
  } catch (err) {
    console.error("Error fetching journey:", err);
    return [];
  }
};
