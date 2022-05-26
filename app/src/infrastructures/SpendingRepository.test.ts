import { getPostgresClient, Postgres, insertTableRow, insertTableRows } from './pgDb';
import { SpendingRepository } from './SpendingRepository';
import { v4 as uuid } from 'uuid';

describe('SpendingRepository', () => {
  let target: SpendingRepository;
  let dbClient: Postgres;
  let spendings;

  beforeAll(async () => {
    dbClient = await getPostgresClient();
    target = new SpendingRepository(dbClient);

    spendings = await insertTableRows(dbClient, 'spending', [{
      id: uuid(),
      title: 'test1',
      tag_id: 1,
      spent_at: '2022-04-01',
      cost: 300,
    },
    {
      id: uuid(),
      title: 'test2',
      tag_id: 1,
      spent_at: '2022-04-01',
      cost: 3030,
    }]);
  });

  afterAll(() => {
    if(dbClient) {
      dbClient.release();
    }
  });

  it('returns spending history', async () => {
    const result = await target.getSpending();
    const exp = [{
      id: expect.any(String),
      title: 'test1',
      tag_id: 1,
      spent_at: expect.any(Date),
      cost: '300',
    },
    {
      id: expect.any(String),
      title: 'test2',
      tag_id: 1,
      spent_at: expect.any(Date),
      cost: '3030',
    }];
    expect(result).toEqual(expect.arrayContaining(exp));
  });
});
