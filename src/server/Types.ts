import { Schema, Connection, Document } from 'mongoose';

export interface secretInterface {
    secretId: Number,
    UserId: Number,
    createdAt: Number,
    secret: String
}

const secretSchema: Schema = new Schema<secretInterface>({
    secretId: String,
    UserId: String,
    createdAt: Number,
    secret: String
});

export const SecretItemModel = (c: Connection) => c.model<secretInterface&Document>('Secrets', secretSchema);
