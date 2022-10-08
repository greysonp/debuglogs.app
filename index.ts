import {Application, Context, Router, send} from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import {
  HttpReader,
  ZipReader,
  TextWriter,
} from 'https://deno.land/x/zipjs@v2.6.41/index.js';

const NSE_HEADER = '========= NOTIFICATION SERVICE EXTENSION ========='
const SHARE_HEADER = '========= SHARE EXTENSION ========='
const GENERAL_HEADER = '========= GENERAL ========='

async function main() {
  const app = new Application()

  app.use(async (ctx) => {
    const path = ctx.request.url.pathname

    if (path.startsWith('/proxy/')) {
      const proxied = path.substring('/proxy/'.length)

      if (proxied.startsWith('ios')) {
        await handleIosLog(ctx, proxied)
      } else {
        const proxyRes = await fetch(`https://debuglogs.org/${proxied}`);
        ctx.response.type = 'text/plain'
        ctx.response.headers.set('Content-Encoding', 'gzip')
        ctx.response.body = proxyRes.body
      }
    } else if (path.endsWith('.map')) {
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

async function handleIosLog(ctx: Context, proxied: string) {
  const httpReader = new HttpReader(`https://debuglogs.org/${proxied}`, { useXHR: false, useRangeHeader: false, preventHeadRequest: true});
  const zipReader = new ZipReader(httpReader);
  const entries = await zipReader.getEntries()

  const shareEntries = []
  const nseEntries = []
  const generalEntries = []

  for (const entry of entries) {
    if (entry.filename.indexOf('shareextension') >= 0) {
      shareEntries.push(entry)
    } else if (entry.filename.indexOf('SignalNSE') >= 0) {
      nseEntries.push(entry)
    } else {
      generalEntries.push(entry)
    }
  }

  shareEntries.sort((lhs, rhs) => lhs.lastModDate.getTime() - rhs.lastModDate.getTime())
  nseEntries.sort((lhs, rhs) => lhs.lastModDate.getTime() - rhs.lastModDate.getTime())
  generalEntries.sort((lhs, rhs) => lhs.lastModDate.getTime() - rhs.lastModDate.getTime())

  let text = NSE_HEADER + '\n'
  for (const e of nseEntries) {
    text += await e.getData(new TextWriter());
    text += '\n'
  }

  text += '\n\n'

  text += SHARE_HEADER + '\n'
  for (const e of shareEntries) {
    text += await e.getData(new TextWriter());
    text += '\n'
  }

  text += '\n\n'

  text += GENERAL_HEADER + '\n'
  for (const e of generalEntries) {
    text += await e.getData(new TextWriter());
    text += '\n'
  }

  ctx.response.type = 'text/plain'
  ctx.response.body = text
}

await main()