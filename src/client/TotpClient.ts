import {Injectable, JsonRpcClient, JsonRpcRequest, SecretAuthProvider} from 'ferrum-plumbing';
import {NewSeedRequest, NewSeedResult, VerifyTokenRequest, VerifyTokenResult} from "./Types";

export class TotpClient implements Injectable {
    constructor(private client: JsonRpcClient) { }

    __name__(): string { return 'TotpClient'; }

    async newSeed(request: NewSeedRequest): Promise<NewSeedResult> {
        const httpRequest = {
            command: 'newSeed',
            params: [],
            data: request,
        } as JsonRpcRequest;

        // TODO: Implement
    }

    async verify(request: VerifyTokenRequest): Promise<VerifyTokenResult> {
        const httpRequest = {
            command: 'verify',
            params: [],
            data: request,
        } as JsonRpcRequest;

        // TODO: Implement
    }
}

export function newTotpClient(endpoint: string, secret: string) {
    const rpcClient = new JsonRpcClient(endpoint, '', '', new SecretAuthProvider(secret));
    return new TotpClient(rpcClient);
}