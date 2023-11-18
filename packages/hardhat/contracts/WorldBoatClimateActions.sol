//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import { ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

struct ClimateActionStats {
	address owner;
	uint co2OffsetPlanned;
	uint tokenAmountPaid;
	uint co2ActuallyOffset;
	uint fundingDateTimestamp;
	uint projectId;
	uint regionalCode;
	uint category;
	bool openFundingOrClosed;
	string metadataProject;
}

contract WorldBoatClimateActions is
	ERC721Enumerable,
	ERC721URIStorage,
	Ownable
{
	mapping(uint256 => ClimateActionStats) private _tokenStats;

	address public treasuryAddress;

	uint public currentTokenId = 0;

	constructor(address _treasuryAddress) ERC721("WorldBoat", "Wo") Ownable() {
		treasuryAddress = _treasuryAddress;
	}

	function safeMint(
		address to,
		string memory uri,
		uint co2OffsetPlanned,
		uint projectId,
		uint regionalCode,
		uint category,
		bool openFundingOrClosed,
		address erc20Token,
		uint tokenAmount
	) public onlyOwner {
		console.log("sender = ", msg.sender);
		require(
			IERC20(erc20Token).transferFrom(
				msg.sender,
				treasuryAddress,
				tokenAmount
			),
			"Transfer failed"
		);

		currentTokenId = currentTokenId + 1;
		_safeMint(to, currentTokenId);
		_setTokenURI(currentTokenId, uri);

		ClimateActionStats memory stats = ClimateActionStats({
			owner: to,
			co2OffsetPlanned: co2OffsetPlanned,
			tokenAmountPaid: tokenAmount,
			co2ActuallyOffset: 0,
			fundingDateTimestamp: block.timestamp,
			projectId: projectId,
			regionalCode: regionalCode,
			category: category,
			openFundingOrClosed: openFundingOrClosed,
			metadataProject: ""
		});

		_tokenStats[currentTokenId] = stats;
	}

	function projectFulfillment(
		uint _tokenId,
		uint _co2Fulfilled,
		string memory _metadataFullfillment
	) external {
		require(
			msg.sender == treasuryAddress,
			"Unauthorized Access! Protocol only"
		);
		require(
			_co2Fulfilled <= _tokenStats[_tokenId].co2OffsetPlanned,
			"Goal already reached!"
		);
		_tokenStats[_tokenId].co2ActuallyOffset += _co2Fulfilled;
		_tokenStats[_tokenId].co2OffsetPlanned -= _co2Fulfilled;
		_tokenStats[_tokenId].metadataProject = _metadataFullfillment;
	}

	function safeMint(address to, ClimateActionStats memory stats) internal {
		currentTokenId = currentTokenId + 1;
		_safeMint(to, currentTokenId);
		_tokenStats[currentTokenId] = stats;
	}

	// The following functions are overrides required by Solidity.

	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 tokenId,
		uint256 batchSize
	) internal override(ERC721, ERC721Enumerable) {
		super._beforeTokenTransfer(from, to, tokenId, batchSize);
	}

	function _burn(
		uint256 tokenId
	) internal override(ERC721, ERC721URIStorage) {
		super._burn(tokenId);
	}

	function getTokenStats(
		uint256 tokenId
	) public view returns (ClimateActionStats memory) {
		return _tokenStats[tokenId];
	}

	function supportsInterface(
		bytes4 interfaceId
	) public view override(ERC721, ERC721Enumerable) returns (bool) {
		return super.supportsInterface(interfaceId);
	}

	function tokenURI(
		uint256 tokenId
	) public view override(ERC721, ERC721URIStorage) returns (string memory) {
		require(
			_exists(tokenId),
			"ERC721URIStorage: URI query for nonexistent token"
		);

		ClimateActionStats memory stats = _tokenStats[tokenId];
		bytes memory js = abi.encodePacked(
			'{"name": "Climate Action Certificate #',
			uint2str(tokenId),
			'", "co2OffsetPlanned": ',
			uint2str(stats.co2OffsetPlanned),
			', "tokenAmountPaid": ',
			uint2str(stats.tokenAmountPaid),
			', "co2ActuallyOffset": ',
			uint2str(stats.co2ActuallyOffset),
			', "fundingDateTimestamp": ',
			uint2str(stats.fundingDateTimestamp),
			', "projectId": ',
			uint2str(stats.projectId),
			', "regionalCode": ',
			uint2str(stats.regionalCode),
			', "category": ',
			uint2str(stats.category),
			', "openFundingOrClosed": ',
			bool2str(stats.openFundingOrClosed),
			"}"
		);

		return string(abi.encodePacked("data:application/json;base64,", js));
	}

	// Helper function to convert uint to string
	function uint2str(uint _i) internal pure returns (string memory) {
		if (_i == 0) {
			return "0";
		}
		uint j = _i;
		uint len;
		while (j != 0) {
			len++;
			j /= 10;
		}
		bytes memory bstr = new bytes(len);
		uint k = len - 1;
		while (_i != 0) {
			bstr[k--] = bytes1(uint8(48 + (_i % 10)));
			_i /= 10;
		}
		return string(bstr);
	}

	// Helper function to convert bool to string
	function bool2str(bool _b) internal pure returns (string memory) {
		return _b ? "true" : "false";
	}
}
