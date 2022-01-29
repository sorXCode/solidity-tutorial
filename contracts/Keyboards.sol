// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract Keyboards {
    enum KeyboardKind {
        SixtyPercent,
        SixtyFivePercent,
        SeventyFivePercent,
        EightyPercent,
        Iso105
    }

    struct Keyboard {
        KeyboardKind kind;
        // PBT or ABS
        bool isPBT;
        // filter for tailwind
        string filter;
        address owner;
    }

    Keyboard[] public createdKeyboards;

    function create(
        KeyboardKind _kind,
        bool _isPBT,
        string calldata _filter
    ) external {
        createdKeyboards.push(
            Keyboard({kind: _kind, isPBT: _isPBT, filter: _filter, owner: msg.sender})
        );
    }

    function tip(uint256 _index) external payable {
        address payable _owner = payable(createdKeyboards[_index]).owner;
        _owner.transfer(msg.value);
    }

    function getKeyboards() public view returns (Keyboard[] memory) {
        return createdKeyboards;
    }
}
