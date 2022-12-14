/**
 * Just a place to define the language we register to get syntax highlighting working in Monaco.
 */

export const ID = 'logLanguage'

export function register(monaco: any) {
  monaco.languages.register({ id: ID })

  monaco.languages.setMonarchTokensProvider(ID, {
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
        [/^.* ๐ .*$/, "custom-verbose"],
        [/^.* ๐ .*$/, "custom-debug"],
        [/^.* ๐ .*$/, "custom-info"],
        [/^.* ๐งก .*$/, "custom-warning"],
        [/^.* โค๏ธ .*$/, "custom-error"]
      ]
    }
  })
}