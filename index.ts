import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

const app = new Application()

app.use(async (ctx) => {
  const path = ctx.request.url.pathname

  if (path.endsWith('.map')) {
    ctx.response.status = 404
  } else if (path.startsWith('/proxy/')) {
    const proxyRes = await fetch(`https://debuglogs.org/${path.substring('/proxy/'.length)}`);
    ctx.response.type = 'text/plain'
    ctx.response.headers.set('Content-Encoding', 'gzip')
    ctx.response.body = proxyRes.body
  } else if (path.startsWith('/js/')) {
    if (path.endsWith('.js')) {
      ctx.response.type = 'text/javascript'
    }
    if (path.endsWith('.css')) {
      ctx.response.type = 'text/css'
    }
    ctx.response.body = await Deno.readTextFile(path.substring(1))
  } else if (path.startsWith('/css/')) {
    if (path.endsWith('.css')) {
      ctx.response.type = 'text/css'
    }
    ctx.response.body = await Deno.readTextFile(path.substring(1))
  } else {
    ctx.response.type = 'text/html'
    ctx.response.body = await Deno.readTextFile('index.html')
  }
})

app.addEventListener('listen', ({ hostname, port, secure }) => {
  console.log(`Listening on port ${port}`)
});
await app.listen({ port: 8080 })