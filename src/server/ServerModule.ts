import {Container, Module, SecretAuthProvider, ValidationUtils} from 'ferrum-plumbing';
import {SecureKeyValueStore} from "./SecureKeyValueStore";
import {HttpHandler} from "./HttpHandler";
import {TotpHttpHandler} from "./TotpHttpHandler";

export class ServerModule implements Module {
    async configAsync(container: Container) {
        const serverSecret = process.env.SECRET;
        ValidationUtils.isTrue(!!serverSecret, 'Environment variabls "SECRET" must be provided');
        container.register('LambdaHttpHandler',
                c => new HttpHandler(c.get(TotpHttpHandler), c.get(SecretAuthProvider)));
        container.register("LambdaSqsHandler", () => new Object());
        container.register(SecureKeyValueStore, c => new SecureKeyValueStore());
        container.register(SecretAuthProvider, () => new SecretAuthProvider(serverSecret!));
        container.register(TotpHttpHandler, c => new TotpHttpHandler(c.get(SecureKeyValueStore)));
    }
}