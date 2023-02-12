// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, upgrades } from "hardhat";

import test_util from "./util";
let deployer: SignerWithAddress | undefined;
let signers: SignerWithAddress[];

//available functions
async function main() {
  signers = await ethers.getSigners();
  deployer = signers[0];

  if (deployer) {

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
    const contractName = "GaiaLifeMotherV1";
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
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
