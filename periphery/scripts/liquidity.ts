import { BigNumber } from 'ethers'
import { NonfungiblePositionManager } from '../typechain'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

const mint = async (
  nft: NonfungiblePositionManager,
  token0: string,
  token1: string,
  fee: BigNumber,
  amount0Desired: BigNumber,
  amount1Desired: BigNumber,
  amount0Min: BigNumber,
  amount1Min: BigNumber,
  tickLower: number,
  tickUpper: number,
  recipient: string,
  deadline: number,
  signer: SignerWithAddress
): Promise<{
  tokenId: any
  liquidity: any
  amount0: any
  amount1: any
}> => {
  const tx = await nft.connect(signer).mint({
    token0,
    token1,
    fee,
    amount0Desired,
    amount1Desired,
    amount0Min,
    amount1Min,
    tickLower,
    tickUpper,
    recipient,
    deadline,
  })
  const receipt = await tx.wait()
  const event = receipt.events?.find((event) => event.event === 'Mint')

  return {
    tokenId: event?.args?.tokenId,
    liquidity: event?.args?.liquidity,
    amount0: event?.args?.amount0,
    amount1: event?.args?.amount1,
  }
}

const increaseLiquidity = async (
  nft: NonfungiblePositionManager,
  tokenId: BigNumber,
  amount0Desired: BigNumber,
  amount1Desired: BigNumber,
  amount0Min: BigNumber,
  amount1Min: BigNumber,
  deadline: number,
  signer: SignerWithAddress
): Promise<{
  tokenId: any
  liquidity: any
  amount0: any
  amount1: any
}> => {
  const tx = await nft.connect(signer).increaseLiquidity({
    tokenId,
    amount0Desired,
    amount1Desired,
    amount0Min,
    amount1Min,
    deadline,
  })
  const receipt = await tx.wait()
  const event = receipt.events?.find((event) => event.event === 'IncreaseLiquidity')
  return {
    tokenId: event?.args?.tokenId,
    liquidity: event?.args?.liquidity,
    amount0: event?.args?.amount0,
    amount1: event?.args?.amount1,
  }
}

const decreaseLiquidity = async (
  nft: NonfungiblePositionManager,
  tokenId: BigNumber,
  liquidity: BigNumber,
  amount0Min: BigNumber,
  amount1Min: BigNumber,
  deadline: number,
  signer: SignerWithAddress
): Promise<{
  tokenId: any
  liquidity: any
  amount0: any
  amount1: any
}> => {
  const tx = await nft.connect(signer).decreaseLiquidity({
    tokenId,
    liquidity,
    amount0Min,
    amount1Min,
    deadline,
  })
  const receipt = await tx.wait()
  const event = receipt.events?.find((event) => event.event === 'DecreaseLiquidity')
  return {
    tokenId: event?.args?.tokenId,
    liquidity: event?.args?.liquidity,
    amount0: event?.args?.amount0,
    amount1: event?.args?.amount1,
  }
}

const collect = async (
  nft: NonfungiblePositionManager,
  tokenId: BigNumber,
  recipient: string,
  amount0Max: BigNumber,
  amount1Max: BigNumber,
  signer: SignerWithAddress
): Promise<{
  tokenId: any
  recipient: any
  amount0: any
  amount1: any
}> => {
  const tx = await nft.connect(signer).collect({
    tokenId,
    recipient,
    amount0Max,
    amount1Max,
  })
  const receipt = await tx.wait()
  const event = receipt.events?.find((event) => event.event === 'Collect')
  return {
    tokenId: event?.args?.tokenId,
    recipient: event?.args?.recipient,
    amount0: event?.args?.amount0,
    amount1: event?.args?.amount1,
  }
}

const burn = async (nft: NonfungiblePositionManager, tokenId: BigNumber, signer: SignerWithAddress) => {
  const tx = await nft.connect(signer).burn(tokenId)
  await tx.wait()
}

export { mint, increaseLiquidity, decreaseLiquidity, collect, burn }
