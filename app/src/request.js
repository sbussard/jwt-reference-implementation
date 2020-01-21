import configuration from './configuration.js';

let accessToken;

export const checkHasAccessToken = () => !!accessToken;
export const setAccessToken = token => (accessToken = token);
export const getAccessToken = () => accessToken;

const request = (url, extendedOptions, attempts = 1) =>
  new Promise((resolve, reject) => {
    if (attempts > 3) {
      return reject('Too many failed attempts at request');
    }

    if (url in configuration.urls) {
      fetch(configuration.urls[url], {
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include', // 'same-origin'
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAccessToken()}`
        },
        ...extendedOptions
      })
        .then(res =>
          res.status === 403 && url !== 'refresh' && url !== 'auth'
            ? requestAccessTokenRefresh(attempts + 1).then(() =>
                request(url, extendedOptions, attempts + 1)
              )
            : res.json()
        )
        .then(resolve)
        .catch(reject);
    } else {
      reject('invalid configuration');
    }
  });

export const requestAccessTokenRefresh = (attempts = 1) =>
  request('refresh', { method: 'POST' }, attempts)
    .then(res => res.token)
    .then(setAccessToken);

export const requestDeleteRefreshToken = () =>
  request('refresh', { method: 'DELETE' }).then(() => setAccessToken());

export const requestAccessToken = ({ username, password }) =>
  request('auth', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  })
    .then(res => res.token)
    .then(setAccessToken);

export const fetchFileList = () =>
  request('list', {
    method: 'GET'
  }).then(res => res.fileList);
