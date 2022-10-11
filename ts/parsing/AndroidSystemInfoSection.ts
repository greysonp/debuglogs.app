import {Section} from './Section.ts';

export class AndroidSystemInfoSection extends Section {
  expandByDefault = true

  constructor(section: Section) {
    super(section.title)
    this.lines = section.lines
    this.lineStyles = section.lineStyles
  }
}