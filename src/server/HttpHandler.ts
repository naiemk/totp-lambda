import {LambdaHttpRequest, LambdaHttpResponse} from "aws-lambda-helper";
import {LambdaHttpHandler} from "aws-lambda-helper/dist/HandlerFactory";
import {TotpHttpHandler} from "./TotpHttpHandler";
import {AuthenticationVerifyer, JsonRpcRequest, ValidationUtils} from "ferrum-plumbing";
import {NewSeedRequest, VerifyTokenRequest} from "../client/Types";

export interface JsonRpcProxyRequest extends JsonRpcRequest {
    userProfile: any,
    policyData: any,
}

function asRequest(body: any | string): JsonRpcProxyRequest {
    return (typeof body === 'string') ? JSON.parse(body) : body;
}

export class HttpHandler implements LambdaHttpHandler {
    constructor(private totpHandler: TotpHttpHandler, private authVerifyer: AuthenticationVerifyer) { }

    async handle(request: LambdaHttpRequest): Promise<LambdaHttpResponse> {
        if (!this.authVerifyer.isValid(request.headers)) {
            return {
                body: 'Bad secret',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'text/html',
                },
                isBase64Encoded: false,
                statusCode: 400,
            };
        }
        let body: any = undefined;
        const req = asRequest(request.body);
        switch (req.command) {
            case 'newSeed':
                const platform =  (req.userProfile || {}).PLATFORM;
                const email = (req.userProfile || {}).EMAIL;
                ValidationUtils.isTrue(!!platform, '"platform" must be provided');
                ValidationUtils.isTrue(!!email, '"email" must be provided');
                const newSeedReq = {
                    userId: (req.userProfile || {}).USER_ID,
                    label: `${platform}(${email})`
                } as NewSeedRequest;
                body = await this.totpHandler.newSeed(newSeedReq);
                break;
            case 'removeSeed':
                throw new Error('Not allowed');
                // body =  await this.totpHandler.removeSeed(req.data as any);
                break;
            case 'getToken':
                throw new Error('Not allowed');
                // body =  await this.totpHandler.generateToken(req.data as any);
                break;
            case 'verify':
                const verifyTokenRequest = {
                    token: (req.data || {}).token,
                    userId: (req.userProfile || {}).USER_ID,
                } as VerifyTokenRequest;
                body =  await this.totpHandler.verify(verifyTokenRequest);
                break;
            default:
                body = { error: 'bad request' }
        };
        return {
            body: JSON.stringify(body),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            isBase64Encoded: false,
            statusCode: 200,
        } as LambdaHttpResponse;
    }
}