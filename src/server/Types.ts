import { Schema, Connection, Document } from 'mongoose';

export interface secretInterface {
    secretId: any,
    UserId: Number,
    createdAt: Number,
    secret: any
}

const secretSchema: Schema = new Schema<secretInterface>({
    secretId: Object,
    UserId: String,
    createdAt: Number,
    secret: Object
});

export const SecretItemModel = (c: Connection) => c.model<secretInterface&Document>('Secrets', secretSchema);
