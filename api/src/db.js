import pg from 'pg';
import {
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_SSLMODE
} from './configuration.js';

const pool = new pg.Pool({
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
  database: DB_DATABASE,
  port: DB_PORT,
  ssl: DB_SSLMODE === 'require'
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const getAccountIdWithCredentials = async ({ username, password }) =>
  new Promise((resolve, reject) =>
    pool.connect().then(client =>
      client
        .query(
          `SELECT account_id_with_credentials('${username}','${password}') AS account_id;`
        )
        .then(res => {
          const accountId = res.rows[0].account_id;
          return accountId !== null ? resolve(accountId) : reject(403);
        })
        .catch(err => {
          console.log('there was an error', err);
          reject(500, err);
        })
        .then(client.release)
    )
  );
