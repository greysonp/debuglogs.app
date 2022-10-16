/**
 * This is the server. It's fairly simple. It's main purpose is to simply forward files from
 * debuglogs.org to the requesting client, as well serve some static files.
 *
 * Besides the few routes we want to handle ourselves, almost everything just gets redirected
 * to log.html so it can do it's thing.
 */

import {Application, send} from 'https://deno.land/x/oak@v11.1.0/mod.ts';

async function main() {
  const app = new Application()

  app.use(async (ctx) => {
    const path = ctx.request.url.pathname

    if (path.startsWith('/proxy/')) {
      const proxied = path.substring('/proxy/'.length)

      if (proxied.startsWith('ios')) {
        const proxyRes = await fetch(`https://debuglogs.org/${proxied}`);
        ctx.response.type = 'application/zip'
        ctx.response.body = proxyRes.body
      } else {
        const proxyRes = await fetch(`https://debuglogs.org/${proxied}`);
        ctx.response.type = 'text/plain'
        ctx.response.headers.set('Content-Encoding', 'gzip')
        ctx.response.body = proxyRes.body
      }
    } else if (path.endsWith('.map') && !path.endsWith('dist.js.map') && !path.endsWith('preload.js.map')) {
      ctx.response.status = 404
    } else if (path.startsWith('/public')) {
      await send(ctx, path.substring(1), {root: './'})
    } else if (path === '/') {
      await send(ctx, './public/index.html', {root: './'})
    } else {
      await send(ctx, './public/log.html', {root: './'})
    }
  })

  app.addEventListener('listen', ({ hostname, port, secure }) => {
    console.log(`Listening on port ${port}`)
  });

  await app.listen({ port: 8080 })
}


await main()