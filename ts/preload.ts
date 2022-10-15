/**
 * This file runs at the start of the body, and should only do things that need to happen before some of the
 * bulkier libraries load -- like set the background color for the theme.
 */

import * as MonacoThemes from './monaco/MonacoThemes.ts'

const theme = MonacoThemes.getTheme()
MonacoThemes.apply(theme)
console.log(`Applied theme: ${theme}`)
