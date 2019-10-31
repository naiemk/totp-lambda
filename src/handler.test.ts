import {LambdaHttpRequest, LambdaHttpResponse} from "aws-lambda-helper";
import {handler} from "../index";

test('test http request echos data', async () => {
    const req = {
        queryStringParameters: { 'message': 'testing' },
        httpMethod: 'GET',
    } as LambdaHttpRequest;
    const res = await handler(req, {}) as LambdaHttpResponse;
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('You said testing');
});
