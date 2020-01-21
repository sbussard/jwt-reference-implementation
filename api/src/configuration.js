const ENV = Object.assign({ PORT: 3000 }, process.env);

export const {
  PORT,
  FRONTEND_URL,
  JWT_SECRET_KEY,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_SSLMODE
} = ENV;

let missingVariables = [
  'FRONTEND_URL',
  'JWT_SECRET_KEY',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_PORT',
  'DB_DATABASE',
  'DB_SSLMODE'
].filter(k => ENV[k] === undefined);

if (missingVariables.length) {
  console.error(
    `\nMissing environment variables: \n\n • ${missingVariables.join(
      '\n • '
    )}\n`
  );
  process.exit(1);
}
