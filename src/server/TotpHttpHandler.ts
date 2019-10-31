import {Injectable} from "ferrum-plumbing";
import {NewSeedRequest, NewSeedResult, VerifyTokenRequest, VerifyTokenResult} from "../client/Types";
import {SecureKeyValueStore} from "./SecureKeyValueStore";

export class TotpHttpHandler implements Injectable {
    constructor(private secureStore: SecureKeyValueStore) { }

    __name__(): string { return 'TotpHttpHandler'; }

    async newSeed(request: NewSeedRequest): Promise<NewSeedResult> {
        // TODO: implement
    }

    async verify(request: VerifyTokenRequest): Promise<VerifyTokenResult> {
        // TODO: implement
    }
}