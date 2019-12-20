import {LambdaHttpRequest} from "aws-lambda-helper";
import {HttpHandler} from "./server/HttpHandler";
import {SecretAuthProvider} from 'ferrum-plumbing';
import {TotpHttpHandler} from './server/TotpHttpHandler';
const sinon = require('sinon');
import {KmsCryptor} from "aws-lambda-helper";
import {SecureKeyValueStore} from './server/SecureKeyValueStore';
import {KMS} from 'aws-sdk';
import {SecretHanlder} from './server/SecretsHandler';

jest.mock('../', () => ({
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
    KMS: jest.fn(),
    config: {
        update: jest.fn()
    },
}));

test('test http request echos data', async () => {
    const req = {
        queryStringParameters: { 'message': 'testing' },
        httpMethod: 'GET',
        headers: {
            'X-Secret': 'secret'
        },
        body: "{}"
    } as unknown as LambdaHttpRequest;
    sinon.stub(SecureKeyValueStore.prototype, 'setItem').callsFake(() => {
        return {}
    });
    const obj = new HttpHandler(new TotpHttpHandler(new SecureKeyValueStore(new SecretHanlder(), new KmsCryptor(new KMS({region: 'ap-south-1'}),process.env.CMk as any))),
    new SecretAuthProvider('secret'));
    const res = await obj.handle(req);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('{\"error\":\"bad request\"}');
});

