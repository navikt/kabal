export interface IBeskrivelse {
  date: Date;
  author: {
    name: string | null;
    navIdent: string;
    enhet: string;
  };
  content: string;
}
