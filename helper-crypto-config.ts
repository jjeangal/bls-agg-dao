export const keyPairsFile = "./key-pairs.json";
export const PAIRAMOUNT = 10;

export interface KeyPair {
    sk: Uint8Array;
    pk: Uint8Array;
}