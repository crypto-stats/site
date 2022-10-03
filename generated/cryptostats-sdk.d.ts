declare class Adapter {
  readonly id: string
  private metadata
  readonly bundle: string | null
  queries: {
    [name: string]: (...params: any[]) => Promise<number>
  }
  private cache
  constructor(id: string, { metadata, cache, bundle }: AdapterProps)
  addQuery(type: string, query: QueryFn): void
  query(type: string, ...input: any[]): Promise<any>
  executeQuery(type: string, ...params: any[]): Promise<number>
  getRawMetadata(): {
    [key: string]: any
  }
  getMetadata(): Promise<{
    [x: string]: any
  }>
}

declare interface AdapterData {
  id: string
  queries: any
  metadata: any
  bundle?: string | null
}

declare interface AdapterProps {
  metadata: any
  cache?: ICache | null
  bundle?: string | null
}

declare interface BankExtension {
  readonly bank: {
      readonly balance: (address: string, denom: string) => Promise<Coin>;
      readonly allBalances: (address: string) => Promise<Coin[]>;
      readonly totalSupply: (paginationKey?: Uint8Array) => Promise<any/*QueryTotalSupplyResponse*/>;
      readonly supplyOf: (denom: string) => Promise<Coin>;
      readonly denomMetadata: (denom: string) => Promise</* Metadata */ any>;
      readonly denomsMetadata: () => Promise</* Metadata */ any[]>;
  };
}

declare abstract class BaseCryptoStatsSDK {
  cache: ICache
  readonly coinGecko: CoinGecko
  readonly cosmos: Cosmos
  readonly chainData: ChainData
  readonly date: DateLib
  readonly ethers: Ethers
  readonly graph: Graph
  readonly http: HTTP
  readonly ipfs: IPFS
  readonly log: Log
  readonly plugins: Plugins
  readonly executionTimeout: number
  private lists
  constructor({
    ipfsGateway,
    cache,
    infuraKey,
    moralisKey,
    mongoConnectionString,
    redisConnectionString,
    executionTimeout,
    onLog,
  }?: CryptoStatsOptions)
  protected abstract setupCache(params: {
    mongoConnectionString?: string
    redisConnectionString?: string
  }): void
  getCollection(name: string): List
  getList(name: string): List
  getContext(list: List): Context
}

declare class ChainData {
  private graph
  private date
  private cache
  private log
  private blockNumLoaders
  private promiseCache
  constructor({ graph, date, cache, log }: ChainDataProps)
  getBlockNumber(date: string | number | Date, chain?: string): Promise<number>
  private getBlockNumberInternal
  getBlockSubgraphQuery(subgraph: string): (date: string | Date | number) => Promise<number>
  blockSubgraphQuery(subgraph: string, date: string | Date | number): Promise<number>
  private dateToTime
}

declare interface ChainDataProps {
  graph: Graph
  cache: ICache
  date: DateLib
  log: Log
}

declare interface Coin {
  denom: string;
  amount: string;
}

declare class CoinGecko {
  private cache
  private http
  private log
  constructor({ cache, http, log }: CoinGeckoProps)
  getCurrentPrice(name: string, currency?: string): Promise<any>
  getHistoricalPrice(name: string, date: string): Promise<any>
  getHistoricalMarketData(
    name: string,
    date: string
  ): Promise<{
    price: any
    marketCap: any
  }>
  cacheMarketData(name: string, date: string, price: number, marketCap: number): Promise<void>
  queryCoingecko(
    name: string,
    date: string,
    currency?: string
  ): Promise<{
    price: any
    marketCap: any
  }>
}

declare interface CoinGeckoProps {
  cache: ICache
  http: HTTP
  log: Log
}

declare class Etherscan {
  query(params: any, chain?: string): Promise<any>
}

declare class Context {
  readonly coinGecko: CoinGecko
  readonly cosmos: Cosmos
  readonly chainData: ChainData
  readonly date: DateLib
  readonly ethers: Ethers
  readonly graph: Graph
  readonly http: HTTP
  readonly ipfs: IPFS
  readonly etherscan: Etherscan
  readonly log: LogInterface
  readonly plugins: Plugins
  constructor({
    coinGecko,
    cosmos,
    chainData,
    date,
    graph,
    http,
    ipfs,
    ethers,
    log,
    plugins,
    list,
  }: ContextProps)
  register(registration: RegistrationData): void
  registerBundle(id: string, metadata?: any): void
}

