declare const zip: any

const NSE_HEADER = '========= NOTIFICATION SERVICE EXTENSION ========='
const SHARE_HEADER = '========= SHARE EXTENSION ========='
const GENERAL_HEADER = '========= GENERAL ========='

/**
 * Retrieves the text of the log, doing whatever is needed (like unzipping an iOS log).
 */
export async function fetchLog(logUrl: string, editor: any): Promise<string> {
  const debuglogUrl = `/proxy${logUrl}`
  const result = await fetch(debuglogUrl)
  const contentType: string = result.headers.get('Content-Type') || ''

  console.log(`Got a log response. Status: ${result.status}`)

  if (result.status !== 200) {
    throw `Bad response when fetching the log! Status: ${result.status}`
  }

  let text
  if (contentType.indexOf('text/plain') >= 0) {
    console.log('Retrieved a plaintext log.')
    text = await result.text()
  } else if (contentType.indexOf('application/zip') >= 0) {
    console.log('Retrieved a zip file log.')
    editor.setValue('Unzipping...')
    text = await readIosLog(result)
  } else {
    throw `Unsupported content type: ${contentType}`
  }

  return text
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
