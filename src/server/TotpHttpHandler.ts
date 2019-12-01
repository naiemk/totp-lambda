import {Injectable} from "ferrum-plumbing";
import {NewSeedRequest, NewSeedResult, VerifyTokenRequest, VerifyTokenResult,generateTotpResult,RemoveSeedResult} from "../client/Types";
import {SecureKeyValueStore} from "./SecureKeyValueStore";
import {getTwoFactorAuthenticationCode, validateCode,generateToken,respondWithQRCode} from './utils';

export class TotpHttpHandler implements Injectable {
    constructor(private secureStore: SecureKeyValueStore) { }

    __name__(): string { return 'TotpHttpHandler'; }

    async newSeed(request: NewSeedRequest): Promise<NewSeedResult> {
        const OtpDetails = getTwoFactorAuthenticationCode();

        const valuesToStore = {
            'secret': OtpDetails.base32,
            'userId':request.userId,
        }
        let data = await this.secureStore.setItem(valuesToStore,request.userId);
        return {
            seed:  {
                    userId: data.UserId,
                    secret: data.secret,
                    qrCode: respondWithQRCode(OtpDetails.otpauthUrl,data.UserId),
                    totpUrl: `${OtpDetails.otpauthUrl}`,
                    createdAt: data.createdAt
            },
            error: 'false'
        };
    }

    async removeSeed(request: NewSeedRequest): Promise<RemoveSeedResult> {
        await this.secureStore.removeItem(request.userId);
        return {
            seed:  {
                    userId: request.userId,
                    success: true
            },
            error: 'false'
        };
    }

    async generateToken(request: VerifyTokenRequest): Promise<generateTotpResult> {
        const data = await this.secureStore.getItem(request.userId);
        const token = generateToken(data.secret);
        return {
            token: token,
            timeleft: (30 - Math.floor((new Date()).getTime() / 1000.0 % 30))
        }
    }

    async verify(request: VerifyTokenRequest): Promise<VerifyTokenResult> {
        const data = await this.secureStore.getItem(request.userId);
        const valid = validateCode({secret: data.secret,token: request.token});
        return {
            verified: valid,
            error: 'false'
        };
    }
}