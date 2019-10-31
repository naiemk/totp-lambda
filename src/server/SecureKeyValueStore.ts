import {KeyValueStore} from "ferrum-plumbing";

// TODO: Implement
// You need to set up storage and provide relevant configurations. Firestore can be an option.
// Bonus: encrypt / decrypt data using AWS KMS before storage
export class SecureKeyValueStore implements KeyValueStore {
    constructor() {
    }

    getItem<T>(k: string): Promise<T | undefined> {
        // TODO: Get an item and decrypt
        return undefined;
    }

    removeItem<T>(k: string): Promise<void> {
        return undefined;
    }

    setItem<T>(k: string, value: T): Promise<void> {
        // TODO: Encrypt and save item
        return undefined;
    }
}