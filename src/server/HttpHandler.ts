// Implement your specific handlers in a separate file
import {LambdaHttpRequest, LambdaHttpResponse} from "aws-lambda-helper";
import {LambdaHttpHandler} from "aws-lambda-helper/dist/HandlerFactory";
import {TotpHttpHandler} from "./TotpHttpHandler";
import {AuthenticationVerifyer, JsonRpcRequest} from "ferrum-plumbing";

export class HttpHandler implements LambdaHttpHandler {
    constructor(private totpHandler: TotpHttpHandler, private authVerifyer: AuthenticationVerifyer) { }

    async handle(request: LambdaHttpRequest, context: any): Promise<LambdaHttpResponse> {
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
        const req = JSON.parse(request.body) as JsonRpcRequest;
        switch (req.command) {
            case 'newSeed':
                body = await this.totpHandler.newSeed(req.data as any);
                break;
            case 'verify':
                body =  await this.totpHandler.verify(req.data as any);
                break;
            default:
                body = { error: 'bad request' }
        }
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