import * as speakeasy from 'speakeasy';
const QRCode = require('qrcode');
import { ValidationUtils} from "ferrum-plumbing";
require('dotenv').config();

// Event
export const eventdata =  {
  url: 'https://api.twitter.com/1.1/statuses/home_timeline.json'
  , qs: {
    tweet_mode: 'extended'
  }
  , user: '5ab7d745174f534889991a30'
  , oauth: {
    consumer_key: process.env['TWTR_CK']
    , consumer_secret: process.env['TWTR_CS']
    , token: process.env['TWTR_TOKEN']
    , token_secret: process.env['TWTR_SECRET']
  }
}
export const event = (data: any) => {
  return {
  Records: [{
    Sns: {
      Message: JSON.stringify(eventdata)
    }
  }],
  httpMethod: 'http',
  queryStringParameters: {
    message: 'hello'
  },
  body: {"command":`${data.command}`,"params":"[]","data":{...data}}
  }
}

export const context = {
  awsRequestId: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
  callbackWaitsForEmptyEventLoop: true,
  getRemainingTimeInMillis: function(){},
  functionName: '',
  functionVersion: '',
  memoryLimitInMB: '',
  logGroupName: '',
  logStreamName: '',
  clientContext: null,
  identity: null
}

export const callback = function(err: any,result: any) {
  if (err)
    console.log(err);
  if (result)
    console.log(result);
  // Terminate execution once done
  process.exit(0);
}


export const respondWithQRCode = (otpauthUrl: any,userId: any) => {
  QRCode.toFile(`./barCodes/${userId}.png`,otpauthUrl,(err: any) => {
    if (err) throw err;
  })
  return `barCodes/${userId}.png`;
}

export const getTwoFactorAuthenticationCode = () => {
    const secretKey = speakeasy.generateSecret({length: 20,name: 'totp-lambda'});
    const otpValues =  {
        otpauthUrl : secretKey.otpauth_url,
        base32: secretKey.base32,
        token: speakeasy.totp({
          secret: secretKey.base32,
          encoding: "base32"
        })
    };
  return otpValues;
}

export const generateToken = (secret:any) => {
  const token=speakeasy.totp({
    secret: secret,
    encoding: "base32"
  })
  return token;
}

export const validateCode = (request: any): boolean => {
   return (
     speakeasy.totp.verify({
          secret: request.secret,
          encoding: "base32",
          token: request.token,
          window: 0
      })
    );
  }

  export function getEnv(env: string) {
    const res = process.env[env];
    ValidationUtils.isTrue(!!res, `Make sure to set environment variable '${env}'`);
    return res!;
}
