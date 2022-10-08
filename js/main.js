async function main() {
  const debuglogUrl = `/proxy${window.location.pathname}`
  console.log(debuglogUrl)

  const editor = initMonaco()

  const result = await fetch(debuglogUrl)
  const text = await result.text()

  editor.setValue(text)
}

function initMonaco() {
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
    // fontFamily: 'JetBrains Mono',
    fontSize: 13,
    scrollBeyondLastLine: false,
    renderLineHighlight: 'all',
    lineNumbers: 'on',
    scrollbar: {
      alwaysConsumeMouseWheel: false
    },
    // wordWrap: localStorage.getItem('wordWrap') || DEFAULT_WORD_WRAP,
  })

  document.fonts.ready.then(() => {
    monaco.editor.remeasureFonts()
  })

  window.onresize = () => {
    editor.layout()
  }

  return editor
}

main()