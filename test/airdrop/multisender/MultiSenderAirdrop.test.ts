import {Contract, Wallet} from 'ethers'
import {ethers, upgrades} from 'hardhat'
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {formatEther, parseEther} from "ethers/lib/utils";
const util = require('../../scripts/util.ts');

let deployer: SignerWithAddress;
let bob: SignerWithAddress;
let alice: SignerWithAddress;
let token: Contract;
let implementation: string;

const AdvanceTime = async (time: number) => {
    await ethers.provider.send('evm_increaseTime', [time]);
    await ethers.provider.send('evm_mine', []);
}

describe('Multisender Airdrop', () => {
    it('Full Cycle', async () => {
        // GET SIGNERS
        const signers = await ethers.getSigners()
        deployer = signers[0]
        bob = signers[1]
        alice = signers[2]

        console.log('Deployer: ', deployer.address)
        console.log('Bob: ', bob.address)
        console.log('Alice: ', alice.address)
        console.log()

        // DEPLOY TOKEN V1
        const Token = await ethers.getContractFactory('TokenV1')
        const TokenDeployed = await upgrades.deployProxy(Token, {
            initializer: 'initialize'
        })
        token = await TokenDeployed.deployed()
        console.log('Contract deployed to:', token.address)
        console.log()
        implementation = await util.getProxyImplementation(token.address)
        console.log('implementation:', implementation)

        let balanceBeforeDeployer = await token.balanceOf(deployer.address)
        let balanceBeforeBob = await token.balanceOf(bob.address)




        for (let i = 0; i < 10; i++) {
            const randomAmounts = []
            const randomAddresses = util.generateRandomAddresses(100)
            for (let i = 0; i < randomAddresses.length; i++) {
                const randomAmount = util.generateRandomAmount(1000)
                randomAmounts.push(randomAmount);
            }
            await token.multiSendTokens(randomAddresses, randomAmounts)
            //await AdvanceTime(1000)
        }



        /*
        for (let i = 0; i < randomAddresses.length; i++) {
            const randomAmount = test_util.generateRandomAmount(1000)
            console.log(i + ' -> transfered ' + formatEther(randomAmount) + ' to ' + randomAddresses[i])
            await token.transfer(randomAddresses[i], randomAmount)
        }
        */

        let balanceAfterDeployer = await token.balanceOf(deployer.address)
        let balanceAfterBob = await token.balanceOf(bob.address)

        console.log('balanceBeforeDeployer:', formatEther(balanceBeforeDeployer))
        console.log('balanceBeforeBob:', formatEther(balanceBeforeBob))
        console.log('balanceAfterDeployer:', formatEther(balanceAfterDeployer))
        console.log('balanceAfterBob:', formatEther(balanceAfterBob))
    })
})
