import {KeyValueStore} from "ferrum-plumbing";
import {SecretHanlder} from './SecretsHandler';

// TODO: Implement
// You need to set up storage and provide relevant configurations. Firestore can be an option.
// Bonus: encrypt / decrypt data using AWS KMS before storage
export class SecureKeyValueStore implements KeyValueStore {
    constructor(private secretsHandler: SecretHanlder) {
    }

    __name__(): string { return 'SecureKeyValueStore'; }

    async getItem<T>(k: string): Promise<any> {
       const secret = this.secretsHandler.get(k);
       //Decryption will occur here
       return secret;
    }

    async removeItem<T>(k: string): Promise<void> {
        const response = this.secretsHandler.remove(k);
        return;
    }

    async setItem<T>(k: any, value: T): Promise<any> {
        const Mongodata = {
            'secret': k.secret,
            'UserId': k.userId,
            'secretId': k.token,
            'createdAt': Date.now()
        }
        //encryption will occur here
        const data = this.secretsHandler.save(Mongodata);
        return data;
    }
}
