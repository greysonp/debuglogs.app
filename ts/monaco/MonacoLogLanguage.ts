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
        [/^.* 💙 .*$/, "custom-verbose"],
        [/^.* 💚 .*$/, "custom-debug"],
        [/^.* 💛 .*$/, "custom-info"],
        [/^.* 🧡 .*$/, "custom-warning"],
        [/^.* ❤️ .*$/, "custom-error"]
      ]
    }
  })
}