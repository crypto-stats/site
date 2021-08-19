declare class CoinGecko {
    getCurrentPrice(name: string, currency?: string): Promise<any>;
    getHistoricalPrice(name: string, date: string): Promise<any>;
    getHistoricalMarketData(name: string, date: string): Promise<{
        price: any;
        marketCap: any;
    }>;
    cacheMarketData(name: string, date: string, price: number, marketCap: number): Promise<void>;
    queryCoingecko(name: string, date: string, currency?: string): Promise<{
        price: any;
        marketCap: any;
    }>;
}

declare class ChainData {
    getBlockNumber(date: string, chain?: string): Promise<number>;
    getBlockSubgraphQuery(subgraph: string): (date: string) => Promise<number>;
    blockSubgraphQuery(subgraph: string, date: string): Promise<number>;
}

declare class DateLib {
    dateToTimestamp(date: string | Date): number;
    formatDate(date: Date, connector?: string): string;
    getYesterdayDate(): string;
    last7Days(date?: Date): string[];
    isBefore(date?: string, comparrison?: string): boolean;
    getDateRange(dateStart: string | Date, dateEnd: string | Date): string[];
    offsetDaysFormatted(date: string, numDays: number): string;
}

declare class Graph {
    query(subgraph: string, query: string, variables?: any, operationName?: string): Promise<any>;
}

declare class HTTP {
    get(url: string, options?: any): Promise<any>;
    post(url: string, body: any, options?: any): Promise<any>;
}

declare class IPFS {
    getFile(cid: string): Promise<string>;
    getDataURI(cid: string, mimeType: string): Promise<string>;
    getDataURILoader(cid: string, mimeType: string): () => Promise<string>;
}

declare class Ethers {
    // TODO: get actual types from Ethers.js
    utils: any;
    BigNumber: any;
    FixedNumber: any;

    addProvider(name: string, url: string, { archive, }?: {
        archive?: boolean;
    }): void;
    getContract(address: string, abi: any, network?: string): any;
    getERC20Contract(address: string, network?: string): any;
    getProvider(network: string): any;
}

declare interface RegistrationData {
  id: string;
  queries: {
      [name: string]: (date: string) => Promise<number>;
  };
  metadata: any;
}

declare class Context {
  readonly coinGecko: CoinGecko;
  readonly chainData: ChainData;
  readonly date: DateLib;
  readonly graph: Graph;
  readonly http: HTTP;
  readonly ipfs: IPFS;
  readonly ethers: Ethers;
  register(registration: RegistrationData): void;
}
