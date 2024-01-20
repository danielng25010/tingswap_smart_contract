import * as hre from 'hardhat'
import * as fs from 'fs'
import { Signer } from 'ethers'
const ethers = hre.ethers
// import { Config } from "./config";
import type { Contract, ContractFactory } from 'ethers'
import { TingswapV3Factory__factory, TingswapV3PoolDeployer__factory } from '../typechain'

async function main() {
  //Loading accounts
  const accounts: Signer[] = await ethers.getSigners()
  const deployer = await accounts[0].getAddress()
  //Loading contracts' factory

  const TingswapV3Factory = <TingswapV3Factory__factory>await ethers.getContractFactory('TingswapV3Factory')
  const TingswapV3PoolDeployer = <TingswapV3PoolDeployer__factory>(
    await ethers.getContractFactory('TingswapV3PoolDeployer')
  )

  // Deploy contracts
  console.log('==================================================================')
  console.log('DEPLOY CONTRACTS')
  console.log('==================================================================')

  console.log('ACCOUNT: ' + deployer)

  const tingswapV3Factory: Contract = await TingswapV3Factory.deploy()
  tingswapV3Factory.deployed()

  const tingswapV3PoolDeployer: Contract = await TingswapV3PoolDeployer.deploy()
  tingswapV3PoolDeployer.deployed()

  console.log('TingswapV3Factory deployed at: ', tingswapV3Factory.address)
  console.log('TingswapV3PoolDeployer deployed at: ', tingswapV3PoolDeployer.address)

  const contractAddress = {
    tingswapV3Factory: tingswapV3Factory.address,
    tingswapV3PoolDeployer: tingswapV3PoolDeployer.address,
  }

  fs.writeFileSync('contracts.json', JSON.stringify(contractAddress))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
