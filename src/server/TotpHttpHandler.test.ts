import {TotpHttpHandler} from './TotpHttpHandler';
const sinon = require('sinon');
import {KmsCryptor} from "aws-lambda-helper";
import {SecureKeyValueStore} from './SecureKeyValueStore';
import {KMS} from 'aws-sdk';
import {SecretHanlder} from './SecretsHandler';

jest.mock('./SecureKeyValueStore'); 

beforeEach(() => {
    jest.clearAllMocks();
});

test('test totpHttpHandler newSeed method', async function() {
    sinon.stub(SecureKeyValueStore.prototype, 'setItem').callsFake(() => {
        return {
            userId: '44444556678899',
            secret:  '44444556678899',
            createdAt: '44444556678899',
        }
    });
    const resp = new TotpHttpHandler(new SecureKeyValueStore(new SecretHanlder(), new KmsCryptor(new KMS({region: 'ap-south-1'}),process.env.CMk as any)));
    const response = resp.newSeed({userId: 'testId',label: ''})
    expect(SecureKeyValueStore).toHaveBeenCalledTimes(1)
    expect(response).toBeInstanceOf(Object);
});

test('test totpHttpHandler getToken method', async function() {
    sinon.stub(SecureKeyValueStore.prototype, 'getItem').callsFake(() => {
        return {
            token: 44444556678899,
            secret: 'ER2EQVKDJBYDGR2HIFEGWKD3JNGXWPBS',
        }
    });
    const resp = new TotpHttpHandler(new SecureKeyValueStore(new SecretHanlder(), new KmsCryptor(new KMS({region: 'ap-south-1'}),process.env.CMk as any)));
    const response = resp.generateToken({userId: 'testId',token: '123456'})
    expect(response).toBeInstanceOf(Object);
    sinon.restore();
});

test('test totpHttpHandler verify method', async function() {
    sinon.stub(SecureKeyValueStore.prototype, 'getItem').callsFake(() => {
        return {
            userId: '44444556678899',
            secret: 'ER2EQVKDJBYDGR2HIFEGWKD3JNGXWPBS',
        }
    });
    const resp = new TotpHttpHandler(new SecureKeyValueStore(new SecretHanlder(), new KmsCryptor(new KMS({region: 'ap-south-1'}),process.env.CMk as any)));
    const response = resp.verify({userId: 'testId',token: '123456'})
    expect(response).toBeInstanceOf(Object);
});

test('test totpHttpHandler remove method', async function() {
    sinon.stub(SecureKeyValueStore.prototype, 'removeItem').callsFake(() => undefined);
    const resp = new TotpHttpHandler(new SecureKeyValueStore(new SecretHanlder(), new KmsCryptor(new KMS({region: 'ap-south-1'}),process.env.CMk as any)));
    const response = resp.removeSeed({userId: 'testId',label: ''})
    expect(SecureKeyValueStore).toHaveBeenCalledTimes(1)
    expect(response).toBeInstanceOf(Object);
});

