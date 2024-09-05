export interface GosysBeskrivelseEntry {
  date: Date;
  author: {
    name: string | null;
    navIdent: string;
    enhet: string;
  };
  content: string;
}
