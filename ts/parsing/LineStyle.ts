export type LineStyle = {
  lineRange: {
    start: number,
    end: number,
  },
  type: LineStyleType
}

export enum LineStyleType {
  TITLE, ALERT, LOGCAT
}