declare interface ContextProps {
  coinGecko: CoinGecko
  cosmos: Cosmos
  chainData: ChainData
  date: DateLib
  ethers: Ethers
  graph: Graph
  http: HTTP
  ipfs: IPFS
  log: Log
  plugins: Plugins
  list: List
}

declare class Cosmos {
  addChain(name: string, url: string): void;
  getStargateClient(chain: string): StargateClient;
  getQueryClient(chain: string): QueryClient & BankExtension;
}

declare interface CryptoStatsOptions {
  ipfsGateway?: string
  cache?: ICache
  infuraKey?: string
  moralisKey?: string
  mongoConnectionString?: string
  redisConnectionString?: string
  executionTimeout?: number
  onLog?: (level: LOG_LEVEL, ...args: any[]) => void
}

declare class CryptoStatsSDK extends BaseCryptoStatsSDK {
  setupCache({
    mongoConnectionString,
    redisConnectionString,
  }: {
    mongoConnectionString?: string
    redisConnectionString?: string
  }): void
}

declare class DateLib {
  dateToTimestamp(date: string | Date): number
  formatDate(date: Date, connector?: string): string
  getYesterdayDate(): string
  getNextDay(date: string): string
  getPreviousDay(date: string): string
  last7Days(date?: Date): string[]
  isBefore(date?: string, comparrison?: string): boolean
  getDateRange(dateStart: string | Date, dateEnd: string | Date): string[]
  offsetDaysFormatted(date: string, numDays: number): string
}

declare class Ethers {
  utils: any
  BigNumber: any
  FixedNumber: any
  private chainData
  private providersByNetwork
  constructor({ chainData }: { chainData: ChainData })
  addProvider(
    name: string,
    url: string,
    {
      archive,
    }?: {
      archive?: boolean
    }
  ): void
  getContract(address: string, abi: any, network?: string): any
  getERC20Contract(address: string, network?: string): any
  getProvider(network: string): any
}

declare interface BaseQueryOptions {
  subgraph?: string
  subgraphId?: string
  query: string
  variables?: any
  operationName?: string
  node?: string
}

declare interface SubgraphQueryOptions extends BaseQueryOptions {
  subgraph: string
}
declare interface SubgraphIDQueryOptions extends BaseQueryOptions {
  subgraphId: string
}
declare interface GraphQLQueryOptions extends BaseQueryOptions {
  url: string
}

declare type QueryOptions = SubgraphQueryOptions | SubgraphIDQueryOptions | GraphQLQueryOptions

declare class Graph {
  private http
  constructor({ http }: GraphProps)

  query(options: QueryOptions): Promise<any>
  query(subgraph: string, query: string, variables?: any): Promise<any>
}

declare interface GraphProps {
  http: HTTP
}

declare class HTTP {
  get(url: string, options?: any): Promise<any>
  post(url: string, body: any, options?: any): Promise<any>
}

declare interface ICache {
  getValue(name: string, type: string, date: string): Promise<any>
  setValue(name: string, type: string, date: string, value: string | number): Promise<void>
}

declare class IPFS {
  private client
  constructor({ gateway }?: IPFSOptions)
  getFile(cid: string): Promise<string>
  getDataURI(cid: string, mimeType: string): Promise<string>
  getDataURILoader(cid: string, mimeType: string): IPFSLoader
}

declare interface IPFSLoader {
  (): Promise<string>
  cid: string
  mimeType: string
}

declare interface IPFSOptions {
  gateway?: string
}

declare class List {
  readonly name: string
  readonly adapters: Adapter[]
  readonly bundleIds: string[]
  private adaptersById
  private bundlesById
  private sdk?
  private adaptersFetched
  constructor(name: string, sdk?: BaseCryptoStatsSDK)
  addAdapter({ id, queries, metadata, bundle }: AdapterData): Adapter
  addBundle(id: string, metadata?: any): void
  getAdapters(): Adapter[]
  getAdapter(id: string): Adapter
  getIDs(): string[]
  getBundle(id: string): Promise<{
    [x: string]: any
  }>
  getBundles(): Promise<
    {
      [x: string]: any
    }[]
  >
  executeQuery(
    type: string,
    ...params: any[]
  ): Promise<
    {
      id: string
      bundle: string | null
      result: any
    }[]
  >
  executeQueryWithMetadata(
    type: string,
    ...params: any[]
  ): Promise<
    {
      id: string
      bundle: string | null
      result: any
      metadata: {
        [x: string]: any
      }
    }[]
  >
  executeQueriesWithMetadata(
    types: string[],
    ...params: any[]
  ): Promise<
    {
      id: string
      results: {
        [type: string]: any
      }
      metadata: any
      bundle: string | null
    }[]
  >
  fetchAdapters(): Promise<
    | [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]
    | undefined
  >
  fetchAdapterFromIPFS(cid: string): Promise<Module>
  addAdaptersWithCode(code: string): Module
  addAdaptersWithSetupFunction(setupFn: SetupFn): Module
}

