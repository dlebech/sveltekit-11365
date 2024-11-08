# sveltekit-11365

This is a minimal reproduction of an issue with Sveltekit using http/2 h2c via a custom Node server.

- Build the project with `npm i` and `npm run build`.
- Run the custom server with `PORT=1234 node server.js`.
- Use curl to test http/2 h2c `curl -i --http2-prior-knowledge http://localhost:1234`

The above will work in Node v20.12.0 and earlier, but will fail in Node v20.12.1 and later because of a header issue in `getRequest` in Sveltekit's node implementation.