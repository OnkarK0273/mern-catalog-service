import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'dev'}`),
});

const { PORT, NODE_ENV, CLIENT_ORIGIN_URL } = process.env;

export const config = {
  PORT,
  NODE_ENV,
  CLIENT_ORIGIN_URL,
};
