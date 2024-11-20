const { getNamedAccounts, deployments, ethers } = require("hardhat")
const { expect } = require("chai")

let firstAccount
let ccipSimulator
let nft
let wnft
let nftPoolLockAndRelease
let nftPoolBurnAndMint
let chainSelector

before(async function () {
    //prepare variables: contract, account
    firstAccount = (await getNamedAccounts()).firstAccount
    await deployments.fixture(["all"])
    ccipSimulator = await ethers.getContract("CCIPLocalSimulator",firstAccount)
    nft = await ethers.getContract("MyToken",firstAccount)
    nftPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease",firstAccount)
    wnft = await ethers.getContract("WrappedMyToken",firstAccount)
    nftPoolBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint",firstAccount)
    chainSelector = (await ccipSimulator.configuration()).chainSelector_
})

describe("source chain -> dest chain tests", async function () {
    it("test if user can mint a nft from nft contract successfully",
        async function () {
            await nft.safeMint(firstAccount)
            const owner = await nft.ownerOf(0)
            expect(owner).to.equal(firstAccount)
        }
    )

    it("test if user can lock the nft in the pool and send ccip message on source chain",
        async function () {
            await nft.approve(nftPoolLockAndRelease.target, 0)
            await ccipSimulator.requestLinkFromFaucet(
                nftPoolLockAndRelease, ethers.parseEther("10"))
            await nftPoolLockAndRelease.lockAndSendNFT(
                0,
                firstAccount,
                chainSelector,
                nftPoolBurnAndMint.target
            )
            const owner = await nft.ownerOf(0)
            expect(owner).to.equal(nftPoolLockAndRelease)
        }
    )
    
})

// describe("test if the nft can be locked and transferred to destchain"
//     , async function() {
//         // transfer NFT from source chain to dest chain, check if the nft is locked
//         it("transfer NFT from source chain to dest chain, check if the nft is locked",
//             async function() {
//                 await ccipSimulator.requestLinkFromFaucet(nftPoolLockAndRelease.target, ethers.parseEther("10"))

                
//                 // lock and send with CCIP
//                 await nft.approve(nftPoolLockAndRelease.target, 0)
//                 await nftPoolLockAndRelease.lockAndSendNFT(0, firstAccount, chainSelector, nftPoolBurnAndMint.target)
                
//                 // check if owner of nft is pool's address
//                 const newOwner = await nft.ownerOf(0)
//                 console.log("test")
//                 expect(newOwner).to.equal(nftPoolLockAndRelease.target)
//             }
//         )
//         // check if the wnft is owned by new owner
//         it("check if wnft's account is owner", 
//             async function() {
//                 const newOwner = await wnft.ownerOf(0)
//                 expect(newOwner).to.equal(firstAccount)
//             }
//         )
//     }
// )