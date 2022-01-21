pragma solidity >=0.6.0 <0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "./ERC20TD.sol";
import "./ERC20Claimable.sol";
import "./ExerciceSolutionToken.sol";
//import "./IERC20Mintable.sol";

//0xb5d82fee98d62cb7bc76eabad5879fa4b29ffe94 adresse token
contract ExerciceSolution {
    mapping(address=>uint256) public claimedToken;
    ERC20Claimable public ERC20claim;
    ExerciceSolutionToken public soltoken;
    //ERC20 public _allows;
    
    constructor (ERC20Claimable value, ExerciceSolutionToken value2) public {
        ERC20claim = value;
        soltoken=value2;
    }
    
    fallback () external payable 
	{}

	receive () external payable 
	{}

    function balanceOf() public view returns (uint256){
        return ERC20claim.balanceOf(address(this));
    }

    event claimed(address caller, uint256 amount);
    function claimTokensOnBehalf() public {
        //Current Balance
        uint256 Balance = balanceOf();
        // claim tokens
        ERC20claim.claimTokens();
        // new balance
        uint256 newBalance = ERC20claim.balanceOf(address(this));
       
        uint256 res = newBalance - Balance;
        require(res>=0,"No money !");
       
        claimedToken[msg.sender]+= res;
        
        emit claimed(msg.sender,res);
    } 
    
    // Verify
    function tokensInCustody(address caller) public view returns(uint256){
        //uint256 claim=claimedToken[caller];
        return claimedToken[caller];
    }
    

    
    
    //0xcf9f3c82883efd288c169c231c6c6d513c5d748e adress de mon token
    event withdraw(address caller,uint256 amount);
    function withdrawTokens(uint256 amountToWithdraw) external returns (uint256){
        //Verify the balance of the caller
        //uint256 Balance = ERC20claim.balanceOf(address(this));
        //require(Balance>0,"No money !");
        
        //Then verify the amount of the user
        uint256 claim=claimedToken[msg.sender];
        require(claim>=amountToWithdraw,"Oups ! No token... or require more token please ! ");
        
        ERC20claim.transfer(msg.sender, amountToWithdraw);
        claimedToken[msg.sender] = claim - amountToWithdraw;
        //Enlever la ligne ci-dessous pour l'exo 3
        soltoken.burn(msg.sender,amountToWithdraw);
        emit withdraw(msg.sender, claimedToken[msg.sender]);
        return amountToWithdraw;
    }
    
    event depot(address caller,uint256 amount);
    function depositTokens(uint256 amountToDeposit) external returns (uint256){
        uint256 claim=claimedToken[msg.sender];
        require(amountToDeposit > 0,"Oups ! No token... or require more token please ! ");
        require(ERC20claim.transferFrom(msg.sender,address(this),amountToDeposit)==true);

        claimedToken[msg.sender] = claim + amountToDeposit;
        soltoken.mint(msg.sender,amountToDeposit);
        emit depot(msg.sender, amountToDeposit);
        return amountToDeposit;
    }

	function getERC20DepositAddress() external returns (address) {
        return address(soltoken);
    }
   

}





    