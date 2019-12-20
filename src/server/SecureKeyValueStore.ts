import {KeyValueStore} from "ferrum-plumbing";
import {SecretHanlder} from './SecretsHandler';
import {KmsCryptor} from "aws-lambda-helper";

// TODO: Implement
// You need to set up storage and provide relevant configurations. Firestore can be an option.
// Bonus: encrypt / decrypt data using AWS KMS before storage
export class SecureKeyValueStore implements KeyValueStore {
    constructor(
        private secretsHandler: SecretHanlder,
        private cryptor: KmsCryptor,
        ) {
    }

    __name__(): string { return 'SecureKeyValueStore'; }

    async getItem<T>(k: string): Promise<any> {
       const secret = await this.secretsHandler.get(k);
       if(secret[0] === undefined){
           return null
       }else{
        const skHex = await this.cryptor.decryptToHex(secret[0].secret);
        const response = {...secret[0],secret: Buffer.from(skHex, 'hex').toString('utf-8')}
        return response;
       }
    }

    async removeItem<T>(k: string): Promise<void> {
        const response = this.secretsHandler.remove(k);
        return;
    }

    async setItem<T>(k: any, value: T): Promise<any> {
        const encSk = await this.cryptor.encryptHex(Buffer.from(k.secret as string, 'utf-8').toString('hex'));
        const dataToStore = {
            'secret': encSk,
            'userId': k.userId,
            'secretId': encSk.key,
            'createdAt': Date.now()
        }
        const data = await this.secretsHandler.save(dataToStore);
        return data;
    }
}
