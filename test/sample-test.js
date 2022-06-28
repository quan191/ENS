const HDWalletProvider = require("@truffle/hdwallet-provider");
const ENSRegistry = artifacts.require('ENSRegistry');
const PublicResolver = artifacts.require('PublicResolver');
const FIFSRegistrar = artifacts.require('FIFSRegistrar');
const fs = require("fs");
const mnemonic = fs.readFileSync('./.secret').toString().trim();
const ethers = require('ethers');
const utils = ethers.utils;
const labelhash = (label) => utils.keccak256(utils.toUtf8Bytes(label))
const namehash = require('eth-ens-namehash');

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(`https://data-seed-prebsc-2-s1.binance.org:8545/`));

const sigUtil = require("eth-sig-util");
const { table } = require("console");

const sleep = sleepTime => new Promise(resolve => setTimeout(resolve, sleepTime));

contract('Test\n', function (accounts) {
    let governance = accounts[0];
    let account1 = accounts[1];
    let account2 = accounts[2];
    let account3 = accounts[3];
    console.log(governance);
    let transaction;

    describe('Test\n', function () {
        it("Test ENS ", async function () {
            let ensRegistry = await ENSRegistry.new();
            console.log(`1. contract ensRegistry : ${ensRegistry.address}`);
            let ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
            let resolver = await PublicResolver.new(ensRegistry.address, ZERO_ADDRESS);
            console.log(`2. resolver address ${resolver.address}`);
            let resolverNode = namehash.hash("resolver");
            console.log(`123 ${resolverNode}`);
            let resolverLabel = labelhash("resolver");
            console.log(`234 ${resolverLabel}`);
            transaction = await ensRegistry.setSubnodeOwner(ZERO_ADDRESS, resolverLabel, governance);
            console.log(`3. transaction set subnode owner ${transaction.tx}`);
            transaction = await ensRegistry.setResolver(resolverNode, resolver.address);
            console.log(`3. transaction set resolver ${transaction.tx}`);
            transaction = await resolver.setAddr(resolverNode, resolver.address);
            console.log(`3. transaction set address ${transaction.tx}`);
            let resolverDomain = await ensRegistry.resolver(resolverNode);
            console.log(`4. resolver of domain ${resolverDomain}`);
            let byteToAddr = await resolver.addr(resolverDomain);
            console.log(`5. address : ${byteToAddr}`);
            let registrar = await FIFSRegistrar.new(ensRegistry.address, namehash.hash("test"));
            console.log(`6. registrar contract : ${registrar.address}`);
            transaction = await ensRegistry.setSubnodeOwner(ZERO_ADDRESS, labelhash("test"), registrar.address);
            console.log(`7. transaction set subnode owner ${transaction.tx}`);

        }).timeout(40000000000000);

    });
});
