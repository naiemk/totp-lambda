import {LambdaHttpResponse} from "aws-lambda-helper";
import {handler} from "..";
const sinon = require('sinon');
import {SecureKeyValueStore} from "./server/SecureKeyValueStore";

jest.setTimeout(30000);

test('test http request command', async () => {
    const req = {
        'headers': {
            "X-Secret": "secret"
        },
        'httpMethod': "http",
        'queryStringParameters': {
         'message': "hello"
        },
        'body': {"command":"verify","params":"[]","data":{"userId":"-LuraaWgzmlVwSvSjjKR","token":150113}}
    }
    sinon.stub(SecureKeyValueStore.prototype, 'getItem').callsFake(() => {
       return {
           body: {
                data: {
                    secret:'ER2EQVKDJBYDGR2HIFEGWKD3JNGXWPBS'
                }
            }
        }
    });

    const res = await handler(req, {}) as LambdaHttpResponse;
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).verified).toBe(false);
});
