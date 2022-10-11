import {LogParser, LogResult} from './parsing/LogParser.ts';
import {LineStyleType} from './parsing/LineStyle.ts';

declare const monaco: any
declare const zip: any

const NSE_HEADER = '========= NOTIFICATION SERVICE EXTENSION ========='
const SHARE_HEADER = '========= SHARE EXTENSION ========='
const GENERAL_HEADER = '========= GENERAL ========='

async function main() {
  const editor = initMonaco()

  try {
    const debuglogUrl = `/proxy${window.location.pathname}`
    const result = await fetch(debuglogUrl)
    const contentType: string = result.headers.get('Content-Type') || ''

    console.log(`Got a log response. Status: ${result.status}`)

    if (result.status !== 200) {
      return alert(`Bad response when fetching the log! Status: ${result.status}`)
    }

    let text;
    if (contentType.indexOf('text/plain') >= 0) {
      console.log('Retrieved a plaintext log.')
      text = await result.text()
    } else if (contentType.indexOf('application/zip') >= 0) {
      console.log('Retrieved a zip file log.')
      editor.setValue('Unzipping...')
      text = await readIosLog(result)
    } else {
      return alert(`Unsupported content type: ${contentType}`)
    }

    console.log('Successfully got text content.')

    editor.setValue('Parsing...')
    const logResult: LogResult = LogParser.parse(window.location.pathname, text)

    renderLogResult(editor, logResult)

  } catch (e) {
    alert('Failed to fetch the log! Check the console for details.')
    console.error(e)
  }
}

function initMonaco() {
  const isMobile = window.matchMedia("only screen and (max-width: 480px)").matches;
  console.log(`isMobile: ${isMobile}`)

  monaco.languages.register({ id: 'logLanguage' })

  monaco.languages.setMonarchTokensProvider('logLanguage', {
    tokenizer: {
      root: [
        [/^.* V .*$/, "custom-verbose"],
        [/^.* D .*$/, "custom-debug"],
        [/^.* I .*$/, "custom-info"],
        [/^.* W .*$/, "custom-warning"],
        [/^.* E .*$/, "custom-error"],
        [/^INFO.*$/, "custom-info"],
        [/^WARN.*$/, "custom-warning"],
        [/^ERROR.*$/, "custom-error"],
        [/^.* 💙 .*$/, "custom-verbose"],
        [/^.* 💚 .*$/, "custom-debug"],
        [/^.* 💛 .*$/, "custom-info"],
        [/^.* 🧡 .*$/, "custom-warning"],
        [/^.* ❤️ .*$/, "custom-error"]
      ]
    }
  })

  monaco.editor.defineTheme('greysonDark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'custom-verbose', foreground: '8a8a8a' },
      { token: 'custom-debug', foreground: '5ca72b' },
      { token: 'custom-info', foreground: '46bbb9' },
      { token: 'custom-warning', foreground: 'd6cb37' },
      { token: 'custom-error', foreground: 'ff6b68' }
    ],
    type: "dark",
    colors: {
      'minimap.background': '#2b2b2b',
      'editor.background': '#2b2b2b',
      'editor.foreground': '#ffffff',
      'editor.lineHighlightBackground': '#ffffff11',
      'editor.lineHighlightBorder': '#00000000',
    }
  })


  const editor = monaco.editor.create(document.getElementById('content'), {
    value: 'Loading...',
    automaticLayout: true,
    language: 'logLanguage',
    theme: 'greysonDark',
    readOnly: true,
    fontFamily: 'JetBrains Mono',
    fontSize: 13,
    scrollBeyondLastLine: false,
    renderLineHighlight: 'all',
    lineNumbers: 'on',
    glyphMargin: !isMobile,
    minimap: {
      enabled: !isMobile
    },
    scrollbar: {
      alwaysConsumeMouseWheel: false
    },
  })

  document.fonts.ready.then(() => {
    monaco.editor.remeasureFonts()
  })

  window.onresize = () => {
    editor.layout()
  }

  return editor
}

function renderLogResult(editor: any, result: LogResult) {
  editor.setValue(result.lines.join('\n'))

  const foldingRanges: any[] = result.foldingRanges.map(range => {
    return {
      start: range.start,
      end: range.end,
      kind: range.expandByDefault ? null : monaco.languages.FoldingRangeKind.Comment
    }
  })

  monaco.languages.registerFoldingRangeProvider('logLanguage', {
    provideFoldingRanges: function(model: any, context: any, token: any) {
      return foldingRanges;
    }
  });

  editor.getAction('editor.foldAllBlockComments').run();

  editor.deltaDecorations([], result.lineStyles.map(style => {
    return {
      range: new monaco.Range(style.lineRange.start, 1, style.lineRange.end, 1000),
      options: lineStyleToDecorationOptions(style.type)
    }
  }));
}

function lineStyleToDecorationOptions(style: LineStyleType) {
  switch (style) {
    case LineStyleType.TITLE:
      return {
        inlineClassName: 'logstyle-title'
      }
    case LineStyleType.ALERT:
      return {
        inlineClassName: 'logstyle-alert'
      }
    case LineStyleType.LOGCAT:
      return {
        isWholeLine: true,
        className: 'logstyle-logcat',
        glyphMarginClassName: 'glyph-logcat',
        glyphMarginHoverMessage: {
          value: 'This is from logcat, not our custom logger.'
        }
      }
    default: return ''
  }
}

async function readIosLog(response: Response): Promise<string> {
  const blob = await response.blob()
  const blobReader = new zip.BlobReader(blob)
  const zipReader = new zip.ZipReader(blobReader);
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
    text += await e.getData(new zip.TextWriter());
    text += '\n'
  }

  text += '\n\n'

  text += SHARE_HEADER + '\n'
  for (const e of shareEntries) {
    text += await e.getData(new zip.TextWriter());
    text += '\n'
  }

  text += '\n\n'

  text += GENERAL_HEADER + '\n'
  for (const e of generalEntries) {
    text += await e.getData(new zip.TextWriter());
    text += '\n'
  }

  return text
}

main()
