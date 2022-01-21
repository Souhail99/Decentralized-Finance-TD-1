
var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC20Claimable = artifacts.require("ERC20Claimable.sol");
var evaluator = artifacts.require("Evaluator.sol");
var ExerciceSolution = artifacts.require("ExerciceSolution.sol")
var ExerciceSolutionToken = artifacts.require("ExerciceSolutionToken.sol")

const account = "0x7bb1AEb48F28c51E7f83506861AC7af33cD92F35"
const evaluatorAdress = "0x384C00Ff43Ed5376F2d7ee814677a15f3e330705"

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await deployTDToken(deployer, network, accounts); 
        await deployEvaluator(deployer, network, accounts); 
        await setPermissionsAndRandomValues(deployer, network, accounts); 
		await deployRecap(deployer, network, accounts);
		
		//await deployer.deploy(ExerciceSolution,'0xccCf36429190773Fd604a808Cb03f682136B007e',ExerciceSolutionToken.address);

		//Evaluator=await Evaluator.at("0x1987D516D14eBf3025069504b1aD2257516C426a")
		
		//await deployExerciceSolution(deployer, network, accounts); 

		//await deployer.deploy(ExerciceSolutionToken,"Token","toook",web3.utils.toBN("20000000000000000000000000000"));
		await makeExercise(deployer, network, accounts);
		await deployExerciceSolutionToken(deployer, network, accounts);
		
		//await Evaluator.submitExercice(Solution.address);
		//await Evaluator.submitExercice(SolutionToken.address);
		//await Evaluator.submitExercice(Evaluator.address);
		
		//await deployer.deploy(ExerciceSolutionToken,"Token","toook",web3.utils.toBN("20000000000000000000000000000"));
		//var SolutionToken = await ExerciceSolutionToken.deployed();
		
	

		//var Solution = await ExerciceSolution.deployed();
		//console.log("ExerciceSolutionToken2 " + SolutionToken.address)
		//console.log("ExerciceSolution 2" + Solution.address)

		//var Solution = await ExerciceSolution.deployed();

		
		

    });
};

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.new("TD-ERC20-101","TD-ERC20-101",web3.utils.toBN("20000000000000000000000000000"))
	ClaimableToken = await ERC20Claimable.new("ClaimableToken","CLTK",web3.utils.toBN("20000000000000000000000000000"))
	Claimable=await ERC20Claimable.at("0xb5d82FEE98d62cb7Bc76eabAd5879fa4b29fFE94")
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.at(evaluatorAdress)
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
}

async function deployRecap(deployer, network, accounts) {
	//console.log("TDToken " + TDToken.address)
	//console.log("ClaimableToken " + ClaimableToken.address)
	//console.log("Evaluator " + Evaluator.address)
	console.log("ExerciceSolution " + ExerciceSolution.address)
	console.log("ExerciceSolutionToken " + ExerciceSolutionToken.address)
}
async function deployExerciceSolution(deployer, network, accounts) {
	// I put my token's address
	Evaluator = await ExerciceSolution.new("0xb5d82FEE98d62cb7Bc76eabAd5879fa4b29fFE94",ExerciceSolutionToken.address)
}

async function deployExerciceSolutionToken(deployer, network, accounts) {
	// I put my token's address
	
	SolutionToken = await ExerciceSolutionToken.new("Token","toook",web3.utils.toBN("20000000000000000000000000000"))
	Solution = await ExerciceSolution.new("0xb5d82FEE98d62cb7Bc76eabAd5879fa4b29fFE94",SolutionToken.address, {from:account})
	await SolutionToken.setMinter(Solution.address,true, {from:account});
}

async function makeExercise(deployer, network, accounts) {


	await deployExerciceSolutionToken(deployer, network, accounts);
	console.log("Solution " + Solution.address)
	console.log("SolutionToken " + SolutionToken.address)

	// Submit Exercise
	console.log("====== Submit Exercise ======")
	await Evaluator.submitExercice(Solution.address , {from:account})
	const submit_balance = await TDToken.balanceOf(account)
	console.log("submit_balance " + submit_balance)

	console.log("====== Exercice 1 ======")
	await Claimable.claimTokens({from: account})
	await Evaluator.ex1_claimedPoints({from:account});
	console.log("====== Exercice 2 ======")
	await Evaluator.ex2_claimedFromContract({from:account});
	console.log("====== Exercice 3 ======")
	//Enlever la ligne ci-dessous pour l'exo 3
    //soltoken.burn(msg.sender,amountToWithdraw); dans ExerciceSolution.sol method withdrawTokens ligne 70
	await Evaluator.ex3_withdrawFromContract({from:account});
	console.log("====== Exercice 4 ======")
	await Claimable.approve(Solution.address,10,{from:account});
	await Evaluator.ex4_approvedExerciceSolution({from:account});
	console.log("====== Exercice 5 ======")
	await Claimable.decreaseAllowance(Solution.address,10,{from:account})
	await Evaluator.ex5_revokedExerciceSolution({from:account});
	console.log("====== Exercice 6 ======")
	await Evaluator.ex6_depositTokens({from:account});
		

	
	console.log("====== Exercice 7 ======")
	await Evaluator.ex7_createERC20({from:account})
	const ex7_balance = await TDToken.balanceOf(account)
	console.log("ex7_balance " + ex7_balance)

	
	console.log("====== Exercice 8 ======")
	await Evaluator.ex8_depositAndMint({from:account})
	const ex8_balance = await TDToken.balanceOf(account)
	console.log("ex8_balance " + ex8_balance)

	
	console.log("====== Exercice 9 ======")
	await Evaluator.ex9_withdrawAndBurn({from:account})
	const ex9_balance = await TDToken.balanceOf(account)
	console.log("ex9_balance " + ex9_balance)
}

