import {SecretHanlder} from './SecretsHandler';
const sinon = require('sinon');
import {KmsCryptor} from "aws-lambda-helper";
import {SecureKeyValueStore} from './SecureKeyValueStore';
import {KMS} from 'aws-sdk';

jest.mock('./SecretsHandler'); 

beforeEach(() => {
   jest.clearAllMocks();
 });

test('test SecureKeyValueStore Set method', async function() {
   const response = { "secret": 'ER2EQVKDJBYDGR2HIFEGWKD3JNGXWPBS'};
   sinon.stub(KmsCryptor.prototype, 'encryptHex').callsFake(() => {
      return {data:{}, key: {}}
   });
   sinon.stub(SecretHanlder.prototype, 'save').callsFake(() => [response]);
   const KeyValueStore = new SecureKeyValueStore(new SecretHanlder(), new KmsCryptor(new KMS({region: 'ap-south-1'}),process.env.CMk as any));
   const res = await KeyValueStore.setItem({"secret": 'ER2EQVKDJBYDGR2HIFEGWKD3JNGXWPBS'},null);
   expect(SecretHanlder).toHaveBeenCalledTimes(1);
   expect(res).toEqual([{...response}])
   sinon.restore();
});

test('test SecureKeyValueStore Get method', async function() {
   sinon.stub(KmsCryptor.prototype, 'decryptToHex').callsFake(() => {
      return '2345678900-643'
   });
   sinon.stub(SecretHanlder.prototype, 'get').callsFake(() => [{secret: '6677888'}]);
   const KeyValueStore = new SecureKeyValueStore(new SecretHanlder(), new KmsCryptor(new KMS({region: 'ap-south-1'}),process.env.CMk as any));
   const res = await KeyValueStore.getItem('testId');
   expect(SecretHanlder).toHaveBeenCalledTimes(1);
   expect(res).toHaveProperty('secret')
   sinon.restore();
});

test('test SecureKeyValueStore remove method', async function() {
   sinon.stub(SecretHanlder.prototype, 'remove').callsFake(() => null);
   const KeyValueStore = new SecureKeyValueStore(new SecretHanlder(), new KmsCryptor(new KMS({region: 'ap-south-1'}),process.env.CMk as any));
   const res = await KeyValueStore.removeItem('testId');
   expect(SecretHanlder).toHaveBeenCalledTimes(1);
   expect(res).toBe(undefined);
   sinon.restore();
});
