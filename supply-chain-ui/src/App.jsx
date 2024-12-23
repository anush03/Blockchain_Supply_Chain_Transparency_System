import React, { useState } from "react";
import {
  connectToBlockchain,
  addProduct,
  getJourney,
} from "./components/blockchain";

const App = () => {
  const [account, setAccount] = useState(null); // Store the connected account
  const [productName, setProductName] = useState("");
  const [productOrigin, setProductOrigin] = useState("");
  const [productId, setProductId] = useState("");
  const [journey, setJourney] = useState([]);

  // Function to connect MetaMask
  const handleConnect = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]); // Set the first account as the active account
        alert(`Connected to MetaMask: ${accounts[0]}`);
      } else {
        alert("MetaMask is not installed. Please install it to use this app.");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert("Failed to connect to MetaMask.");
    }
  };

  const handleAddProduct = async () => {
    try {
      const { signer } = await connectToBlockchain();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      const tx = await contract.addProduct(productName, productOrigin);
      await tx.wait();
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert(
        "Failed to add product. Ensure MetaMask is connected and try again."
      );
    }
  };

  const handleGetJourney = async () => {
    if (!account) {
      alert("Please connect MetaMask first.");
      return;
    }
    try {
      const journeyData = await getJourney(productId);
      setJourney(journeyData);
    } catch (error) {
      console.error("Error retrieving journey:", error);
    }
  };

  return (
    <div>
      <h1>Supply Chain Transparency System</h1>

      {/* Connect Wallet */}
      <div>
        <button onClick={handleConnect}>
          {account ? `Connected: ${account}` : "Connect Wallet"}
        </button>
      </div>

      {/* Add Product */}
      <div>
        <h2>Add Product</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Origin"
          value={productOrigin}
          onChange={(e) => setProductOrigin(e.target.value)}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      {/* Get Journey */}
      <div>
        <h2>Get Product Journey</h2>
        <input
          type="number"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <button onClick={handleGetJourney}>Get Journey</button>
        <ul>
          {journey.map((stage, index) => (
            <li key={index}>{stage}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
