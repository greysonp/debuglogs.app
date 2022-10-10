import {Application, Context, Router, send} from 'https://deno.land/x/oak@v11.1.0/mod.ts';

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
    } else if (path.endsWith('.map') && !path.endsWith('dist.js.map')) {
      ctx.response.status = 404
    } else if (path.startsWith('/js/') || path.startsWith('/css/')) {
      await send(ctx, path.substring(1), {root: './'})
    } else {
      await send(ctx, 'index.html', {root: './'})
    }
  })

  app.addEventListener('listen', ({ hostname, port, secure }) => {
    console.log(`Listening on port ${port}`)
  });

  await app.listen({ port: 8080 })
}


await main()