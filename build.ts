import * as esbuild from 'https://deno.land/x/esbuild@v0.15.10/mod.js'

async function main() {
  if (Deno.args[0] === '--watch') {
    await build()

    log('Watching...')
    const debouncer = new Debouncer(100)
    const watcher = Deno.watchFs('ts/')
    for await (const _event of watcher) {
      debouncer.run(async () => {
        log('Change detected.');
        await build()
      })
    }
  } else {
    await build()
  }
}

async function build() {
  try {
    log('Building...')

    const mainResult = await esbuild.build({
      entryPoints: ['ts/main.ts'],
      bundle: true,
      sourcemap: true,
      outfile: 'public/js/dist.js',
      write: true
    })

    if (mainResult.errors.length > 0 || mainResult.warnings.length > 0) {
      log(mainResult)
    }

    const preloadResult = await esbuild.build({
      entryPoints: ['ts/preload.ts'],
      bundle: true,
      sourcemap: true,
      outfile: 'public/js/preload.js',
      write: true
    })

    log('Complete!')

    if (preloadResult.errors.length > 0 || preloadResult.warnings.length > 0) {
      log(preloadResult)
    }

  } catch (e) {
    log('Failed to build!')
    log(e)
  } finally {
    esbuild.stop()
  }
}

function log(message: any) {
  const date = new Date()
  console.log(`[${date.toLocaleString()}] ${message}`)
}

class Debouncer {

  interval: number
  task: (()=>void) | null = null
  timerId = 0

  constructor(interval: number) {
    this.interval = interval
  }

  run(task: ()=>void) {
    clearTimeout(this.timerId)
    this.task = task
    this.timerId = setTimeout(task, this.interval)
  }
}

await main()