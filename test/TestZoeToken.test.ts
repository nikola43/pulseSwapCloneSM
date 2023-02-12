import { ethers } from 'hardhat'
import { chains, connectWBTC_ETH, connectUSDT_ETH, connectRouter, connectFactory, connectPair, getAmountsOut, swapExactETHForTokens, swapExactTokensForTokensSupportingFeeOnTransferTokens } from '../scripts/util'
const colors = require('@colors/colors/safe');
import { expect } from 'chai'
import { formatEther, parseEther } from 'ethers/lib/utils';
import { Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

//available functions
describe("Token contract", async () => {

    let tokenDeployed: Contract;
    let router: Contract;
    let pairContract: Contract;
    let wBTC: Contract;
    let USDT: Contract;
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

    it("2. Deploy Contract", async () => {

        // INSTANCE CONTRACT
        router = await connectRouter()
        wBTC = await connectWBTC_ETH()
        USDT = await connectUSDT_ETH()

        //const routerFactory = await connectFactory()
        //const bnbContract = await connectWBNB()
        //const busdContract = await connectBUSD()

        // DEPLOY
        // ITERABLE MAPPING
        const iterableMappingFactory = await ethers.getContractFactory("IterableMapping")
        const IterableMappingDeployed = await iterableMappingFactory.deploy()
        await IterableMappingDeployed.deployed()
        console.log({
            IterableMappingDeployed: IterableMappingDeployed.address
        })

        const contractName = 'ZoeToken'
        const tokenFactory = await ethers.getContractFactory(contractName, {
            libraries: {
                IterableMapping: IterableMappingDeployed.address
            },
        });

        tokenDeployed = await tokenFactory.deploy()
        await tokenDeployed.deployed()

    });


    it("3. Add Liquidity", async () => {
        await tokenDeployed.approve(chains.eth.router, ethers.constants.MaxUint256, { from: deployer?.address })
        const amountToken = parseEther('4000000');
        const amountBNB = parseEther('50');
        const tx = await router.connect(deployer).addLiquidityETH(
            tokenDeployed.address,
            amountToken,
            amountToken,
            amountBNB,
            deployer?.address,
            2648069985, // Saturday, 29 November 2053 22:59:45
            {
                value: amountBNB,
            }
        )
        console.log(`${colors.cyan('TX')}: ${colors.yellow(tx.hash)}`)
        console.log()

        const routerFactory = await connectFactory();
        const pairAddress = await routerFactory.getPair(chains.eth.wChainCoin, tokenDeployed.address)
        pairContract = await connectPair(pairAddress);
        console.log(`${colors.cyan('LP Address')}: ${colors.yellow(pairContract?.address)}`)
        console.log(`${colors.cyan('LP Balance')}: ${colors.yellow(formatEther(await pairContract.balanceOf(deployer?.address)))}`)
        expect(1).to.be.eq(1);


        const tokenPriceETH = await getAmountsOut(tokenDeployed.address, chains.eth.wChainCoin, router, parseEther("1"))
        const tokenPriceUSDT = await getAmountsOut(chains.eth.wChainCoin, chains.eth.USDT, router, tokenPriceETH)
        console.log(`${colors.cyan('tokenPriceETH')}: ${colors.yellow(formatEther(tokenPriceETH))}`)
        console.log(`${colors.cyan('tokenPriceUSDT')}: ${colors.yellow(tokenPriceUSDT)}`)


        console.log()
    });

    it("4. Enable trading", async () => {
        await tokenDeployed.enableTrading();
        console.log()
    });


    it("5. Buy Bob", async () => {

        console.log()
        //--- BUY
        console.log(`${colors.magenta('Bob')} ${colors.cyan('Tokens')} ${colors.red('Before Swap')} ${colors.yellow(formatEther(await tokenDeployed.balanceOf(bob.address)))}`)
        console.log(`${colors.magenta('Bob')} ${colors.cyan('wBTC')} ${colors.red('Before Swap')} ${colors.yellow(formatEther(await wBTC.balanceOf(bob.address)))}`)
        console.log(`${colors.magenta('Contract')} ${colors.cyan('Tokens')} ${colors.red('Before Swap')} ${colors.yellow(formatEther(await tokenDeployed.balanceOf(tokenDeployed.address)))}`)
        console.log(`${colors.magenta('Contract')} ${colors.cyan('ETH')} ${colors.red('Before Swap')} ${colors.yellow(formatEther(await ethers.provider.getBalance(tokenDeployed.address)))}`)
        console.log()
        console.log()

        await swapExactETHForTokens(tokenDeployed.address, router, bob, parseEther("5"));

        console.log(`${colors.magenta('Bob')} ${colors.cyan('Tokens')} ${colors.green('After Swap')} ${colors.yellow(formatEther(await tokenDeployed.balanceOf(bob.address)))}`)
        console.log(`${colors.magenta('Bob')} ${colors.cyan('wBTC')} ${colors.green('After Swap')} ${colors.yellow(formatEther(await wBTC.balanceOf(bob.address)))}`)
        console.log(`${colors.magenta('Contract')} ${colors.cyan('Tokens')} ${colors.green('After Swap')} ${colors.yellow(formatEther(await tokenDeployed.balanceOf(tokenDeployed.address)))}`)
        console.log(`${colors.magenta('Contract')} ${colors.cyan('ETH')} ${colors.green('After Swap')} ${colors.yellow(formatEther(await ethers.provider.getBalance(tokenDeployed.address)))}`)

        console.log()
        console.log()
    });


    it("6. Sell Bob", async () => {
        //--- SELL

        await tokenDeployed.connect(bob).approve(router.address, parseEther("43000000"))
        console.log(`${colors.magenta('Bob')} ${colors.cyan('Tokens')} ${colors.red('Before Swap')} ${colors.yellow(formatEther(await tokenDeployed.balanceOf(bob.address)))}`)
        console.log(`${colors.magenta('Bob')} ${colors.cyan('wBTC')} ${colors.red('Before Swap')} ${colors.yellow(formatEther(await wBTC.balanceOf(bob.address)))}`)
        console.log(`${colors.magenta('Contract')} ${colors.cyan('Tokens')} ${colors.red('Before Swap')} ${colors.yellow(formatEther(await tokenDeployed.balanceOf(tokenDeployed.address)))}`)
        console.log(`${colors.magenta('Contract')} ${colors.cyan('ETH')} ${colors.red('Before Swap')} ${colors.yellow(formatEther(await ethers.provider.getBalance(tokenDeployed.address)))}`)
        console.log()
        console.log()
 

        await swapExactTokensForTokensSupportingFeeOnTransferTokens(tokenDeployed.address, router, bob, parseEther("100000")); // 100 tokens
        //await swapExactTokensForETH(tokenDeployed.address, router, bob, parseEther("10000")); // 100 tokens

        console.log(`${colors.magenta('Bob')} ${colors.cyan('Tokens')} ${colors.green('After Swap')} ${colors.yellow(formatEther(await tokenDeployed.balanceOf(bob.address)))}`)
        console.log(`${colors.magenta('Bob')} ${colors.cyan('wBTC')} ${colors.green('After Swap')} ${colors.yellow(formatEther(await wBTC.balanceOf(bob.address)))}`)
        console.log(`${colors.magenta('Contract')} ${colors.cyan('Tokens')} ${colors.green('After Swap')} ${colors.yellow(formatEther(await tokenDeployed.balanceOf(tokenDeployed.address)))}`)
        console.log(`${colors.magenta('Contract')} ${colors.cyan('ETH')} ${colors.green('After Swap')} ${colors.yellow(formatEther(await ethers.provider.getBalance(tokenDeployed.address)))}`)

        console.log()
        console.log()
    });

    it("6. Sell Bob 2", async () => {
        //--- SELL

        await tokenDeployed.connect(bob).approve(router.address, parseEther("43000000"))
        console.log(`${colors.magenta('Bob')} ${colors.cyan('Tokens')} ${colors.red('Before Swap')} ${colors.yellow(formatEther(await tokenDeployed.balanceOf(bob.address)))}`)
        console.log(`${colors.magenta('Bob')} ${colors.cyan('wBTC')} ${colors.red('Before Swap')} ${colors.yellow(formatEther(await wBTC.balanceOf(bob.address)))}`)
        console.log(`${colors.magenta('Contract')} ${colors.cyan('Tokens')} ${colors.red('Before Swap')} ${colors.yellow(formatEther(await tokenDeployed.balanceOf(tokenDeployed.address)))}`)
        console.log(`${colors.magenta('Contract')} ${colors.cyan('ETH')} ${colors.red('Before Swap')} ${colors.yellow(formatEther(await ethers.provider.getBalance(tokenDeployed.address)))}`)
        console.log()
        console.log()
 

        await swapExactTokensForTokensSupportingFeeOnTransferTokens(tokenDeployed.address, router, bob, parseEther("100")); // 100 tokens
        //await swapExactTokensForETH(tokenDeployed.address, router, bob, parseEther("10000")); // 100 tokens

        console.log(`${colors.magenta('Bob')} ${colors.cyan('Tokens')} ${colors.green('After Swap')} ${colors.yellow(formatEther(await tokenDeployed.balanceOf(bob.address)))}`)
        console.log(`${colors.magenta('Bob')} ${colors.cyan('wBTC')} ${colors.green('After Swap')} ${colors.yellow(formatEther(await wBTC.balanceOf(bob.address)))}`)
        console.log(`${colors.magenta('Contract')} ${colors.cyan('Tokens')} ${colors.green('After Swap')} ${colors.yellow(formatEther(await tokenDeployed.balanceOf(tokenDeployed.address)))}`)
        console.log(`${colors.magenta('Contract')} ${colors.cyan('ETH')} ${colors.green('After Swap')} ${colors.yellow(formatEther(await ethers.provider.getBalance(tokenDeployed.address)))}`)

        console.log()
        console.log()
    });
});