import { ethers } from 'hardhat'
//const test_util = require('./util');
const colors = require('colors');
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';
///import { formatEther, parseEther } from 'ethers/lib/utils';

//available functions
describe("Token contract", async () => {
    let deployer: SignerWithAddress;
    let bob: SignerWithAddress;
    let alice: SignerWithAddress;
    let tokenDeployed: Contract;
    //let router: Contract;

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

    it("2. LOAD Contract", async () => {

        // INSTANCE CONTRACT

        // DEPLOY
        const contractName = 'MidasGoldKingV2'
        tokenDeployed = await ethers.getContractAt(contractName, '0x810Ce1B6e73209bf20b8f1EbdC7814abE0DE63d8')

        expect(1).to.be.eq(1);
    });

    it("3. Get owner", async () => {
   
        const owner = await tokenDeployed.owner()

        console.log(`${colors.cyan('Alice Address')}: ${colors.yellow(owner)}`)

        expect(1).to.be.eq(1);
    });

});

