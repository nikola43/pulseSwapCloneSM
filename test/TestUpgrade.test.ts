import { ethers, upgrades } from 'hardhat'
const test_util = require('./util');
const colors = require('colors');
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

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









        const token = await ethers.getContractAt(
            "GaiaLifeMother",
            "0x3930007f98D595F00e15B3902b7e8eAE263EDb6f"
        );
        const tokenImplementationAddress = await test_util.getProxyImplementation(
            token.address
        );

        console.log(`Deployer: ${deployer.address}`);
        console.log(`Token Address: ${token.address}`);
        console.log(`tokenImplementationAddress: ${tokenImplementationAddress}`);
        console.log();
        // UPGRADE
        // ----------------------------------------------------------------------------
        const contractName = "GaiaLifeMotherV2";
        //deploy new version of token
        const newTokenFactory = await ethers.getContractFactory(
            contractName
        );
        const newToken = await upgrades.upgradeProxy(
            token.address,
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


        console.log('Verifin...');
        await test_util.updateABI(contractName)
        await test_util.verify(newToken.address, contractName)
        expect(1).to.be.eq(1);
    });
});

