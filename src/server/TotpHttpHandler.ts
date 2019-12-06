import {Injectable} from "ferrum-plumbing";
import {NewSeedRequest, NewSeedResult, VerifyTokenRequest, VerifyTokenResult,generateTotpResult,RemoveSeedResult} from "../client/Types";
import {SecureKeyValueStore} from "./SecureKeyValueStore";
import {getTwoFactorAuthenticationCode, validateCode,generateToken,respondWithQRCode} from './utils';

export class TotpHttpHandler implements Injectable {
    constructor(private secureStore: SecureKeyValueStore) { }

    __name__(): string { return 'TotpHttpHandler'; }

    async newSeed(request: NewSeedRequest): Promise<NewSeedResult> {
        if(!request.userId){
            const response = 'userId is required';
            return {
                errorResponse: response,
                error: 'true'
            };
        }else{
            const otpDetails = getTwoFactorAuthenticationCode();
            const valuesToStore = {
                'secret': otpDetails.base32,
                'userId':request.userId,
            }
            let data = await this.secureStore.setItem(valuesToStore,request.userId);
            return {
                seed:  {
                        userId: data.userId,
                        secret: data.secret,
                        qrCode: respondWithQRCode(otpDetails.otpauthUrl,data.userId),
                        totpUrl: `${otpDetails.otpauthUrl}`,
                        createdAt: data.createdAt
                },
                error: ''
            };
        }
    }

    async removeSeed(request: NewSeedRequest): Promise<RemoveSeedResult> {
        if(!request.userId){
            const response = 'userId is required';
            return {
                message: response,
                error: 'true'
            };
        }else{
            await this.secureStore.removeItem(request.userId);
            return {
                seed:  {
                        userId: request.userId,
                        success: true
                },
                error: ''
            };
        }
    }

    async generateToken(request: VerifyTokenRequest): Promise<generateTotpResult> {
        if(!request.userId){
            const response = 'userId is required';
            return {
                message: response,
                error: 'true'
            };
        }else{
            const data = await this.secureStore.getItem(request.userId);
            if(!data){
                return {
                    message: `Can't generate token,userId does not exist`,
                    error: 'true'
                };
            }else{
                const token = generateToken(data.secret);
                return {
                    token: token,
                    secret: data.secret,
                    qrCodeUrl: data.totpUrl,
                    timeleft: (30 - Math.floor((new Date()).getTime() / 1000.0 % 30))
                }
            }
        }
     
    }

    async verify(request: VerifyTokenRequest): Promise<VerifyTokenResult> {
        if(!request.userId || !request.token){
            const response = 'userId and current token is required to verify';
            return {
                message: response,
                error: 'true'
            };
        }else{
            const data = await this.secureStore.getItem(request.userId);
            if(!data.secret){
                return {
                    message: 'userId does not exist',
                    error: 'true'
                };
            }else{
                const valid = validateCode({secret: data.secret,token: request.token});
                return {
                    verified: valid,
                    error: ''
                };
            }
        }
    }
}
