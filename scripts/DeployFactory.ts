
import { ethers } from 'hardhat'
import { formatEther } from 'ethers/lib/utils';
import test_util from './util'
import { Contract } from 'ethers';
const colors = require('colors/safe');
async function main() {

    let factoryContract: Contract;

    const [deployer] = await ethers.getSigners();
    if (deployer === undefined) throw new Error("Deployer is undefined.");
    console.log(
        colors.cyan("Deployer Address: ") + colors.yellow(deployer.address)
    );
    console.log(
        colors.cyan("Account balance: ") +
        colors.yellow(formatEther(await deployer.getBalance()))
    );
    console.log();
    console.log(
        colors.cyan("Deploying TykheLuckyOracle")
    );
    console.log();


    let contractName = "PulseXFactory02";
    const _feeToSetter = "0xCF49661e783c2b7Bf581106c9f88FFA765752e3d";
    let contractFactory = await ethers.getContractFactory(contractName)
    factoryContract = await contractFactory.deploy(_feeToSetter)
    await factoryContract.deployed()
    console.log(
        `${colors.cyan(contractName + " Address: ")} ${colors.yellow(
            factoryContract.address
        )}`
    );

    // verify
    let verify = await test_util.verify(factoryContract.address, contractName, [_feeToSetter]);

    return false;
}


main()
    .then(async (r: any) => {
        console.log("");
        return r;
    })
    .catch(error => {
        console.log(colors.red("ERROR :("));
        console.log(colors.red(error));
        return undefined;
    })
