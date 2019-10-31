import {LambdaHttpRequest} from "aws-lambda-helper";
import {HttpHandler} from "./server/HttpHandler";

jest.mock('./lib/LambdaConfig', () => ({
    LambdaConfig: jest.fn().mockImplementation()
}));

jest.mock('aws-sdk', () => ({
    SQS: jest.fn().mockImplementation(() => ({
        sendMessage(msg: any) {
                this.msg = msg;
            return ({
                    promise: jest.fn(),
                });
        },
    })),
    config: {
        update: jest.fn()
    },
}));

test('test http request echos data', async () => {
    const req = {
        queryStringParameters: { 'message': 'testing' },
        httpMethod: 'GET',
    } as LambdaHttpRequest;
    const obj = new HttpHandler();
    const res = await obj.handle(req, {});
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('You said testing');
});

