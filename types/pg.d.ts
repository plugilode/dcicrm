declare module 'pg' {
  export class Pool {
    constructor(options?: any);
    connect(): Promise<PoolClient>;
    end(): Promise<void>;
    query(text: string, params?: any[]): Promise<QueryResult>;
  }

  export class Client {
    constructor(options?: any);
    connect(): Promise<void>;
    end(): Promise<void>;
    query(text: string, params?: any[]): Promise<QueryResult>;
  }

  export interface PoolClient {
    query(text: string, params?: any[]): Promise<QueryResult>;
    release(): void;
  }

  export interface QueryResult {
    rows: any[];
    rowCount: number;
    command: string;
    oid: number;
    fields: any[];
  }
}
