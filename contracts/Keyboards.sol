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

    event KeyboardCreated(Keyboard keyboard);
    event TipSent(address recipient, uint256 amount);

    Keyboard[] public createdKeyboards;

    function create(
        KeyboardKind _kind,
        bool _isPBT,
        string calldata _filter
    ) external {
        Keyboard memory _keyboard = Keyboard({kind: _kind, isPBT: _isPBT, filter: _filter, owner: msg.sender});
        createdKeyboards.push(_keyboard);
        emit KeyboardCreated(_keyboard);
    }

    function tip(uint256 _index) external payable {
        address payable _owner = payable(createdKeyboards[_index].owner);
        uint value = msg.value;
        if (_owner != address(0) || _owner != msg.sender) {
            _owner.transfer(value);
            emit TipSent(_owner, value);
        }
    }

    function getKeyboards() public view returns (Keyboard[] memory) {
        return createdKeyboards;
    }
}
