import {Section} from './Section.ts';
import {LineStyleType} from './LineStyle.ts';

export class AndroidLogcatSection extends Section {

  constructor(section: Section) {
    super(section.title)
    this.lines = section.lines

    if (this.lines.length > 0) {
      this.lineStyles = [{
        lineRange: {
          start: 1,
          end: this.lines.length,
        },
        type: LineStyleType.LOGCAT
      }]
    }
  }
}