import {Container, Module, SecretAuthProvider, ValidationUtils} from 'ferrum-plumbing';
import {SecureKeyValueStore} from "./SecureKeyValueStore";
import {HttpHandler} from "./HttpHandler";
import {TotpHttpHandler} from "./TotpHttpHandler";
import {SecretHanlder} from './SecretsHandler';
import { SecretsProvider, MongooseConfig } from 'aws-lambda-helper';


export class ServerModule implements Module {

    async configAsync(container: Container) {

        const SecretsHandlerConfig = {
            user: process.env.user,
            pw: process.env.pw,
            database: process.env.database,
            endpoint: process.env.endpoint
        } as MongooseConfig;
    
        const serverSecret = process.env.SECRET;
        ValidationUtils.isTrue(!!serverSecret, 'Environment variabls "SECRET" must be provided');
        container.registerSingleton(SecretHanlder,c => new SecretHanlder());
        container.register('LambdaHttpHandler',
        c => new HttpHandler(c.get(TotpHttpHandler),/*c.get(new SecretAuthProvider)*/));
        container.register("LambdaSqsHandler", () => new Object());
        container.register(SecureKeyValueStore, c => new SecureKeyValueStore(c.get(SecretHanlder)));
       // container.register(SecretAuthProvider, () => new SecretAuthProvider(addressHandlerConfig.secret)); // TODO
        container.register(TotpHttpHandler, c => new TotpHttpHandler(c.get(SecureKeyValueStore)));
        await container.get<SecretHanlder>(SecretHanlder).init(SecretsHandlerConfig);
    }
}