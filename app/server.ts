import 'dotenv/config';
import express from 'express';
import appRouter from './src/routes/app.router';

const server = express();

server.use('/', appRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
})