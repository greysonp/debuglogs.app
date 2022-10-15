
const GREYSON_DARK = 'greysonDark'
const ATOM_ONE_LIGHT = 'atomOneLight'
const DRACULA = 'dracula'
const GITHUB = 'github'
const JETBRAINS_DARCULA = 'jetbrainsDarcula'
const SOLARIZED_DARK = 'solarizedDark'
const SOLARIZED_LIGHT = 'solarizedLight'

export const DEFAULT = GREYSON_DARK

export function register(monaco: any) {
  monaco.editor.defineTheme(GREYSON_DARK, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      {token: 'custom-verbose', foreground: '8a8a8a'},
      {token: 'custom-debug', foreground: '5ca72b'},
      {token: 'custom-info', foreground: '46bbb9'},
      {token: 'custom-warning', foreground: 'd6cb37'},
      {token: 'custom-error', foreground: 'ff6b68'}
    ],
    type: 'dark',
    colors: {
      'minimap.background': '#2b2b2b',
      'editor.background': '#2b2b2b',
      'editor.foreground': '#ffffff',
      'editor.lineHighlightBackground': '#ffffff11',
      'editor.lineHighlightBorder': '#00000000',
    }
  })

  monaco.editor.defineTheme(ATOM_ONE_LIGHT, {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'custom-verbose', foreground: '8a8a8a' },
      { token: 'custom-debug', foreground: '3e953a' },
      { token: 'custom-info', foreground: '2f5af3' },
      { token: 'custom-warning', foreground: '9e7d36' },
      { token: 'custom-error', foreground: 'de3d35' }
    ],
    type: 'light',
    colors: {
      'minimap.background': '#f8f8f8',
      'editor.background': '#f8f8f8',
      'editor.foreground': '#2a2b33',
      'editor.lineHighlightBackground': '#00000011',
      'editor.lineHighlightBorder': '#00000000',
    }
  });

  monaco.editor.defineTheme(DRACULA, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'custom-verbose', foreground: '6272a4' },
      { token: 'custom-debug', foreground: '50fa7b' },
      { token: 'custom-info', foreground: '8be9fd' },
      { token: 'custom-warning', foreground: 'ffb86c' },
      { token: 'custom-error', foreground: 'ff5555' }
    ],
    type: 'dark',
    colors: {
      'minimap.background': '#282a36',
      'editor.background': '#282a36',
      'editor.foreground': '#f8f8f2',
      'editor.lineHighlightBackground': '#ffffff11',
      'editor.lineHighlightBorder': '#00000000',
    }
  });

  monaco.editor.defineTheme(GITHUB, {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'custom-verbose', foreground: '3e3e3e' },
      { token: 'custom-debug', foreground: '07962a' },
      { token: 'custom-info', foreground: '003e8a' },
      { token: 'custom-warning', foreground: 'b9a209' },
      { token: 'custom-error', foreground: '970b16' }
    ],
    type: 'light',
    colors: {
      'minimap.background': '#f4f4f4',
      'editor.background': '#f4f4f4',
      'editor.foreground': '#3e3e3e',
      'editor.lineHighlightBackground': '#00000011',
      'editor.lineHighlightBorder': '#00000000',
    }
  });


  monaco.editor.defineTheme(JETBRAINS_DARCULA, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'custom-verbose', foreground: '8a8a8a' },
      { token: 'custom-debug', foreground: '6a8759' },
      { token: 'custom-info', foreground: '7a9ec2' },
      { token: 'custom-warning', foreground: 'ffc66d' },
      { token: 'custom-error', foreground: 'ff6b68' }
    ],
    type: 'dark',
    colors: {
      'minimap.background': '#242424',
      'editor.background': '#242424',
      'editor.foreground': '#ffffff',
      'editor.lineHighlightBackground': '#ffffff11',
      'editor.lineHighlightBorder': '#00000000',
    }
  });

  monaco.editor.defineTheme(SOLARIZED_DARK, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'custom-verbose', foreground: '8a8a8a' },
      { token: 'custom-debug', foreground: '728905' },
      { token: 'custom-info', foreground: '2075c7' },
      { token: 'custom-warning', foreground: 'a57705' },
      { token: 'custom-error', foreground: 'd01b24' }
    ],
    type: 'dark',
    colors: {
      'minimap.background': '#001e26',
      'editor.background': '#001e26',
      'editor.foreground': '#708183',
      'editor.lineHighlightBackground': '#ffffff11',
      'editor.lineHighlightBorder': '#00000000',
    }
  });

  monaco.editor.defineTheme(SOLARIZED_LIGHT, {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'custom-verbose', foreground: '8a8a8a' },
      { token: 'custom-debug', foreground: '5f8700' },
      { token: 'custom-info', foreground: '0087ff' },
      { token: 'custom-warning', foreground: 'af8700' },
      { token: 'custom-error', foreground: 'd70000' }
    ],
    type: 'light',
    colors: {
      'minimap.background': '#fdf6e3',
      'editor.background': '#fdf6e3',
      'editor.foreground': '#52676f',
      'editor.lineHighlightBackground': '#00000011',
      'editor.lineHighlightBorder': '#00000000',
    }
  });
}