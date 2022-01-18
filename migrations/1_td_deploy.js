
var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC20Claimable = artifacts.require("ERC20Claimable.sol");
var evaluator = artifacts.require("Evaluator.sol");
var ExerciceSolution = artifacts.require("ExerciceSolution.sol")


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await deployTDToken(deployer, network, accounts); 
        await deployEvaluator(deployer, network, accounts); 
        await setPermissionsAndRandomValues(deployer, network, accounts); 
		Claimaible=await ERC20Claimable.at('0xb5d82FEE98d62cb7Bc76eabAd5879fa4b29fFE94');
		await deployer.deploy(ExerciceSolution,'0xb5d82FEE98d62cb7Bc76eabAd5879fa4b29fFE94');
		//await deployExerciceSolution(deployer, network, accounts); 
		//await Claimaible.approve(ExerciceSolution.address,1);
		//await Claimaible.decreaseAllowance(ExerciceSolution.address,1)

		
		//var Solution = await ExerciceSolution.deployed();
		
		await deployRecap(deployer, network, accounts);
    });
};

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.new("TD-ERC20-101","TD-ERC20-101",web3.utils.toBN("20000000000000000000000000000"))
	ClaimableToken = await ERC20Claimable.new("ClaimableToken","CLTK",web3.utils.toBN("20000000000000000000000000000"))
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.new(TDToken.address, ClaimableToken.address)
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("ClaimableToken " + ClaimableToken.address)
	console.log("Evaluator " + Evaluator.address)
	console.log("ExerciceSolution " + ExerciceSolution.address)
}
async function deployExerciceSolution(deployer, network, accounts) {
	// I put my token's address
	Evaluator = await ExerciceSolution.new("0xb5d82FEE98d62cb7Bc76eabAd5879fa4b29fFE94")
}


