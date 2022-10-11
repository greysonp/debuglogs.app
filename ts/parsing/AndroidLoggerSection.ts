import {Section} from './Section.ts';

const LOG_PATTERN  = /^\[?(?<version>[^\]]+)\]? ?(\[(?<thread>[0-9main]+)\s*\])? (?<date>[0-9\-]+) (?<time>[0-9:.]+) (?<timezone>[^\s]+) (?<level>[VDIWEA]) ((?<tag>[^:]+): )?(?<message>.*)$/;

export class AndroidLoggerSection extends Section {
  expandByDefault = true
  logs: Log[]
  maxThreadLength: number

  constructor(section: Section) {
    super(section.title)

    this.logs = parseLogs(section.lines)
    this.maxThreadLength = this.logs.reduce((prev, curr) => curr.thread ? Math.max(prev, curr.thread.length) : 0, 0);
    this.lines = this.logs.map(log => {
      return `[${log.version}] [${rightPad(log.thread, this.maxThreadLength)}] ${log.date} ${log.time} ${log.timezone} ${log.level} ${rightPad(log.tag, 23)} ${log.message}`
    })
  }
}

function parseLogs(lines: string[]): Log[] {
  let prevLog: Log | null = null;

  return lines.map(line => {
    const log  = parseLog(line, prevLog);
    prevLog = log;
    return log;
  });
}

function parseLog(line: string, prevLog: Log | null): Log {
  const logMatch = LOG_PATTERN.exec(line);

  if (logMatch && logMatch.groups) {
    return {
      version: logMatch.groups.version,
      thread: logMatch.groups.thread,
      date: logMatch.groups.date,
      time: logMatch.groups.time,
      timezone: logMatch.groups.timezone,
      level: logMatch.groups.level,
      tag: logMatch.groups.tag,
      message: logMatch.groups.message
    };
  } else {
    const log: Log = Object.assign({}, prevLog || { version: '', thread: '', date: '', time: '', timezone: '', level: '', tag: '', message: ''});
    log.message = line;
    return log;
  }
}

function rightPad(val: string | null, length: number) {
  val = val || '';

  if (val.length > length) {
    return val.substr(0, length);
  } else if (val.length === length) {
    return val;
  } else {
    let prefix = '';
    for (let i = 0; i < length - val.length; i++) {
      prefix += ' ';
    }
    return val + prefix;
  }
}

type Log = {
  version: string | null,
  thread: string,
  date: string,
  time: string,
  timezone: string,
  level: string,
  tag: string,
  message: string
}
