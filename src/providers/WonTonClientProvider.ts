import { Config, getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, TonClientParameters } from "@ton/ton";
import { RateLimiter } from "../lib/PromisUtils";
import { TonClientParametersOpt } from "../lib/Types";

export const rateLimiterObj = new RateLimiter(1200);

export class WonTonClientProvider {
    params?: TonClientParametersOpt;
    config?: Config;
    rateLimiter: RateLimiter;
    lastAccess: number = 0;

    constructor(params?: TonClientParametersOpt, config?: Config, rateLimiter: RateLimiter = rateLimiterObj) {
        this.params = params;
        this.config = config;
        this.rateLimiter = rateLimiter;
    }

    wonTonClient = async (): Promise<TonClient> => {
        await this.rateLimiter.limit();
        const endpointConfig: Config = this.config ? this.config : { network: "testnet" };
        return await getHttpEndpoint(endpointConfig)
            .then(endpoint => {
                const tonClientParams: TonClientParameters = this.params ? { ... this.params, endpoint } : { endpoint };
                const now = Date.now();
                const diff = this.lastAccess > 0 ? now - this.lastAccess : 0;
                this.lastAccess = now;
                console.log(`${now} | Client borrowed. Last time diff: ${diff}`);
                return new TonClient(tonClientParams);
            });
    }
}

export const wonTonClientProvider = new WonTonClientProvider();