declare class Log {
  private logListener
  constructor({ onLog }?: LogOptions)
  getLogInterface(): LogInterface
}

declare enum LOG_LEVEL {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

declare interface LogInterface {
  (...args: any[]): void
  log(...args: any[]): void
  error(...args: any[]): void
  warn(...args: any[]): void
  info(...args: any[]): void
  debug(...args: any[]): void
}

declare interface LogOptions {
  onLog?: (level: LOG_LEVEL, ...args: any[]) => void
}

declare class Module {
  name: string | null
  version: string | null
  license: string | null
  sourceFile: string | null
  private code
  private setupFn
  private context
  private executionTimeout
  constructor({
    code,
    setupFn,
    context,
    name,
    version,
    license,
    sourceFile,
    executionTimeout,
  }: ModuleProps)
  evaluate(): void
  setup(): void
}

declare interface ModuleProps {
  code?: string
  setupFn?: SetupFn
  context: Context
  name?: string
  version?: string
  license?: string
  sourceFile?: string
  executionTimeout?: number
}

declare interface Options {
  variables?: any
  operationName?: string
  node?: string
}

declare class Plugins {
  private _plugins
  addPlugin(name: string, plugin: any): void
  getPlugin<T = any>(name: string): T
}

declare class QueryClient {
  queryVerified(store: string, key: Uint8Array, desiredHeight?: number): Promise<Uint8Array>;
  queryRawProof(store: string, queryKey: Uint8Array, desiredHeight?: number): Promise<any /* ProvenQuery*/>;
  queryUnverified(path: string, request: Uint8Array, desiredHeight?: number): Promise<Uint8Array>;
}

declare type QueryFn<Output = any, Input = any> = (...params: Input[]) => Promise<Output>

declare interface RegistrationData {
  id: string
  bundle?: string
  queries: {
    [name: string]: (...args: any[]) => Promise<any>
  }
  metadata: any
}

declare type SetupFn = (context: Context) => void

declare class StargateClient {
  static connect(endpoint: string, options?: any): Promise<StargateClient>;
  getChainId(): Promise<string>;
  getHeight(): Promise<number>;
  getAccount(searchAddress: string): Promise<any/*Account*/ | null>;
  getSequence(address: string): Promise<any /*SequenceResponse*/>;
  getBlock(height?: number): Promise<any /*Block*/>;
  getBalance(address: string, searchDenom: string): Promise<Coin>;
  /**
   * Queries all balances for all denoms that belong to this address.
   *
   * Uses the grpc queries (which iterates over the store internally), and we cannot get
   * proofs from such a method.
   */
  getAllBalances(address: string): Promise<readonly Coin[]>;
  getBalanceStaked(address: string): Promise<Coin | null>;
  getDelegation(delegatorAddress: string, validatorAddress: string): Promise<Coin | null>;
  getTx(id: string): Promise</*IndexedTx*/any | null>;
  searchTx(query: any, filter?: any): Promise<readonly /*IndexedTx*/ any[]>;
  disconnect(): void;
  /**
   * Broadcasts a signed transaction to the network and monitors its inclusion in a block.
   *
   * If broadcasting is rejected by the node for some reason (e.g. because of a CheckTx failure),
   * an error is thrown.
   *
   * If the transaction is not included in a block before the provided timeout, this errors with a `Time
outError`.
   *
   * If the transaction is included in a block, a `DeliverTxResponse` is returned. The caller then
   * usually needs to check for execution success or failure.
   */
  broadcastTx(tx: Uint8Array, timeoutMs?: number, pollIntervalMs?: number): Promise<any>;
}
