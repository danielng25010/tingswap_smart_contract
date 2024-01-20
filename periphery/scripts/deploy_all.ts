import * as hre from 'hardhat'
import * as fs from 'fs'
import { Signer } from 'ethers'
const ethers = hre.ethers
import { Config } from './config'
import type { Contract, ContractFactory } from 'ethers'
import {
  WETH9__factory,
  SwapRouter__factory,
  NonfungiblePositionManager__factory,
  NonfungibleTokenPositionDescriptor__factory,
  QuoterV2__factory,
  NFTDescriptor__factory,
} from '../typechain'

async function main() {
  //Loading accounts
  const accounts: Signer[] = await ethers.getSigners()
  const deployer = await accounts[0].getAddress()
  //Loading contracts' factory

  const WHLUSD = <WETH9__factory>await ethers.getContractFactory('WETH9')
  const SwapRouter = <SwapRouter__factory>await ethers.getContractFactory('SwapRouter')
  const NonfungiblePositionManager = <NonfungiblePositionManager__factory>(
    await ethers.getContractFactory('NonfungiblePositionManager')
  )
  const QuoterV2 = <QuoterV2__factory>await ethers.getContractFactory('QuoterV2')
  const NFTDescriptor = <NFTDescriptor__factory>await ethers.getContractFactory('NFTDescriptor')

  const nftDescriptor = await NFTDescriptor.deploy()
  await nftDescriptor.deployed()

  const NonfungibleTokenPositionDescriptor = <NonfungibleTokenPositionDescriptor__factory>(
    await ethers.getContractFactory('NonfungibleTokenPositionDescriptor', {
      libraries: {
        NFTDescriptor: nftDescriptor.address,
      },
    })
  )

  // Deploy contracts
  console.log('==================================================================')
  console.log('DEPLOY CONTRACTS')
  console.log('==================================================================')

  console.log('ACCOUNT: ' + deployer)

  const wHLUSD = await WHLUSD.deploy()
  await wHLUSD.deployed()

  const swapRouter = await SwapRouter.deploy(Config.factory, wHLUSD.address)
  await swapRouter.deployed()

  const nonfungibleTokenPositionDescriptor = await NonfungibleTokenPositionDescriptor.deploy(
    wHLUSD.address,
    'HELA' // Native token symbol - HELA???
  )
  await nonfungibleTokenPositionDescriptor.deployed()

  const nonfungiblePositionManager = await NonfungiblePositionManager.deploy(
    Config.factory,
    wHLUSD.address,
    wHLUSD.address
  )
  await nonfungiblePositionManager.deployed()

  const quoter = await QuoterV2.deploy(Config.factory, wHLUSD.address)
  await quoter.deployed()

  console.log('SwapRouter deployed at: ', swapRouter.address)
  console.log('NonfungibleTokenPositionDescriptor deployed at', nonfungibleTokenPositionDescriptor.address)
  console.log('NonfungiblePositionManager deployed at: ', nonfungiblePositionManager.address)
  console.log('WETH9 deployed at: ', wHLUSD.address)
  console.log('Quoter deployed at: ', quoter.address)

  const contractAddress = {
    SwapRouter: swapRouter.address,
    NonfungiblePositionManager: nonfungiblePositionManager.address,
    NonfungibleTokenPositionDescriptor: nonfungibleTokenPositionDescriptor.address,
    Quoter: quoter.address,
    wHLUSD: wHLUSD.address,
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
