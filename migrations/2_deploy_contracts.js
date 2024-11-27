var Halal = artifacts.require("./Halal.sol");

module.exports = function(deployer) {
  deployer.deploy(Halal);
};