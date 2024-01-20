import { BigNumber } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

const createPool = async (
  factory, // instance of UniswapV3Factory
  tokenA: string,
  tokenB: string,
  fee: BigNumber,
  signer: SignerWithAddress
): Promise<{
  poolAddress: string
}> => {
  const tx = await factory.connect(signer).createPool(tokenA, tokenB, fee)
  const receipt = await tx.wait()
  const event = receipt.events?.find((event) => event.event === 'PoolCreated')

  return {
    poolAddress: event?.args?.pool,
  }
}

const initializePool = async (
  pool, // instance of UniswapV3Pool
  sqrtPriceX96: BigNumber,
  signer: SignerWithAddress
) => {
  const tx = await pool.connect(signer).initialize(sqrtPriceX96)
  await tx.wait()
}

export { createPool, initializePool }
