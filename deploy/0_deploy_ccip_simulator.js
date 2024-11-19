const { getNamedAccounts, deployments } = require("hardhat");

module.exports = async({getNamedAccounts, deployments}) => {
    const firstAccount = await getNamedAccounts()
    const {deploy, log} = deployments

    log("deploying CCIP Simlator contract")
    await deploy("CCIPLocalSimulator", {
        contract: "CCIPLocalSimulator",
        from: firstAccount,
        log: true,
        args: []
    })
    log("nCCIP Simlator contract deployed successfully")
}

module.exports.tags = ["test", "all"]