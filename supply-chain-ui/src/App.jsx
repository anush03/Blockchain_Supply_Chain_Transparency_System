import React, { useState } from "react";
import {
  addProduct,
  updateJourney,
  getJourney,
  connectWallet,
} from "./components/blockchain";

const App = () => {
  const [productName, setProductName] = useState("");
  const [productOrigin, setProductOrigin] = useState("");
  const [journeyStage, setJourneyStage] = useState("");
  const [productId, setProductId] = useState(""); // This will store the product ID
  const [journey, setJourney] = useState([]);
  const [AccountAddress, setAccountAddress] = useState(null);

  const handleAddProduct = async () => {
    if (productName && productOrigin) {
      try {
        // Call the addProduct function to add the product
        const newProductId = await addProduct(productName, productOrigin);

        // Set the productId state with the newly added product's ID
        setProductId(newProductId);

        // Clear the form inputs
        setProductName("");
        setProductOrigin("");

        console.log(`Product added with ID: ${newProductId}`);
      } catch (err) {
        console.error("Error adding product:", err);
      }
    }
  };

  const handleUpdateJourney = async () => {
    if (productId && journeyStage) {
      try {
        // Call the updateJourney function to update the product's journey
        await updateJourney(productId, journeyStage);
        setJourneyStage("");
      } catch (err) {
        console.error("Failed to update journey:", err);
      }
    }
  };

  const handleGetJourney = async () => {
    if (productId) {
      try {
        // Fetch the journey data
        const journeyData = await getJourney(productId);

        // Update state with journey data
        setJourney(journeyData);
      } catch (err) {
        console.error("Failed to get journey:", err);
      }
    } else {
      console.log("Product ID is required.");
    }
  };

  const handleConnectWallet = async () => {
    const signer = await connectWallet();
    const AccountAdd = await signer.getAddress();
    setAccountAddress(AccountAdd);
  };

  return (
    <div className="app">
      <h1>Supply Chain</h1>
      <button onClick={handleConnectWallet}>
        {AccountAddress ? `Connected: ${AccountAddress}` : "Connect Wallet"}
      </button>

      <div>
        <h2>Add Product</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={productName || ""} // Make sure it's always a string, even if empty
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Product Origin"
          value={productOrigin || ""} // Same for the product origin
          onChange={(e) => setProductOrigin(e.target.value)}
        />

        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      <div>
        <h2>Update Journey</h2>
        <input
          type="number"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Journey Stage"
          value={journeyStage}
          onChange={(e) => setJourneyStage(e.target.value)}
        />
        <button onClick={handleUpdateJourney}>Update Journey</button>
      </div>

      <div>
        <h2>Get Journey</h2>
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
