# debuglogs.app

This is the source for [debuglogs.app](https://debuglogs.app): an in-browser viewer for Signal's debuglogs.org logs.
To use the site, simply replace `.org` with `.app` on any debuglog, and you'll jump into an in-browser viewer.

## Running locally

This is a simple Deno/TypeScript app. The only dependency is [Deno](https://deno.land/#installation).

The quickest way to get started is to simply run:

```bash
./run.sh
```

This will build the client and start the server on port 8080. You can view any log by replacing `debuglogs.org` with
`localhost:8080`.

##  Developing

During development, you can run the builder in "watch" mode to re-compile the client code whenever you change something:

```bash
deno run -A build.ts --watch
```

## How it works

The server itself (`index.ts`) is little more than a proxy. It just serves static files and exposes a `/proxy` endpoint 
to allow the client code to fetch the raw contents of the debuglogs.org log file.

All of the actual work is done on the client. The client takes the file, formats it (which may even involve unzipping
using [zip.js](https://gildas-lormeau.github.io/zip.js/)), and then renders it using 
[Monaco](https://microsoft.github.io/monaco-editor/), the editor behind VSCode.