pragma solidity >= 0.5.2;
import "remix_tests.sol"; // this import is automatically injected by Remix.
import "../contracts/Rfp.sol";

contract RfpTest {
    Rfp contractInstance;

    function beforeEach() public {
        contractInstance = new Rfp();
    }

    function testAdmin() public {
        Assert.equal(contractInstance.isAdmin(msg.sender), true, "Deployer should be the admin");
    }

    function testAddAdmin() public {
        contractInstance.addAdmin("Admin 2", 35, "Admin Supervisor");
        uint adminCount = contractInstance.getAdminCount();
        Assert.equal(adminCount, 2, "Admin count should be 2 after adding a new admin");
    }

    function testRegisterShq() public {
        contractInstance.registerShq("Test Shq", 30, "1234567890", "ABCDE1234F", "Owned RFPs", "Document");
        uint shqCount = contractInstance.getShqCount();
        Assert.equal(shqCount, 1, "SHQ count should be 1 after registering a new SHQ");
    }

    function testRegisterAgency() public {
        contractInstance.registerAgency("Test Agency", 25, "City", "1234567890", "ABCDE1234F", "Document", "test@example.com");
        uint agencyCount = contractInstance.getAgencyCount();
        Assert.equal(agencyCount, 1, "Agency count should be 1 after registering a new agency");
    }

    function testAddRfp() public {
        contractInstance.addRfp(1000, "City", "State", 100000, 12345, 67890, "ipfsHash", "Document");
        uint rfpCount = contractInstance.getRfpCount();
        Assert.equal(rfpCount, 1, "RFP count should be 1 after adding a new RFP");
    }

    function testRequestBid() public {
        contractInstance.registerShq("Test Shq", 30, "1234567890", "ABCDE1234F", "Owned RFPs", "Document");
        contractInstance.addRfp(1000, "City", "State", 100000, 12345, 67890, "ipfsHash", "Document");
        contractInstance.requestBid(address(contractInstance.getShq()[0]), 1);
        uint bidCount = contractInstance.getBidCount();
        Assert.equal(bidCount, 1, "Bid count should be 1 after requesting a bid");
    }
}
