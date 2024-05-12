import { ethers } from 'hardhat';
import { PROPOSAL_DESCRIPTION } from '../helper-hardhat-config';
import * as mcl from '../utils/mcl-helper';
import assert from 'assert';

describe("BLS Contract", function () {

    before(async function () {
        await mcl.init();
        mcl.setDomain(mcl.DOMAIN_STR);
    });

    it("Should perform a valid signature", async function () {
        //mcl.setMappingMode(mcl.MAPPING_MODE_TI);
        const BLSContract = await ethers.deployContract("BLS");

        const message = PROPOSAL_DESCRIPTION;

        const { pubkey, secret } = mcl.newKeyPair();
        const { signature, M } = mcl.sign(message, secret);

        let msg = mcl.g1ToBN(M);
        let pk = mcl.g2ToBN(pubkey);
        let sig = mcl.g1ToBN(signature);

        let res = await BLSContract.verifySingle(sig, pk, msg, { gasLimit: 80000000 });
        assert.strictEqual(res, true);
    });
});