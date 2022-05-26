import 'dotenv/config';

import { getPostgresClient } from './src/infrastructures/pgDb';

(async() => {
  const client = await getPostgresClient();
  try {
    const truncateSpending = 'TRUNCATE TABLE spending';
    await client.execute(truncateSpending);
    const truncateTags = 'TRUNCATE TABLE tags';
    await client.execute(truncateTags);
  } finally {
    client.release();
  }
})();
