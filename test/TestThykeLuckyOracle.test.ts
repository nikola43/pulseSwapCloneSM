import { ethers } from 'hardhat'
const test_util = require('./util');
const colors = require('colors');
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';

//available functions
describe("Token contract", async () => {
    let deployer: SignerWithAddress;
    let bob: SignerWithAddress;
    let alice: SignerWithAddress;
    let tykheLuckyOracle: Contract;


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

    it("2. Deploy TykheLuckyOracle", async () => {
        const contractName = "TykheLuckyOracle";
        const args = [
            "0x6A2AAd07396B36Fe02a22b33cf443582f682c82f",
            "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
            "0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314"
        ];

        const contractFactory = await ethers.getContractFactory(contractName)
        tykheLuckyOracle = await contractFactory.deploy(args)
        await tykheLuckyOracle.deployed()
        console.log(
            `${colors.cyan(contractName + " Address: ")} ${colors.yellow(
                tykheLuckyOracle.address
            )}`
        );
        
        await test_util.sleep(1);

        expect(1).to.be.eq(1);
    });
});

