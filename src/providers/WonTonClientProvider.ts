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
        // const endpointConfig: Config = this.config ? this.config : { network: testOnly ? "testnet" : "mainnet"  };
        // const endpointConfig: Config = this.config ? this.config : { network: "mainnet"  };
        // const endpointConfig: Config = { network: "mainnet", protocol: "rest" };
        // const endpointConfig: Config = { network: "mainnet" };
        // return await getHttpEndpoint(endpointConfig)
        return await getHttpEndpoint()
            .then(endpoint => {
                const tonClientParams: TonClientParameters = this.params ? { ... this.params, endpoint } : { endpoint, apiKey: '5200eb64ab1bba7fa5ba3dae92e2d75d1faa2791b191c8487e6e02c936d2e3cd' };
                const now = Date.now();
                const diff = this.lastAccess > 0 ? now - this.lastAccess : 0;
                this.lastAccess = now;
                console.log(`${now} | Client borrowed. Last time diff: ${diff}`);
                return new TonClient(tonClientParams);
            });
    }
}

export const wonTonClientProvider = new WonTonClientProvider();