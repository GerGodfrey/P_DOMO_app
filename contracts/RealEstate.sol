// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract RealEstate is ERC721URIStorage {
    
    uint256 public maxSupply = 2;
    address contractAddress;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    
    constructor(  ) ERC721("Real Estate", "REAL"){ //TODO : address marketplaceAddress 
        // contractAddress = marketplaceAddress;
    }


    // Mintear n veces la misma casa
    function mint(string memory tokenURI) public returns (uint256) {
        //confirmamos requerimientos 
        require(_tokenIds.current() < maxSupply, "I'm sorry we reached the cap");

        //aumentamos y cambiamos el ID 
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        // mintear el nuevo ID y mandárselo al sender 
        _mint(msg.sender, newItemId);
        
        // cambiar el TokenURI de un ID 
        _setTokenURI(newItemId, tokenURI);

        //Dar permisos al contractAddress para que maneje todo 
        setApprovalForAll(contractAddress, true);

        return newItemId;
    }

    function totalSupply() public view returns (uint256){
        return _tokenIds.current();
    }

}