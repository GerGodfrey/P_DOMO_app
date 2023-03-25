// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
import "hardhat/console.sol";

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

contract Escrow {
    
    address public address_rs;
    address payable public seller; 
    address public inspector;
    address public lender;
    uint256 public maxSupply;
    bool public isSouldOut = false;
    bool public inspectionPassed = false;

    modifier onlyBuyer (uint256 _nftID) { 
        require(msg.sender == buyer[_nftID], "Only buyer can call this function");
        _;
    }

    modifier onlySeller () { 
        require(msg.sender == seller, "Only sender can call this function");
        _;
    }

    modifier onlyInspector () { 
        require(msg.sender == inspector, "Only inspector can call this function");
        _;
    }

    mapping(uint256 => bool) public isListed;
    mapping(uint256 => uint256) public purchasePrice;
    //mapping(uint256 => uint256) public escrowAmount;
    mapping(uint256 => address) public buyer;
    mapping(address => bool) public generic_approval;
    mapping(uint256 => mapping (address => bool)) public approval;


    constructor(address _address_rs, uint256 _maxSupply ,address payable _seller, address _inspector, address _lender){
        address_rs = _address_rs;
        maxSupply = _maxSupply;
        seller = _seller;
        inspector = _inspector;
        lender = _lender;
    }

    // Transferir el NFT con ese ID del RealEstate a este contrato y guardar quien lo compró
    function list(
        uint256 _nftID,
        address _buyer,
        uint256 _purchasePrice
    ) public payable {

        IERC721(address_rs).transferFrom(msg.sender, address(this),_nftID);
        isListed[_nftID] = true;
        purchasePrice[_nftID] = _purchasePrice;
        buyer[_nftID] = _buyer;
        if(_nftID >= maxSupply ){
            isSouldOut = true;
        }

    }

    // Put Under Contract (only buyer - payable scrow)
    function depositEarnest(uint256 _nftID) public payable onlyBuyer(_nftID){
        require(msg.value >= purchasePrice[_nftID]);
    }

    function updateInspectionStatus(bool _passed) public onlyInspector {
        inspectionPassed = _passed ;
    }

    function approveSale(uint256 _nftID) public {
        approval[_nftID][msg.sender] = true; 
    }

    function generic_approveSale() public {
        generic_approval[msg.sender] = true; 
    }

    function finalizeSale(uint256 _nftID) public {
        require(isSouldOut);
        require(inspectionPassed);
        require( address(this).balance >= purchasePrice[_nftID] * maxSupply);                
        (bool success,) = payable(seller).call{value: address(this).balance}("");
        require(success);

        for (uint i = 1; i <= maxSupply ; i++) {
            
            isListed[_nftID] = false;
            IERC721(address_rs).transferFrom(address(this),buyer[i],i);
        }
        
    }

    function cancelSale(uint256 _nftID) public onlySeller {
        if (inspectionPassed == false) {
            payable(buyer[_nftID]).transfer(address(this).balance);

        }else{
            payable(seller).transfer(address(this).balance);
        }
    }

    receive() external payable {}

    function getBalance() public view returns (uint256){
        return address(this).balance;
    }

}