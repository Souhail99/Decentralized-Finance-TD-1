pragma solidity >=0.6.0 <0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "./ERC20TD.sol";
//import "./ERC20Claimable.sol";
//import "./ExerciceSolution.sol";
//import "./IERC20Mintable.sol";

contract ExerciceSolutionToken is ERC20 {
    mapping(address=>uint256) public mintersisamount;
    mapping(address=>bool) public mintersisminter;
    address public owner;

    //constructor to mint
    constructor(string memory name, string memory symbol,uint256 initialSupply) public ERC20(name, symbol) 
	{
	   _mint(msg.sender, initialSupply);
       mintersisminter[msg.sender]=true;
       owner=msg.sender;
	}

    // Verfify if the caller is the owner
    modifier onlyOwner(){
        require(mintersisminter[msg.sender]);
        _;
    }
    
    event isminter(address minter,bool check);
    function setMinter(address minterAddress, bool isMinter) external onlyOwner{
        mintersisminter[minterAddress]=isMinter;
        emit isminter(minterAddress,true);

    }

    function isMinter(address minterAddress) external returns (bool){
        return mintersisminter[minterAddress];
    }

    
    event minttoken(address destinataire,uint256 amount);
    function mint(address toAddress, uint256 amount) external onlyOwner{
        _mint(toAddress,amount);
        emit minttoken(toAddress,amount);
    }

    
    event burned(address destinataire,uint256 amount);
	function burn(address mintaddress, uint256 value)  external onlyOwner{
        _burn(mintaddress, value);
        emit burned(mintaddress, value);
    }
    


}