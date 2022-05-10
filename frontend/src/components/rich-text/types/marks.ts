export enum MarkKeys {
  bold = 'bold',
  italic = 'italic',
  underline = 'underline',
  strikethrough = 'strikethrough',
  subscript = 'subscript',
  superscript = 'superscript',
}

export interface IMarks {
  [MarkKeys.bold]?: boolean;
  [MarkKeys.italic]?: boolean;
  [MarkKeys.underline]?: boolean;
  [MarkKeys.strikethrough]?: boolean;
  [MarkKeys.subscript]?: boolean;
  [MarkKeys.superscript]?: boolean;
}
