
export interface TotpSeed {
    userId: string;
    secret: string;
    qrCode: string;
    totpUrl: string;
    createdAt: number;
}

export interface NewSeedRequest {
    userId: string;
    label: string;
    qrCodeSize?: number;
}

export interface NewSeedResult {
    seed?: TotpSeed;
    error?: string;
    errorResponse?: string
}

export interface RemoveSeedResult {
    seed?: {
        userId: String,
        success: boolean,
    };
    error?: string;
    message?: string
}

export interface VerifyTokenRequest {
    userId: string;
    token: string;
}

export interface VerifyTokenResult {
    verified?: boolean;
    error?: string;
    message?: string;
}

export interface generateTotpResult {
    token?: string;
    timeleft?: number;
    qrCodeUrl?: string;
    secret?: string;
    error?: string;
    message?: string
}
