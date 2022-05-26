import { Postgres } from './pgDb';

export class SpendingRepository {
  #TABLE: string = 'spending';

  #pg: Postgres;

  constructor(pg: Postgres) {
    this.#pg = pg;
  }

  async getSpending() {
    const query = `SELECT * FROM ${this.#TABLE}`;
    const results = await this.#pg.execute(query, []);
    return results;
  }
}
