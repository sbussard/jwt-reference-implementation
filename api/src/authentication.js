import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from './configuration.js';

export const signAccountId = accountId =>
  Promise.all([
    new Promise((resolve, reject) =>
      jwt.sign(
        { accountId },
        JWT_SECRET_KEY,
        { algorithm: 'HS512', expiresIn: '30m' },
        (err, token) => (err ? reject(err) : resolve(token))
      )
    ),
    new Promise((resolve, reject) =>
      jwt.sign(
        { accountId },
        JWT_SECRET_KEY,
        { algorithm: 'HS512', expiresIn: '5days' },
        (err, token) => (err ? reject(err) : resolve(token))
      )
    )
  ]);

// TODO make sure it's not expired
export const signAccountIdWithRefreshToken = refreshToken =>
  signAccountId(jwt.decode(refreshToken).accountId);

export const verifyToken = token =>
  new Promise((resolve, reject) =>
    jwt.verify(token, JWT_SECRET_KEY, (err, data) =>
      err ? reject(err) : resolve(data)
    )
  );

// Middleware in case you need it for routes
export const requireAuthorization = () => async (ctx, next) => {
  const header = ctx.get('Authorization');

  try {
    const token = header.split(' ')[1];
    const { accountId } = await verifyToken(token);
    ctx.state.accountId = accountId;
    await next();
  } catch (e) {
    // front end needs to try using the refresh token to get new credentials
    ctx.status = 403;
    ctx.body = { message: 'Token Expired' };
  }
};
