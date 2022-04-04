declare module '@graphprotocol/graph-ts' {
  namespace ethereum {
    export declare class Event {
      public parameters: any[]
      public transaction: any
    }
  }

  export const ethereum = ethereum

  namespace store {
    function get(type: string, id: string): any
    function set(type: string, id: string, val: any): void
  }

  export const store = store

  export declare class Address {
    static fromString(string: string);
  }

  export declare class BigInt {}
  export declare class Bytes {
    static empty(): Bytes
  }

  export declare enum ValueKind {
    STRING
  }

  export declare class Value {
    kind: ValueKind

    static fromBytes(bytes: any)
    static fromString(str: string)

    toBytes(): Bytes
    displayData(): string
    displayKind(): string
  }

  export declare class Entity {
    set(key: string, value: Value): void
    get(key: string): Value
  }
}

declare function assert(val: boolean, message: string): void
declare function changetype<T>(val: any): T
