export enum GosysEntryAuthorType {
  EMPLOYEE = 0,
  SYSTEM = 1,
}

export interface GosysEntryEmployee {
  type: GosysEntryAuthorType.EMPLOYEE;
  name: string | null;
  navIdent: string;
  enhet: string;
}

export interface GosysEntrySystem {
  type: GosysEntryAuthorType.SYSTEM;
  name: string;
}

export interface GosysBeskrivelseEntry {
  date: Date;
  author: GosysEntryEmployee | GosysEntrySystem | null;
  content: string;
}
