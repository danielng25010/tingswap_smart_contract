# TingSwap V3 Periphery

## Pool

Each pool in Uniswap V3 is represent by 3 parameter: token0, token1 and fee (0.05%, 0.30%, and 1%) depend on the volatility of both assets.

### Create Pool

```typescript
const createPool = async (
  factory, // instance of UniswapV3Factory
  tokenA: string,
  tokenB: string,
  fee: BigNumber,
  signer: SignerWithAddress
): Promise<{
  poolAddress: string
}>
```

Parameters:

- factory: An instance of UniswapV3Factory, using typechain to generate this type and attach to the contract.
- tokenA: first token address
- tokenB: second token address
- fee: swap fee for the pair

### Initialize

After created, the pool need to be initialize the initial price of it.

```typescript
const initializePool = async (
  pool, // instance of UniswapV3Pool
  sqrtPriceX96: BigNumber,
  signer: SignerWithAddress
)
```

Parameters:

- sqrtPriceX96: price of A/B in format of Q96 number

## Add liquidity

Reference: `scripts/liquidity.ts`

Uniswap V3 use NFT to represent a liquidity position. Each NFT is distinguished by tokenId and has its own parameter:

- `tickLower` and `tickUpper`: represent price range the position
- `liquidity`: how much liquidity that position provided

Since each position is represent by an NFT, when user first provide liquidity, they need to mint their NFT first

### Mint

```typescript
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
}
```

Parameter:

- `nft`: An instance of `NonfungiblePositionManager` contract, using typechain to generate this type and attach to the contract.
- `token0`: Address of first token in the pair
- `token1`: Address of second token in the pair
- `fee`: Fee specify for the pair
- `amount0Desired` and `amount1Desired`: maximum amount user can provide for the liquidity position for both token
- `amount0Min` and `amount1Min`: Think of a kind of slippage for adding liquidity, some other kind of txs can happen before our tx arrived, making the expected liquidity is not the same as the time we estimated.
- `tickLower` and `tickUpper`: price range for the liquidity position (mentioned above)
- `recipient`: Position NFT receiver
- `deadline`: Expired time of this request, if the tx is execute after this time, it'll be reverted

After having an NFT position, user can modify this position by `increaseLiquidity`, `decreaseLiquidity`

### Increase Liquidity

```typescript
const increaseLiquidity = async (
  nft: NonfungiblePositionManager,
  tokenId: BigNumber,
  amount0: BigNumber,
  amount1: BigNumber,
  amount0Min: BigNumber,
  amount1Min: BigNumber,
  deadline: number,
  signer: SignerWithAddress
): Promise<{
  tokenId: any
  liquidity: any
  amount0: any
  amount1: any
}>
```

Since each tokenId is represent for a position in one pair, we don't need to specify tokens and fee. Each token has its own tick price range, so we don't need to specify the price range aswell.
Parameters:

- `tokenId`: tokenId of the position we want to modify

### Decrease Liquidity

```typescript
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
}>
```

Parameters:

- `liquidity`: The amount of liquidity we want to remove from the position

After decreasing liquidity, token is not really transfer back to owner, it's accrued inside the position, we need to collect it.

### Collect

```typescript
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
}>
```

This function is also used for collect swap fee aswell. When using with `decreaseLiquidity`, it must be call together with `multicall` to reduce amount of transactions

### Burn

If a position's liquidity is all removed, we can burn it.All tokens must be collected first.

```typescript
const burn = async (
  nft: NonfungiblePositionManager,
  tokenId: BigNumber,
  signer: SignerWithAddress
)
```
