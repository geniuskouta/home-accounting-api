import { Pool, PoolClient, QueryResult } from 'pg';
import config from '../config';
import { v4 as uuid } from 'uuid';

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
    if(!pool) {
      pool = new Pool({
        connectionString: config.db.connectionString,
        max: config.db.maxConnection,
        idleTimeoutMillis: config.db.idleTimeoutMillis
      });
    }

    this.client = await pool.connect();
    this.clientId = uuid();
    individualDbClients[this.clientId] = this.client;
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
  return postgres;
}

type TableData = {[field: string]: any};

export const insertTableRow = async (dbClient: Postgres, table: string, row: TableData): Promise<TableData> => {
  const fields = Object.keys(row);
  const values = Object.values(row);
  const paramIndex = Array.from({ length: fields.length }).map((_v, i) => `$${i + 1}`);
  const records = await dbClient.execute(`INSERT INTO ${table} (${fields.join(',')}) VALUES (${paramIndex.join(',')}) RETURNING *`, values);
  return records[0];
}

export const insertTableRows = (dbClient: Postgres, table: string, rows: TableData[]): Promise<TableData[]> => {
  const promises = rows.map((row: TableData) => insertTableRow(dbClient, table, row));
  return Promise.all(promises);
}
