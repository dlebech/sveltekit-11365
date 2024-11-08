import polka from 'polka';
import http2 from 'node:http2';
import { handler } from './build/handler.js';
import { env } from './build/env.js';

const path = env('SOCKET_PATH', false);
const host = env('HOST', '0.0.0.0');
const port = env('PORT', !path && '3000');

// Note: http2.createServer() is unencrypted and will not work in any browser
// This server should be behind a reverse proxy (eg. NGINX) with SSL termination.
const server = polka({ server: http2.createServer() })
  .use(handler)
  .listen({ path, host, port }, () => {
    console.log(`Listening on ${path ? path : host + ':' + port}`);
  });

const sessions = new Set();

server.server.on('session', (session) => {
  sessions.add(session);
  session.on('close', () => {
    sessions.delete(session);
  });
});

function shutdown() {
  server.server.close(() => {
    console.log('Server has closed.');
  });

  for (const session of sessions) {
    session.close();
  }
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('exit', () => {
  console.log('Process is exiting.');
});
