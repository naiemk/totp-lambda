import {secretInterface, SecretItemModel} from "./Types";
import {MongooseConnection} from 'aws-lambda-helper';
import {Connection, Document, Model} from "mongoose";
import { Injectable } from "ferrum-plumbing";


export class SecretHanlder extends MongooseConnection implements Injectable {
    private model: Model<secretInterface & Document> | undefined;
    constructor() {
        super();
    }

   
    async get(userId: String): Promise<secretInterface> {
        const secret = await this.getSecret(userId);
        return secret;
    }

    async remove(userId: String): Promise<secretInterface> {
        const response = await this.removeSecret(userId);
        return response;
    }

    async save(Secret: secretInterface): Promise<secretInterface> {
        const secret = {
            secretId: Secret.secret,
            UserId: Secret.UserId,
            createdAt: Secret.createdAt,
            secret: Secret.secret
        } as unknown as secretInterface;
        await this.saveSecret(secret);
        return secret;
    }

    private async removeSecret(userId: String): Promise<secretInterface> {
        this.verifyInit();
        const response = await this.model!.deleteOne({'UserId': userId}, function (err) {
            if (!err){return 'success'} 
        }).exec() as secretInterface;
        return response;
    }

    private async getSecret(userId: String): Promise<secretInterface> {
        this.verifyInit();
        const Secret = this.model!.find({'UserId': userId}, function(err, docs){
           return docs;
        })as unknown as secretInterface;
        return Secret;
    }

    private async saveSecret(TotpSecret: secretInterface) {
        this.verifyInit();
        return await new this.model!(TotpSecret).save();
    }

    initModels(con: Connection): void {
        this.model = SecretItemModel(con);
    }

    __name__(): string { return 'SecretHanlder'; }
}
