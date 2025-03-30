// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Scholarship {
    
    struct Request {
        address student;
        string document;
        bool isVerified;
        bool isFundReleased;
    }

    address public governmentOfficer;
    address public financer;
    uint public fundAmount = 0.1 ether; 

    Request[] public requests;

    constructor(address _governmentOfficer, address _financer) {
        governmentOfficer = _governmentOfficer;
        financer = _financer;
    }

    modifier onlyGovernmentOfficer() {
        require(msg.sender == governmentOfficer, "Only government officer can perform this action");
        _;
    }

    modifier onlyFinancer() {
        require(msg.sender == financer, "Only financer can release funds");
        _;
    }

    function submitRequest(string memory documentLink) public {
        Request memory newRequest = Request({
            student: msg.sender,
            document: documentLink,
            isVerified: false,
            isFundReleased: false
        });
        requests.push(newRequest);
    }

    function verifyRequest(uint requestId) public onlyGovernmentOfficer {
        Request storage request = requests[requestId];
        require(!request.isVerified, "Request already verified");
        request.isVerified = true;
    }

    function releaseFunds(uint requestId) public payable onlyFinancer {
        Request storage request = requests[requestId];
        require(request.isVerified, "Request not verified");
        require(!request.isFundReleased, "Funds already released");
        require(address(this).balance >= fundAmount, "Insufficient contract balance");

        payable(request.student).transfer(fundAmount);
        request.isFundReleased = true;
    }

    function depositFunds() public payable {}

    function getRequests() public view returns (Request[] memory) {
        return requests;
    }

    receive() external payable {}
}
