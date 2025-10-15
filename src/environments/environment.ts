// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  name: 'Local',
  production: false,
  // tslint:disable-next-line:max-line-length
  rss_feeds_default_days: 7,
  GOOGLE_CLIENT_KEY: '31329435502-h181j984leh6aefdjj8mfgtck9c3bq4m.apps.googleusercontent.com',
  FACEBOOK_APP_ID: '300269754358214',
  TWITTER_APP_ID: 'Q1ktZThQc3llNTY3dktWNjk4TUE6MTpjaQ',
  LINKEDIN_APP_ID: '775qt148agm2gz',
  BACKEND_GO_URL: 'http://localhost:8081',
  HUGO_URL: 'http://localhost:1313',
  // Used by Auth framework
  apiUrl: 'http://localhost:3030/api',
  BACKEND_NODE_URL: 'http://localhost:3030',
  BACKEND_PY_TOPIC_NAME: 'production_backend-py',
  BACKEND_RUST_TOPIC_NAME: 'production_backend-rust',
  BACKEND_PY_TOPIC_MAX_CLIENTS: 18,
  DATA_SERVICE_BASE: 'http://localhost:3030',
  PORTFOLIO_SERVICE_BASE: 'http://localhost:3030',
  ANALYTICS_SERVICE_BASE: 'http://localhost:8081',
  QUOTES_SERVICE_BASE: 'http://localhost:5001',
  ANALYTICS_SOCKET_SERVICE_BASE: 'wss://localhost:8081',
  CONTABO_BUCKET_NAME: 'sravz-dev',
  testUser: {
    // tslint:disable
    token: {
      expires_in: 3600000,
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiQFVzZXIiLCJyb2xlIjoidXNlciIsIm5iZiI6MTU2NDA2MTQ1NywiZXhwIjoxNTk1NjgzODU3LCJpc3MiOiJpc3N1ZXJfc2FtcGxlIiwiYXVkIjoiYXVkaWVuY2Vfc2FtcGxlIn0.xAAbQIOsw3ZXlIxDFnv5NynZy7OfzrvrJYWsy2NEBbA',
    },
    // tslint:enable
    email: 'user@user.user',
  },
  recaptchaSiteKey: '6Lf6bQ8UAAAAAF6EK8QqMHK1cgzg-e--G7hJ7-jK',
  JWT_IGNORE_PATHS: ['/auth/login', '/auth/login-guest', '/auth/sign-up', '/auth/request-pass', '/auth/refresh-token', 'contabostorage.com', 's3.amazonaws.com', 'accounts.google.com']
};
