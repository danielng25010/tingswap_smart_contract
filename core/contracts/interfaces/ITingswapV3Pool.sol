// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.5.0;

import './pool/ITingswapV3PoolImmutables.sol';
import './pool/ITingswapV3PoolState.sol';
import './pool/ITingswapV3PoolDerivedState.sol';
import './pool/ITingswapV3PoolActions.sol';
import './pool/ITingswapV3PoolOwnerActions.sol';
import './pool/ITingswapV3PoolEvents.sol';

/// @title The interface for a Tingswap V3 Pool
/// @notice A Tingswap pool facilitates swapping and automated market making between any two assets that strictly conform
/// to the ERC20 specification
/// @dev The pool interface is broken up into many smaller pieces
interface ITingswapV3Pool is
    ITingswapV3PoolImmutables,
    ITingswapV3PoolState,
    ITingswapV3PoolDerivedState,
    ITingswapV3PoolActions,
    ITingswapV3PoolOwnerActions,
    ITingswapV3PoolEvents
{

}
