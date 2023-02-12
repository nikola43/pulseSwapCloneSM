import { ethers } from 'hardhat'
const test_util = require('./util');
const colors = require('colors');
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';

//available functions
describe("Token contract", async () => {
    let deployer: SignerWithAddress;
    let bob: SignerWithAddress;
    let alice: SignerWithAddress;
    let tykheLuckyOracle: Contract;
    let cronusTimeKeeper: Contract;
    let floraRandomRGBGenerator: Contract;
    let charonSoulBrige: Contract;
    let midasGoldKing: Contract;
    let gaiaLifeMother: Contract;
    let router: Contract;
    let metastockDeployed: Contract;
    let pairContract: Contract;



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

        // INSTANCE CONTRACT
        router = await test_util.connectRouter();
    });

    it("2. Deploy TykheLuckyOracle", async () => {
        const contractName = "TykheLuckyOracle";
        const args = [
            "0x6A2AAd07396B36Fe02a22b33cf443582f682c82f",
            "0x84b9b910527ad5c03a9ca831909e21e236ea7b06",
            "0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314"
        ];
        tykheLuckyOracle = await test_util.deployProxyV2(contractName, false, args);
        expect(1).to.be.eq(1);
    });

    it("3. Deploy CronusTimeKeeper", async () => {
        const contractName = "CronusTimeKeeper";
        const args = [
            tykheLuckyOracle.address
        ];
        cronusTimeKeeper = await test_util.deployProxyV2(contractName, false, args);
        console.log(cronusTimeKeeper.address);
        expect(1).to.be.eq(1);
    });

    it("4. Deploy FloraRandomRGBGenerator", async () => {
        const contractName = "FloraRandomRGBGenerator";
        const args = [
            tykheLuckyOracle.address
        ];
        floraRandomRGBGenerator = await test_util.deployProxyV2(contractName, false, args);
        expect(1).to.be.eq(1);
    });

    it("5. Deploy CharonSoulBrige", async () => {
        const contractName = "CharonSoulBrige";
        charonSoulBrige = await test_util.deployProxyV2(contractName, false, []);
        console.log(charonSoulBrige.address);
        expect(1).to.be.eq(1);
    });

    it("6. Deploy MidasGoldKing", async () => {
        const contractName = "MidasGoldKing";
        const args = [
            "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526", // gold
            "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526", // kindom coin
            "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3", // router
            97,
            true
        ];
        midasGoldKing = await test_util.deployProxyV2(contractName, false, args);
        expect(1).to.be.eq(1);
    });

    it("7. Deploy GaiaLifeMotherV2", async () => {
        const contractName = "GaiaLifeMotherV2";
        const args = [
            tykheLuckyOracle.address,
            floraRandomRGBGenerator.address,
            midasGoldKing.address
        ];
        gaiaLifeMother = await test_util.deployProxyV2(contractName, false, args);
        console.log(gaiaLifeMother.address);


        expect(1).to.be.eq(1);
    });

    it("8. Deploy MetaStocks", async () => {
        const metastockFactory = await ethers.getContractFactory("MetaStocks")
        metastockDeployed = await metastockFactory.deploy()
        await metastockDeployed.deployed()

        console.log("MetaStocks address: ", metastockDeployed.address);

        router = await test_util.connectRouter()

        const routerFactory = await test_util.connectFactory();
        const pairAddress = await routerFactory.getPair(test_util.chains.bsc.wChainCoin, metastockDeployed.address)
        pairContract = await test_util.connectPair(pairAddress);
        console.log(`${colors.cyan('Token Address')}: ${colors.yellow(metastockDeployed?.address)}`)
        console.log(`${colors.cyan('LP Address')}: ${colors.yellow(pairContract?.address)}`)
        //console.log(`${colors.cyan('LP Balance')}: ${colors.yellow(formatEther(await pairContract.balanceOf(deployer?.address)))}`)
        expect(1).to.be.eq(1);
    });

    it("9. MidasGoldKing -> getNativeTokenAddress", async () => {
        const nativeTokenAddress = await midasGoldKing.getNativeTokenAddress()
        console.log({ nativeTokenAddress });
        expect(1).to.be.eq(1);
    });

    it("10. MidasGoldKing -> isPayingWithNativeCurrency", async () => {
        let paymentTokenAddress = "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd";
        let isPayingWithNativeCurrency = await midasGoldKing.isPayingWithNativeCurrency(
            paymentTokenAddress
        )
        console.log({ isPayingWithNativeCurrency });
        expect(isPayingWithNativeCurrency).to.be.eq(true);

        paymentTokenAddress = "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7";
        isPayingWithNativeCurrency = await midasGoldKing.isPayingWithNativeCurrency(
            paymentTokenAddress
        )
        console.log({ isPayingWithNativeCurrency });
        expect(isPayingWithNativeCurrency).to.be.eq(false);
    });


    it("11. MidasGoldKing -> getNativeNetworkCurrencyPriceInUsd", async () => {
        let nativeNetworkCurrencyPriceInUsd = await midasGoldKing.getNativeNetworkCurrencyPriceInUsd()
        console.log({ nativeNetworkCurrencyPriceInUsd });
        expect(nativeNetworkCurrencyPriceInUsd).to.be.gt(0);
    });

    it("12. MidasGoldKing -> getRequiredEthAmount", async () => {
        let requiredEthAmount = await midasGoldKing.getRequiredEthAmount()
        console.log({ requiredEthAmount });
        expect(requiredEthAmount).to.be.gt(0);
    });

    it("13. Add Liquidity MetaStocks", async () => {
        //await metastockDeployed.approve(test_util.chains.bsc.router, ethers.constants.MaxUint256, { from: deployer?.address })
        await metastockDeployed.connect(deployer).approve(test_util.chains.bsc.router, ethers.constants.MaxUint256)
        const tx = await router.connect(deployer).addLiquidityETH(
            metastockDeployed.address,
            parseEther("100000"),
            parseEther("100000"),
            parseEther("10"),
            deployer?.address,
            2648069985, // Saturday, 29 November 2053 22:59:45
            {
                value: parseEther("10"),
            }
        )
        console.log(`${colors.cyan('TX')}: ${colors.yellow(tx.hash)}`)
        console.log()

        const routerFactory = await test_util.connectFactory();
        const pairAddress = await routerFactory.getPair(test_util.chains.bsc.wChainCoin, metastockDeployed.address)
        pairContract = await test_util.connectPair(pairAddress);
        console.log(`${colors.cyan('LP Address')}: ${colors.yellow(pairContract?.address)}`)
        console.log(`${colors.cyan('LP Balance')}: ${colors.yellow(formatEther(await pairContract.balanceOf(deployer?.address)))}`)
        expect(1).to.be.eq(1);
        console.log()
    });

    it("14. Buy Bob", async () => {

        console.log()
        //--- BUY
        console.log(`${colors.cyan('Contract token Balance Before Swap')}: ${colors.yellow(formatEther(await metastockDeployed.balanceOf(metastockDeployed.address)))}`)
        await test_util.swapExactETHForTokens(metastockDeployed.address, router, deployer, parseEther("0.5"));
        console.log(`${colors.cyan('Bob token Balance After Swap')}: ${colors.yellow(formatEther(await metastockDeployed.balanceOf(bob?.address)))}`)
        console.log(`${colors.cyan('Contract token Balance After')}: ${colors.yellow(formatEther(await metastockDeployed.balanceOf(metastockDeployed.address)))}`)
        expect(1).to.be.eq(1);
        console.log()
    });

    it("13. GaiaLifeMother -> Create Token BUSD", async () => {

        const paymentTokenAddress = metastockDeployed.address;
        const tokenOwner = deployer.address;
        const tokenName = "TEST";
        const tokenSymbol = "TST";
        const supply = 1000000000000000;

        await metastockDeployed.connect(deployer).approve(gaiaLifeMother.address, ethers.constants.MaxUint256)

        await gaiaLifeMother.connect(deployer).createNewToken(
            paymentTokenAddress,
            tokenOwner,
            tokenName,
            tokenSymbol,
            supply
        )
        expect(1).to.be.eq(1);
    });

});

