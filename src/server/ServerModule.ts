import {Container, Module, SecretAuthProvider, ValidationUtils} from 'ferrum-plumbing';
import {SecureKeyValueStore} from "./SecureKeyValueStore";
import {HttpHandler} from "./HttpHandler";
import {TotpHttpHandler} from "./TotpHttpHandler";
import {KMS} from 'aws-sdk';
import {SecretHanlder} from './SecretsHandler';
import { 
    AwsEnvs,
    KmsCryptor,
    SecretsProvider, 
    MongooseConfig } from 'aws-lambda-helper';
import {getEnv} from './utils';

export class ServerModule implements Module {
    async configAsync(container: Container) {
        const region = process.env[AwsEnvs.AWS_DEFAULT_REGION] || 'us-east-2';
        const secretsHandlerConfArn = getEnv(AwsEnvs.AWS_SECRET_ARN_PREFIX + 'ADDRESS_HANDLER');
        const secretsHandlerConfig = await new SecretsProvider(region, secretsHandlerConfArn).get() as
            MongooseConfig&{secret: string, cmkKeyArn: string};
        // const secretsHandlerConfig = {
        //     user: process.env.user,
        //     pw: process.env.pw,
        //     database: process.env.database,
        //     endpoint: process.env.endpoint
        // } as MongooseConfig;
        container.registerSingleton(SecretHanlder,c => new SecretHanlder());
        container.register('LambdaHttpHandler',
        c => new HttpHandler(c.get(TotpHttpHandler),new SecretAuthProvider(secretsHandlerConfig.secret)));
        container.register("LambdaSqsHandler", () => new Object());
        container.register(SecureKeyValueStore, c => new SecureKeyValueStore(c.get(SecretHanlder), c.get(KmsCryptor)));
        container.register(TotpHttpHandler, c => new TotpHttpHandler(c.get(SecureKeyValueStore)));
        container.register('KMS', () => new KMS({region}));
        container.register(KmsCryptor, c => new KmsCryptor(c.get('KMS'), secretsHandlerConfig.cmkKeyArn));
        await container.get<SecretHanlder>(SecretHanlder).init(secretsHandlerConfig);
    }
}