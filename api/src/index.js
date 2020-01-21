import Koa from 'koa';
import koaRouter from 'koa-router';
import koaBody from 'koa-body';
import {
  signAccountId,
  signAccountIdWithRefreshToken
} from './authentication.js';
import { FRONTEND_URL, PORT } from './configuration.js';
import { getAccountIdWithCredentials } from './db.js';

const router = new koaRouter();
const app = new Koa();

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', FRONTEND_URL);
  ctx.set('Access-Control-Allow-Credentials', 'true');
  ctx.set(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  await next();
});

router.post('/auth', async ctx => {
  const { username, password } = ctx.request.body;

  try {
    const accountId = await getAccountIdWithCredentials({
      username,
      password
    });

    if (!!accountId) {
      const [token, refreshToken] = await signAccountId(accountId);
      ctx.cookies.set('refreshToken', refreshToken);
      ctx.body = { token };
    } else {
      ctx.status = 500;
      ctx.body = {};
    }
  } catch (errorCode) {
    ctx.status = errorCode;
    ctx.body = {};
  }
});

router.post('/refresh', async ctx => {
  // TODO invalidate old tokens using database versioning

  const oldToken = ctx.cookies.get('refreshToken');
  const [token, refreshToken] = await signAccountIdWithRefreshToken(oldToken);

  ctx.cookies.set('refreshToken', refreshToken);
  ctx.body = { token };
});

router.delete('/refresh', async ctx => {
  ctx.cookies.set('refreshToken', '');
  ctx.status = 200;
  ctx.body = {};
});

app.use(koaBody({ multipart: true }));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);
