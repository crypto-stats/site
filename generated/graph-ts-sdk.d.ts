declare module '@graphprotocol/graph-ts' {
  namespace ethereum {
    export declare class Value {}

    export declare class Block {
      public hash: Bytes
      public parentHash: Bytes
      public unclesHash: Bytes
      public author: Address
      public stateRoot: Bytes
      public transactionsRoot: Bytes
      public receiptsRoot: Bytes
      public number: BigInt
      public gasUsed: BigInt
      public gasLimit: BigInt
      public timestamp: BigInt
      public difficulty: BigInt
      public totalDifficulty: BigInt
      public size: BigInt | null
      public baseFeePerGas: BigInt | null
    }

    export declare class Transaction {
      public hash: Bytes
      public index: BigInt
      public from: Address
      public to: Address | null
      public value: BigInt
      public gasLimit: BigInt
      public gasPrice: BigInt
      public input: Bytes
      public nonce: BigInt
    }

    export declare class Log {
      public address: Address
      public topics: Array<Bytes>
      public data: Bytes
      public blockHash: Bytes
      public blockNumber: Bytes
      public transactionHash: Bytes
      public transactionIndex: BigInt
      public logIndex: BigInt
      public transactionLogIndex: BigInt
      public logType: string
      public removed: Wrapped<boolean> | null
    }

    export declare class TransactionReceipt {
      public transactionHash: Bytes
      public transactionIndex: BigInt
      public blockHash: Bytes
      public blockNumber: BigInt
      public cumulativeGasUsed: BigInt
      public gasUsed: BigInt
      public contractAddress: Address
      public logs: Array<Log>
      public status: BigInt
      public root: Bytes
      public logsBloom: Bytes
    }

    export declare class EventParam {
      public name: string
      public value: Value
    }

    export declare class Event {
      public address: Address
      public logIndex: BigInt
      public transactionLogIndex: BigInt
      public logType: string | null
      public block: Block
      public transaction: Transaction
      public parameters: Array<EventParam>
      public receipt: TransactionReceipt | null
    }
  }

  export const ethereum = ethereum

  namespace dataSource {
    function create(name: string, params: Array<string>): void
    function createWithContext(
      name: string,
      params: Array<string>,
      context: DataSourceContext
    ): void

    // Properties of the data source that fired the event.
    function address(): Address
    function network(): string
    function context(): DataSourceContext
  }

  export const dataSource = dataSource

  export declare class DataSourceContext extends Entity {}

  export declare class DataSourceTemplate {
    static create(name: string, params: Array<string>): void

    static createWithContext(name: string, params: Array<string>, context: DataSourceContext): void
  }

  namespace typeConversion {
    function bytesToString(bytes: Uint8Array): string
    function bytesToHex(bytes: Uint8Array): string
    function bigIntToString(bigInt: Uint8Array): string
    function bigIntToHex(bigInt: Uint8Array): string
    function stringToH160(s: string): Bytes
    function bytesToBase58(n: Uint8Array): string
  }

  export const typeConversion = typeConversion

  namespace crypto {
    function keccak256(input: ByteArray): ByteArray
  }
  export const crypto = crypto

  namespace ipfs {
    function cat(hash: string): Bytes | null
    function map(hash: string, callback: string, userData: Value, flags: string[]): void
  }
  export const ipfs = ipfs

  namespace ens {
    function nameByHash(hash: string): string | null
  }
  export const ens = ens

  namespace log {
    export enum Level {
      CRITICAL = 0,
      ERROR = 1,
      WARNING = 2,
      INFO = 3,
      DEBUG = 4,
    }

    function log(level: Level, msg: string): void
    function critical(msg: string, args: Array<string>): void
    function error(msg: string, args: Array<string>): void
    function warning(msg: string, args: Array<string>): void
    function info(msg: string, args: Array<string>): void
    function debug(msg: string, args: Array<string>): void
  }
  export const log = log

  namespace store {
    function get(type: string, id: string): any
    function set(type: string, id: string, val: any): void
    function remove(entity: string, id: string): void
  }

  export const store = store

  export declare class Address extends Bytes {
    static fromString(string: string)
    static fromBytes(b: Bytes): Address
    static zero(): Address
  }

  export declare class BigInt {
    static fromI32(x: i32): BigInt
    static fromU32(x: u32): BigInt
    static fromI64(x: i64): BigInt
    static fromU64(x: u64): BigInt
    static zero(): BigInt
    static fromSignedBytes(bytes: Bytes): BigInt
    static fromByteArray(byteArray: ByteArray): BigInt
    static fromUnsignedBytes(bytes: ByteArray): BigInt

    toHex(): string
    toHexString(): string
    toString(): string
    static fromString(s: string): BigInt
    toI32(): i32
    toU32(): u32
    toI64(): i64
    toU64(): u64
    toBigDecimal(): BigDecimal
    isZero(): boolean
    isI32(): boolean

    abs(): BigInt
    sqrt(): BigInt
    plus(other: BigInt): BigInt
    minus(other: BigInt): BigInt
    times(other: BigInt): BigInt
    div(other: BigInt): BigInt
    divDecimal(other: BigDecimal): BigDecimal
    mod(other: BigInt): BigInt

    equals(other: BigInt): boolean
    notEqual(other: BigInt): boolean
    lt(other: BigInt): boolean
    gt(other: BigInt): boolean
    le(other: BigInt): boolean
    ge(other: BigInt): boolean
    neg(): BigInt
    bitOr(other: BigInt): BigInt
    bitAnd(other: BigInt): BigInt
    leftShift(bits: u8): BigInt
    rightShift(bits: u8): BigInt
    pow(exp: u8): BigInt
    static compare(a: BigInt, b: BigInt): i32
  }

  export declare class BigDecimal {
    digits: BigInt
    exp: BigInt

    static fromString(s: string): BigDecimal
    static zero(): BigDecimal
    toString(): string
    truncate(decimals: i32): BigDecimal
    plus(other: BigDecimal): BigDecimal
    minus(other: BigDecimal): BigDecimal
    times(other: BigDecimal): BigDecimal

    div(other: BigDecimal): BigDecimal
    equals(other: BigDecimal): boolean
    notEqual(other: BigDecimal): boolean
    lt(other: BigDecimal): boolean
    gt(other: BigDecimal): boolean
    le(other: BigDecimal): boolean
    ge(other: BigDecimal): boolean
    neg(): BigDecimal
    static compare(a: BigDecimal, b: BigDecimal): i32
  }

  export declare class ByteArray extends Uint8Array {
    static fromI32(x: i32): ByteArray
    static fromU32(x: u32): ByteArray
    static fromI64(x: i64): ByteArray
    static fromU64(x: u64): ByteArray
    static empty(): ByteArray
    static fromHexString(hex: string): ByteArray
    static fromUTF8(str: string): ByteArray
    static fromBigInt(bigInt: BigInt): ByteArray
    toHex(): string
    toHexString(): string
    toString(): string
    toBase58(): string
    toU32(): u32
    toI32(): i32
    concat(other: ByteArray): ByteArray
    concatI32(other: i32): ByteArray
    toI64(): i64
    toU64(): u64
    equals(other: ByteArray): boolean
    notEqual(other: ByteArray): boolean
  }

  export declare class Bytes extends ByteArray {
    static fromByteArray(byteArray: ByteArray): Bytes
    static fromUint8Array(uint8Array: Uint8Array): Bytes
    static fromHexString(str: string): Bytes
    static fromUTF8(str: string): Bytes
    static fromI32(i: i32): Bytes
    static empty(): Bytes
    concat(other: Bytes): Bytes
    concatI32(other: i32): Bytes
  }

  export declare class TypedMap<K, V> {
    public entries: Array<TypedMapEntry<K, V>>

    set(key: K, value: V): void
    getEntry(key: K): TypedMapEntry<K, V> | null
    mustGetEntry(key: K): TypedMapEntry<K, V>
    get(key: K): V | null
    mustGet(key: K): V
    isSet(key: K): bool
  }

  export declare class Entity extends TypedMap<string, Value> {
    unset(key: string): void
    merge(sources: Array<Entity>): Entity
    setString(key: string, value: string): void
    setI32(key: string, value: i32): void
    setBigInt(key: string, value: BigInt): void
    setBytes(key: string, value: Bytes): void
    setBoolean(key: string, value: bool): void
    setBigDecimal(key: string, value: BigDecimal): void
    getString(key: string): string
    getI32(key: string): i32
    getBigInt(key: string): BigInt
    getBytes(key: string): Bytes
    getBoolean(key: string): boolean
    getBigDecimal(key: string): BigDecimal
  }

  export declare class Result<V, E> {
    _value: Wrapped<V> | null
    _error: Wrapped<E> | null

    get isOk(): boolean
    get isError(): boolean
    get value(): V
    get error(): E
  }

  // value.ts

  export declare enum ValueKind {
    STRING = 0,
    INT = 1,
    BIGDECIMAL = 2,
    BOOL = 3,
    ARRAY = 4,
    NULL = 5,
    BYTES = 6,
    BIGINT = 7,
  }

  export type ValuePayload = u64

  export declare class Value {
    public kind: ValueKind
    public data: ValuePayload

    static fromBooleanArray(input: Array<boolean>): Value
    static fromBytesArray(input: Array<Bytes>): Value
    static fromI32Array(input: Array<i32>): Value
    static fromBigIntArray(input: Array<BigInt>): Value
    static fromBigDecimalArray(input: Array<BigDecimal>): Value
    static fromStringArray(input: Array<string>): Value
    static fromAddressArray(input: Array<Address>): Value
    static fromArray(input: Array<Value>): Value
    static fromBigInt(n: BigInt): Value
    static fromBoolean(b: bool): Value
    static fromBytes(bytes: Bytes): Value
    static fromNull(): Value
    static fromI32(n: i32): Value
    static fromString(s: string): Value
    static fromAddress(s: Address): Value
    static fromBigDecimal(n: BigDecimal): Value

    toAddress(): Address
    toBoolean(): boolean
    toBytes(): Bytes
    toI32(): i32
    toString(): string
    toBigInt(): BigInt
    toBigDecimal(): BigDecimal
    toArray(): Array<Value>
    toBooleanArray(): Array<boolean>
    toBytesArray(): Array<Bytes>
    toStringArray(): Array<string>
    toI32Array(): Array<i32>
    toBigIntArray(): Array<BigInt>
    toBigDecimalArray(): Array<BigDecimal>
    displayData(): string
    displayKind(): string
  }

  export declare class Entity {
    set(key: string, value: Value): void
    get(key: string): Value
  }

  export declare class Wrapped<T> {
    inner: T
  }
}

declare function assert(val: boolean, message: string): void
declare function changetype<T>(val: any): T
