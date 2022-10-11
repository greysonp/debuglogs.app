import {Section} from './Section.ts';
import {AndroidLoggerSection} from './AndroidLoggerSection.ts';
import {LineStyle, LineStyleType} from './LineStyle.ts';
import {AndroidSystemInfoSection} from './AndroidSystemInfoSection.ts';
import {AndroidLogcatSection} from './AndroidLogcatSection.ts';

const TITLE_PATTERN = /^=+([^=]+)=+$/

export class LogParser {

  static parse(path: string, log: string): LogResult {
    const client: Client = parseClient(path)
    const lines = log.split('\n')
    const sections: Section[] = parseSections(client, lines)
    const out: LogResult = {
      lines: [],
      foldingRanges: [],
      lineStyles: []
    }

    let currentLine = 1;
    let foldStart = currentLine;

    for (const section of sections) {
      out.lines.push(section.title)
      out.lineStyles.push({ lineRange: { start: currentLine, end: currentLine }, type: LineStyleType.TITLE });

      section.lineStyles.map(style => {
        return {
          lineRange: {
            start: style.lineRange.start + currentLine,
            end: style.lineRange.end + currentLine
          },
          type: style.type
        }
      }).forEach(style => out.lineStyles.push(style));

      foldStart = currentLine;
      currentLine++;

      for (const line of section.lines) {
        out.lines.push(line)
        currentLine++;
      }

      out.foldingRanges.push({
        start: foldStart,
        end: currentLine,
        expandByDefault: section.expandByDefault
      });

      out.lines.push('');
      currentLine++;
    }

    return out
  }
}

function parseSections(client: Client, lines: string[]): Section[] {
  const sections: Section[] = []
  let activeSection: Section | null = null

  for (const line of lines) {
    const titleMatch = line.match(TITLE_PATTERN)

    if (titleMatch) {
      if (activeSection) {
        sections.push(mapSection(client, activeSection))
      }

      activeSection = new Section(titleMatch[1].trim())
    } else if (activeSection) {
      activeSection.lines.push(line)
    }
  }

  if (activeSection != null) {
    sections.push(mapSection(client, activeSection))
  }

  return sections
}

function mapSection(client: Client, section: Section): Section {
  if (client === Client.ANDROID) {
    switch(section.title) {
      case 'SYSINFO': return new AndroidSystemInfoSection(section)
      case 'LOGCAT': return new AndroidLogcatSection(section)
      case 'LOGGER': return new AndroidLoggerSection(section)
    }
  } else if (client === Client.IOS) {
    switch (section.title) {
      case 'GENERAL': section.expandByDefault = true; break;
    }
  } else if (client === Client.DESKTOP) {
    switch (section.title) {
      case 'System info':
      case 'Logs':
        section.expandByDefault = true;
        break;
    }
  }

  return section
}

function parseClient(path: string): Client {
  if (path.indexOf('android') >= 0) {
    return Client.ANDROID
  } else if (path.indexOf('ios') >= 0) {
    return Client.IOS
  } else if (path.indexOf('desktop') >= 0) {
    return Client.DESKTOP
  } else {
    throw `Unrecognized client for path: ${path}`
  }
}

enum Client {
  ANDROID, IOS, DESKTOP
}

export type LogResult = {
  lines: string[],
  foldingRanges: {
    start: number,
    end: number,
    expandByDefault: boolean
  }[],
  lineStyles: LineStyle[]
}