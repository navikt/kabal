export interface IBeskrivelse {
  date: string;
  author: {
    name: string;
    navIdent: string;
    enhet: string;
  };
  content: string;
}

const headerSplitRegex = /(\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}) (.*) \((.*), (\d*)\)/;

export const splitBeskrivelse = (beskrivelse: string): IBeskrivelse[] => {
  const lines = beskrivelse.trim().split('\n');

  const result: IBeskrivelse[] = [];
  let current: IBeskrivelse | null = null;

  for (const line of lines) {
    // If the line starts with '---' it could be a header.
    if (line.trimStart().startsWith('---')) {
      const match = headerSplitRegex.exec(line);

      // If it is not a header, it is a continuation of the previous entry.
      if (match === null) {
        if (current !== null) {
          current.content += '\n' + line;
        }

        // Ignore line.
        continue;
      }

      // If it is a header, create a new entry.
      const [, date = 'UKJENT', name = 'UKJENT', navIdent = 'UKJENT', enhet = 'UKJENT'] = match;

      current = { date, author: { name, navIdent, enhet }, content: '' };

      result.push(current);
    } else if (current !== null) {
      // If it is not a header and we have a current entry, it is a continuation of the previous entry.
      current.content += '\n' + line;
    }
    // Otherwise, ignore line.
  }

  return result.map((entry) => ({
    ...entry,
    content: entry.content.trim(),
  }));
};
