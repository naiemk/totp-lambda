import { Schema, Connection, Document } from 'mongoose';
import {KmsCryptor, MongooseConnection, SqsWrapper} from "aws-lambda-helper";
export interface SecretInterface {
    secretId: any,
    userId: any,
    createdAt: Number,
    secret: any
}

const secretSchema: Schema = new Schema<SecretInterface>({
    secretId: Object,
    userId: String,
    createdAt: Number,
    secret: Object
});

export const SecretItemModel = (c: Connection) => c.model<SecretInterface&Document>('Secrets', secretSchema);
