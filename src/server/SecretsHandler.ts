import {SecretInterface, SecretItemModel} from "./Types";
import {MongooseConnection} from 'aws-lambda-helper';
import {Connection, Document, Model} from "mongoose";
import { Injectable } from "ferrum-plumbing";

export class SecretHanlder extends MongooseConnection implements Injectable {
    private model: Model<SecretInterface & Document> | undefined;
    constructor
    (
    ) {
        super();
    }

   
    async get(userId: String): Promise<any> {
        const secret = await this.getSecret(userId);
        return secret;
    }

    async remove(userId: String): Promise<SecretInterface> {
        const response = await this.removeSecret(userId);
        return response;
    }

    async save(secret: SecretInterface): Promise<SecretInterface> {
        const secretResponse = {
            secretId: secret.secret,
            userId: secret.userId,
            createdAt: secret.createdAt,
            secret: secret.secret
        } as any;
        const res = await this.saveSecret(secretResponse);
        return secretResponse as SecretInterface;
    }

    private async removeSecret(userId: String): Promise<SecretInterface> {
        this.verifyInit();
        const response = await this.model!.deleteOne({'userId': userId}, function (err) {
            if (!err){return 'success'} 
        }).exec() as SecretInterface;
        return response;
    }

    private async getSecret(userId: String): Promise<SecretInterface> {
        this.verifyInit();
        const Secret = this.model!.find({'userId': userId}, function(err, docs){
           return docs;
        }) as any;
        return Secret as SecretInterface;
    }

    private async saveSecret(TotpSecret: SecretInterface) {
        this.verifyInit();
        return await new this.model!(TotpSecret).save();
    }

    initModels(con: Connection): void {
        this.model = SecretItemModel(con);
    }

    __name__(): string { return 'SecretHanlder'; }
}
