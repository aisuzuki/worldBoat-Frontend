//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import { WorldBoatClimateActions, ClimateActionStats } from "./WorldBoatClimateActions.sol";

import "hardhat/console.sol";

/*
 */
contract WorldBoatProtocol {
	struct CO2OffsetProject {
		address projectOwner;
		uint co2OffsetPlanned;
		uint tokenAmountRequired;
		uint projectRegisteredDateTimestamp;
		uint projectId;
		uint regionalCode;
		uint category;
		bool isProjectOpen;
		string metadataProject;
	}

	address private _manager;

	event ProjectCreated(CO2OffsetProject project);

	mapping(uint => CO2OffsetProject) private _projects;
	mapping(address => bool) public _trustedProjects;

	WorldBoatClimateActions private _worldBoatClimateActions;

	constructor() {
		_manager = msg.sender;
	}

	function setup(address _worldBoatClimateActionsAddress) public {
		_worldBoatClimateActions = WorldBoatClimateActions(
			_worldBoatClimateActionsAddress
		);
	}

	function createProject(
		uint _co2OffsetPlanned,
		uint _tokenAmountRequired,
		uint _projectId,
		uint _regionalCode,
		uint _category,
		string calldata _metadataProject
	) public {
		require(
			_projects[_projectId].projectOwner == address(0),
			"Project already exists"
		);

		_projects[_projectId] = CO2OffsetProject(
			msg.sender,
			_co2OffsetPlanned,
			_tokenAmountRequired,
			block.timestamp,
			_projectId,
			_regionalCode,
			_category,
			true,
			_metadataProject
		);
		console.log("trusted = %s", _trustedProjects[msg.sender]);
		console.log(
			"currentTokenId = %s",
			_worldBoatClimateActions.currentTokenId()
		);

		//		if (!_trustedProjects[msg.sender]) return;

		for (
			uint tokenId = 1; // 1 origin
			tokenId <= _worldBoatClimateActions.currentTokenId();
			tokenId++
		) {
			console.log("tokenId = %d", tokenId);
			ClimateActionStats memory stat = _worldBoatClimateActions
				.getTokenStats(tokenId);

			if (stat.projectId == 0 || stat.projectId == _projectId) {
				// open to any projects, or project Id matchs
				if (stat.category == _category) {
					uint offset = _co2OffsetPlanned;
					if (stat.co2OffsetPlanned <= _co2OffsetPlanned) {
						offset = stat.co2OffsetPlanned;
						_projects[_projectId].co2OffsetPlanned =
							_co2OffsetPlanned -
							stat.co2OffsetPlanned;
					}
					_worldBoatClimateActions.projectFulfillment(
						tokenId,
						offset,
						_metadataProject
					);
				}
			}
		}

		emit ProjectCreated(_projects[_projectId]);
	}

	function closeProject(uint _projectId) public {
		require(
			_projects[_projectId].projectOwner != address(0),
			"Project does not exist"
		);
		require(
			msg.sender == _projects[_projectId].projectOwner,
			"Only project owner can close the project"
		);
		_projects[_projectId].isProjectOpen = false;
	}

	function getProject(
		uint _projectId
	) public view returns (CO2OffsetProject memory) {
		return _projects[_projectId];
	}

	function addTrustedProject(address projectAddress) public {
		// some kind of validation
		require(
			msg.sender == _manager,
			"Only manager can add a trusted project"
		);
		_trustedProjects[projectAddress] = true;
	}
}
