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

    it("Should perform a valid aggregate signature", async function () {

        const message = PROPOSAL_DESCRIPTION;

        const n = 10;
        let messages = [];
        let pubkeys = [];

        let aggSignature = mcl.newG1();

        for (let i = 0; i < n; i++) {
            const { pubkey, secret } = mcl.newKeyPair();
            const { signature, M } = mcl.sign(message, secret);
            aggSignature = mcl.aggreagate(aggSignature, signature);
            messages.push(M);
            pubkeys.push(pubkey);
        }

        messages = messages.map((p) => mcl.g1ToBN(p));
        pubkeys = pubkeys.map((p) => mcl.g2ToBN(p));
        let sig_ser = mcl.g1ToBN(aggSignature);
        let res = await BLSContract.verifyMultiple(sig_ser, pubkeys, messages);
        assert.strictEqual(res, true);
    });

    it("Should detect an invalid aggregate signature", async function () {

        const message = PROPOSAL_DESCRIPTION;

        const n = 10;
        let messages = [];
        let pubkeys = [];

        let aggSignature = mcl.newG1();

        for (let i = 0; i < n; i++) {
            const { pubkey, secret } = mcl.newKeyPair();
            const { signature, M } = mcl.sign(message, secret);
            aggSignature = mcl.aggreagate(aggSignature, signature);
            messages.push(M);
            pubkeys.push(pubkey);
        }

        messages = messages.map((p) => mcl.g1ToBN(p));
        pubkeys = pubkeys.map((p) => mcl.g2ToBN(p));

        // Change the first public key
        pubkeys[0] = mcl.g2ToBN(mcl.newKeyPair().pubkey);

        let sig_ser = mcl.g1ToBN(aggSignature);
        let res = await BLSContract.verifyMultiple(sig_ser, pubkeys, messages);
        assert.strictEqual(res, false);
    });
});