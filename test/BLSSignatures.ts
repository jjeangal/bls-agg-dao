import { ethers } from 'hardhat';
import * as mcl from '../utils/mcl-helper';
import { randHex } from '../utils/bls-utils';

const DOMAIN_STR = 'testing-evmbls';

describe("BLS Contract", function () {
    before(async function () {
        await mcl.init();
        mcl.setDomain(DOMAIN_STR);
    });

    it("Should perform a valid signature", async function () {
        mcl.setMappingMode(mcl.MAPPING_MODE_TI);
        mcl.setDomain('testing evmbls');

        //const [deployer] = await ethers.getSigners();
        const BLSContract = await ethers.deployContract("BLS");

        const message = randHex(12);
        //const messageBytes = ethers.utils.toUtf8Bytes(message);

        //const msgPoint: Uint8Array = await BLSContract.hashToPoint(messageBytes);

        const { pubkey, secret } = mcl.newKeyPair();

        const { signature, M } = mcl.sign(message, secret);

        let message_ser = mcl.g1ToBN(M);
        let pubkey_ser = mcl.g2ToBN(pubkey);
        let sig_ser = mcl.g1ToBN(signature);

        let res = await BLSContract.verifySingle(sig_ser, pubkey_ser, message_ser, { gasLimit: 80000000 });

        console.log(res);
    });
});