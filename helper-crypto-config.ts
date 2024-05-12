import * as mcl from "mcl-wasm";

export const keyPairsFile = "./key-pairs.json";
export const PAIRAMOUNT = 10;

export type KeyPair = {
    secret: mcl.Fr;
    pubkey: mcl.G2;
};