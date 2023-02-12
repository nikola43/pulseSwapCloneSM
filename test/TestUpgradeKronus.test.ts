import { ethers, upgrades } from 'hardhat'
const colors = require('colors');
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
const test_util = require('../scripts/util');
//available functions
describe("Token contract", async () => {
    let deployer: SignerWithAddress;
    let bob: SignerWithAddress;
    let alice: SignerWithAddress;


    it("1. Get Signer", async () => {
        const signers = await ethers.getSigners();
        if (signers[0] !== undefined) {
            deployer = signers[0];
            console.log(`${colors.cyan('Deployer Address')}: ${colors.yellow(deployer?.address)}`)
        }
        if (signers[1] !== undefined) {
            bob = signers[1];
            console.log(`${colors.cyan('Bob Address')}: ${colors.yellow(bob?.address)}`)
        }
        if (signers[2] !== undefined) {
            alice = signers[2];
            console.log(`${colors.cyan('Alice Address')}: ${colors.yellow(alice?.address)}`)
        }
    });

    it("2. Deploy UPGRADE GAIA", async () => {


        const contractName = "CronusTimeKeeper";
        const tokenDeployed = await ethers.getContractAt(contractName, '0xb23C82552667620E35D182c89D48d62752acac1a')

        const newTokenFactory = await ethers.getContractFactory(
            "CronusTimeKeeperV2"
        );
        const newToken = await upgrades.upgradeProxy(
            tokenDeployed.address,
            newTokenFactory
        );
        await newToken.deployed();
        const newTokenImplementationAddress = await test_util.getProxyImplementation(
            newToken.address
        );
        console.log(`Token Address: ${newToken.address}`);
        console.log(
            `newTokenImplementationAddress: ${newTokenImplementationAddress}`
        );

        console.log();

        expect(1).to.be.eq(1);
    });
});

