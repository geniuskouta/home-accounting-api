const config: any = {};

function buildConfig() {
  config.db = {
    connectionString: process.env.PGCONNECTIONSTRING,
    maxConnection: Number(process.env.MAX_CONNECTION) || 150,
    idleTimeoutMillis: 60000,
  };
}

buildConfig();

export default config;
