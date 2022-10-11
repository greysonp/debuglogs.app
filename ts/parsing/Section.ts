import {LineStyle} from './LineStyle.ts';

export class Section {

  title: string
  lines: string[]
  lineStyles: LineStyle[]
  expandByDefault: boolean

  constructor(title: string, expandByDefault: boolean = false) {
    this.title = title
    this.lines = []
    this.lineStyles = []
    this.expandByDefault = expandByDefault
  }
}