// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IMetaSwap.sol";
import "./ISwap.sol";

interface IMetaSwapDeposit {
    function initialize(
        ISwap _baseSwap,
        IMetaSwap _metaSwap,
        IERC20 _metaLPToken
    ) external;
}
