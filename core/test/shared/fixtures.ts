import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import { MockTimeTingswapV3Pool } from '../../typechain/MockTimeTingswapV3Pool'
import { TestERC20 } from '../../typechain/TestERC20'
import { TingswapV3Factory } from '../../typechain/TingswapV3Factory'
import { TestTingswapV3Callee } from '../../typechain/TestTingswapV3Callee'
import { TestTingswapV3Router } from '../../typechain/TestTingswapV3Router'
import { MockTimeTingswapV3PoolDeployer } from '../../typechain/MockTimeTingswapV3PoolDeployer'

import { Fixture } from 'ethereum-waffle'

interface FactoryFixture {
  factory: TingswapV3Factory
}

async function factoryFixture(): Promise<FactoryFixture> {
  const factoryFactory = await ethers.getContractFactory('TingswapV3Factory')
  const factory = (await factoryFactory.deploy()) as TingswapV3Factory
  return { factory }
}

interface TokensFixture {
  token0: TestERC20
  token1: TestERC20
  token2: TestERC20
}

async function tokensFixture(): Promise<TokensFixture> {
  const tokenFactory = await ethers.getContractFactory('TestERC20')
  const tokenA = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenB = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenC = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20

  const [token0, token1, token2] = [tokenA, tokenB, tokenC].sort((tokenA, tokenB) =>
    tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? -1 : 1
  )

  return { token0, token1, token2 }
}

type TokensAndFactoryFixture = FactoryFixture & TokensFixture

interface PoolFixture extends TokensAndFactoryFixture {
  swapTargetCallee: TestTingswapV3Callee
  swapTargetRouter: TestTingswapV3Router
  createPool(
    fee: number,
    tickSpacing: number,
    firstToken?: TestERC20,
    secondToken?: TestERC20
  ): Promise<MockTimeTingswapV3Pool>
}

// Monday, October 5, 2020 9:00:00 AM GMT-05:00
export const TEST_POOL_START_TIME = 1601906400

export const poolFixture: Fixture<PoolFixture> = async function (): Promise<PoolFixture> {
  const { factory } = await factoryFixture()
  const { token0, token1, token2 } = await tokensFixture()

  const MockTimeTingswapV3PoolDeployerFactory = await ethers.getContractFactory('MockTimeTingswapV3PoolDeployer')
  const MockTimeTingswapV3PoolFactory = await ethers.getContractFactory('MockTimeTingswapV3Pool')

  const calleeContractFactory = await ethers.getContractFactory('TestTingswapV3Callee')
  const routerContractFactory = await ethers.getContractFactory('TestTingswapV3Router')

  const swapTargetCallee = (await calleeContractFactory.deploy()) as TestTingswapV3Callee
  const swapTargetRouter = (await routerContractFactory.deploy()) as TestTingswapV3Router

  return {
    token0,
    token1,
    token2,
    factory,
    swapTargetCallee,
    swapTargetRouter,
    createPool: async (fee, tickSpacing, firstToken = token0, secondToken = token1) => {
      const mockTimePoolDeployer = (await MockTimeTingswapV3PoolDeployerFactory.deploy()) as MockTimeTingswapV3PoolDeployer
      const tx = await mockTimePoolDeployer.deploy(
        factory.address,
        firstToken.address,
        secondToken.address,
        fee,
        tickSpacing
      )

      const receipt = await tx.wait()
      const poolAddress = receipt.events?.[0].args?.pool as string
      return MockTimeTingswapV3PoolFactory.attach(poolAddress) as MockTimeTingswapV3Pool
    },
  }
}
