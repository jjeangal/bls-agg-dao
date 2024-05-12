import { ethers } from 'hardhat';
import { PROPOSAL_DESCRIPTION } from '../helper-hardhat-config';
import * as mcl from '../utils/mcl-helper';
import assert from 'assert';
import { Contract } from 'ethers';

describe("BLS Contract", function () {

    let BLSContract: Contract;

    before(async function () {
        await mcl.init();
        mcl.setDomain(mcl.DOMAIN_STR);
        BLSContract = await ethers.deployContract("BLSTest");
    });

    it("Should perform a valid signature", async function () {
        //mcl.setMappingMode(mcl.MAPPING_MODE_TI);

        const message = PROPOSAL_DESCRIPTION;

        const { pubkey, secret } = mcl.newKeyPair();
        const { signature, M } = mcl.sign(message, secret);

        let msg = mcl.g1ToBN(M);
        let pk = mcl.g2ToBN(pubkey);
        let sig = mcl.g1ToBN(signature);

        let res = await BLSContract.verifySingle(sig, pk, msg, { gasLimit: 80000000 });
        assert.strictEqual(res, true);
    });

    it("Should detect an invalid signature", async function () {

        const message = PROPOSAL_DESCRIPTION;

        const { pubkey, secret } = mcl.newKeyPair();
        const { signature, M } = mcl.sign(message, secret);

        let msg = mcl.g1ToBN(M);
        let pk = mcl.g2ToBN(pubkey);
        let sig = mcl.g1ToBN(signature);

        let res = await BLSContract.verifySingle(sig, pk, msg, { gasLimit: 80000000 });
        assert.strictEqual(res, true);

        // Change the public key
        const { pubkey: pubkey2, secret: secret2 } = mcl.newKeyPair();
        let pk2 = mcl.g2ToBN(pubkey2);

        res = await BLSContract.verifySingle(sig, pk2, msg, { gasLimit: 80000000 });
        assert.strictEqual(res, false);
    });
});