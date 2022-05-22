import { Pool, PoolClient, QueryResult } from 'pg';
import config from '../config';

// DB接続・設定情報
let pool: Pool;

// 接続中のクライアントリスト
const individualDbClients: {
  [key: string]: PoolClient
} = {};

export class Postgres {
  private client!: PoolClient;

  private clientId!: string;

  onError(func: (err: any) => void) {
    this.client.on('error', func);
  }

  async init(): Promise<void> {
    pool = new Pool({
      connectionString: config.db.connectionString,
      max: config.db.maxConnection,
      idleTimeoutMillis: config.db.idleTimeoutMillis
    });
  }

  async execute(query: string, params: Array<any> = []): Promise<any[]> {
    const result: QueryResult<any> = await this.client.query(query, params);
    return result.rows;
  }

  release(): void {
    this.client.release();
    delete individualDbClients[this.clientId];
  }

  async begin(): Promise<void> {
    await this.client.query('BEGIN');
  }

  async commit(): Promise<void> {
    await this.client.query('COMMIT');
  }

  async rollback(): Promise<void> {
    await this.client.query('ROLLBACK');
  }
}

export const getPostgresClient = async(): Promise<Postgres> => {
  const postgres = new Postgres();
  await postgres.init();
  console.log(pool);
  return postgres;
}
