// SPDX-License-Identifier: MIT


//  TODO : 
    // Definir si todas las address son necesarias 
    // modificar el _scrowAmount por una variable del contrato 
    // modificar el onlySeller  

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
    address public nftAddress;
    address payable public seller; 
    address public inspector;
    address public lender;

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
    mapping(uint256 => uint256) public escrowAmount;
    mapping(uint256 => address) public buyer;
    mapping(uint256 => bool) public inspectionPassed;
    mapping(uint256 => mapping (address => bool)) public approval;


    constructor(address _nftAddress, address payable _seller, address _inspector, address _lender){
        nftAddress = _nftAddress;
        seller = _seller;
        inspector = _inspector;
        lender = _lender;
    }

    // Transferir el NFT con ese ID del RealEstate a este contrato y guardar quien lo compró
    function list(
        uint256 _nftID,
        address _buyer,
        uint256 _purchasePrice,
        uint256 _escrowAmount
    ) public payable {

        IERC721(nftAddress).transferFrom(msg.sender, address(this),_nftID);
        isListed[_nftID] = true;
        purchasePrice[_nftID] = _purchasePrice;
        escrowAmount[_nftID] = _escrowAmount;
        buyer[_nftID] = _buyer;
    }

    // Put Under Contract (only buyer - payable scrow)
    function depositEarnest(uint256 _nftID) public payable onlyBuyer(_nftID){
        require(msg.value >= escrowAmount[_nftID]);
    }

    function updateInspectionStatus(uint256 _nftID, bool _passed) public onlyInspector {
        inspectionPassed[_nftID] = _passed ;
    }

    function approveSale(uint256 _nftID) public {
        approval[_nftID][msg.sender] = true; 
    }

    

    function finalizeSale(uint256 _nftID) public {
        require(inspectionPassed[_nftID]);
        require(approval[_nftID][buyer[_nftID]]);
        require(approval[_nftID][seller]);
        require(approval[_nftID][lender]);
        require(address(this).balance >= purchasePrice[_nftID]*_nftID);
        isListed[_nftID] = false;

        (bool success,) = payable(seller).call{value: address(this).balance}("");
        require(success);

        // TODO : AQUÍ SOLO MANDO EL NFT AL ÚLTIMO QUE LO COMPRÓ
        IERC721(nftAddress).transferFrom(address(this),buyer[_nftID],_nftID);
    }

    function cancelSale(uint256 _nftID) public {
        if (inspectionPassed[_nftID] == false) {
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