import {LineStyleType} from './parsing/LineStyle.ts';
import { LogResult} from './parsing/LogParser.ts';
import * as LogParser from './parsing/LogParser.ts'
import * as  MonacoThemes from './monaco/MonacoThemes.ts'
import * as  MonacoLogLanguage from './monaco/MonacoLogLanguage.ts'
import * as LogFetcher from './LogFetcher.ts'

declare const monaco: any

async function main() {
  const editor = initMonaco()

  try {
    const logText = await LogFetcher.fetchLog(window.location.pathname, editor)
    console.log('Successfully got text content.')

    editor.setValue('Parsing...')
    const logResult: LogResult = LogParser.parse(window.location.pathname, logText)

    renderLogResult(editor, logResult)
  } catch (e) {
    console.error(e)
    alert(e)
  }
}

function initMonaco() {
  const isMobile = window.matchMedia("only screen and (max-width: 480px)").matches;
  console.log(`isMobile: ${isMobile}`)

  MonacoLogLanguage.register(monaco)
  MonacoThemes.register(monaco)

  const editor = monaco.editor.create(document.getElementById('content'), {
    value: 'Downloading...',
    automaticLayout: true,
    language: MonacoLogLanguage.ID,
    theme: MonacoThemes.DEFAULT,
    readOnly: true,
    fontFamily: 'JetBrains Mono',
    fontSize: 13,
    scrollBeyondLastLine: false,
    renderLineHighlight: 'all',
    lineNumbers: !isMobile ? 'on' : 'off',
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

main()
