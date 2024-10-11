export enum ExpansionTypeEnum {
  AutoCap = 0,
  AlwaysCap = 1,
  AlwaysAllCaps = 2,
}

interface ExampleData {
  short: string;
  tag?: string;
}

export interface ExpandingExampleData extends ExampleData {
  long: string;
  cap: ExpansionTypeEnum;
}

export interface ErrorExampleData extends ExampleData {}
