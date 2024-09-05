import { parseHeader } from '@app/components/behandling/behandlingsdetaljer/gosys/parsing/parse-header';
import { GosysBeskrivelseEntry } from '@app/components/behandling/behandlingsdetaljer/gosys/parsing/type';

export const splitBeskrivelse = (beskrivelse: string): GosysBeskrivelseEntry[] => {
  const lines = beskrivelse.trim().split('\n');

  const result: GosysBeskrivelseEntry[] = [];
  let current: GosysBeskrivelseEntry | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // If the line starts with '---' it could be a header.
    if (trimmedLine.startsWith('---')) {
      const header = parseHeader(trimmedLine);

      // If it is not a header, it is a continuation of the previous entry.
      if (header === null) {
        if (current !== null) {
          current.content += '\n' + trimmedLine;
        }

        // Ignore line.
        continue;
      }

      // If it is a header, create a new entry.
      current = header;
      result.push(current);
    } else if (current !== null) {
      // If it is not a header and we have a current entry, it is a continuation of the previous entry.
      current.content += '\n' + trimmedLine;
    }
    // Otherwise, ignore line.
  }

  return result.map((entry) => ({
    ...entry,
    content: entry.content.trim(),
  }));
};
