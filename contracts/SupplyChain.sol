// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract SupplyChain {
    struct Product {
        uint id;
        string name;
        string origin;
        string[] journey;
        address owner;
    }

    mapping(uint => Product) public products;
    uint public productCount = 0;

    event ProductAdded(uint id, string name, string origin, address owner);
    event ProductUpdated(uint id, string stage, address owner);

    function addProduct(string memory _name, string memory _origin) public {
        productCount++;
        products[productCount] = Product(productCount, _name, _origin, new string[](0), msg.sender);
        emit ProductAdded(productCount, _name, _origin, msg.sender);
    }

    function updateJourney(uint _id, string memory _stage) public {
        require(_id > 0 && _id <= productCount, "Invalid product ID.");
        Product storage product = products[_id];
        require(msg.sender == product.owner, "Only the owner can update.");
        product.journey.push(_stage);
        emit ProductUpdated(_id, _stage, msg.sender);
    }

    function getJourney(uint _id) public view returns (string[] memory) {
        require(_id > 0 && _id <= productCount, "Invalid product ID.");
        return products[_id].journey;
    }
}