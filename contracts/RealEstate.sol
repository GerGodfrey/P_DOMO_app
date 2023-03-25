// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract RealEstate is ERC721URIStorage {
    
    //marketplace 
    
    address contractAddress;
    address creator;
    string public tokenDATA;
    uint256 public publicPrice;
    uint256 public maxSupply;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    //TODO : address marketplaceAddress
    constructor(uint256 _maxSupply, string memory _tokenDATA, address _creator, uint256 _publicPrice) ERC721("Real Estate", "REAL"){  
        maxSupply = _maxSupply;
        tokenDATA = _tokenDATA;
        creator = _creator;
        publicPrice = _publicPrice;
    }

    // Mintear n veces la misma casa
    function mint() public returns (uint256) {
        //confirmamos requerimientos 
        require(_tokenIds.current() <= maxSupply, "I'm sorry we reached the cap");

        //aumentamos y cambiamos el ID 
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        // mintear el nuevo ID y mandárselo al sender 
        // msg.sender = buyer 
        _mint(msg.sender, newItemId);
        
        // cambiar el TokenURI de un ID 
        _setTokenURI(newItemId, tokenDATA);

        //Dar permisos al contractAddress(marketPlace) para que maneje todo
        //setApprovalForAll(contractAddress, true);

        return newItemId;
    }

    function totalSupply() public view returns (uint256){
        return _tokenIds.current();
    }

}


contract Factory {
   RealEstate[] public RealEstateArray;
   
   function CreateNewRealEstate(uint256 _maxSupply, string memory _tokenURI, uint256 _publicPrice) public {
    RealEstate realestate = new RealEstate(_maxSupply, _tokenURI, msg.sender, _publicPrice);
    RealEstateArray.push(realestate);
   }

   function totalRealEstate() public view returns (uint256){
        uint256 res = RealEstateArray.length ; 
        return res;
   }
}