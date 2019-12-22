import * as speakeasy from 'speakeasy';
// const QRCode = require('qrcode');
import { ValidationUtils} from "ferrum-plumbing";
require('dotenv').config();




export const respondWithQRCode = (otpauthUrl: any,userId: any) => {
  // QRCode.toFile(`./barCodes/${userId}.png`,otpauthUrl,(err: any) => {
  //   if (err) throw err;
  // })
  return `barCodes/${userId}.png`;
};

export const getTwoFactorAuthenticationCode = (label: string) => {
    const secretKey = speakeasy.generateSecret({length: 10,name: label});
    const otpValues =  {
        otpauthUrl : secretKey.otpauth_url,
        base32: secretKey.base32,
        token: speakeasy.totp({
          secret: secretKey.base32,
          encoding: "base32"
        })
    };
  return otpValues;
};

export const generateToken = (secret:any) => {
  const token=speakeasy.totp({
    secret: secret,
    encoding: "base32",
  });
  return token;
};

export const validateCode = (request: any): boolean => {
   return (
     speakeasy.totp.verify({
          secret: request.secret,
          encoding: "base32",
          token: request.token,
          window: 0
      })
    );
  };

  export function getEnv(env: string) {
    const res = process.env[env];
    ValidationUtils.isTrue(!!res, `Make sure to set environment variable '${env}'`);
    return res!;
}
