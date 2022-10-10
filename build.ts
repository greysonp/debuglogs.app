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

    const result = await esbuild.build({
      entryPoints: ['ts/main.ts'],
      bundle: true,
      sourcemap: true,
      outfile: 'js/dist.js',
      write: true
    })

    log('Complete!')

    if (result.errors.length > 0 || result.warnings.length > 0) {
      log(result)
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