import { parseHeader } from '@app/components/behandling/behandlingsdetaljer/gosys/parsing/parse-header';
import type { GosysBeskrivelseEntry } from '@app/components/behandling/behandlingsdetaljer/gosys/parsing/type';

export const splitBeskrivelse = (beskrivelse: string): GosysBeskrivelseEntry[] => {
  const lines = beskrivelse.trim().split('\n');

  const result: GosysBeskrivelseEntry[] = [];
  let current: GosysBeskrivelseEntry | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    const header = parseHeader(trimmedLine);

    // If it is not a header, it is a continuation of the previous entry or an invalid line.
    if (header === null) {
      // If there is a previous entry, add the line to it.
      if (current !== null) {
        current.content += current.content.length === 0 ? trimmedLine : `\n${trimmedLine}`;
      }

      // If there is no previous entry, ignore the line.
      continue;
    }

    // If it is a header.
    // If there is a previous entry, the previous entry is done.
    if (current !== null) {
      current.content = current.content.trim();
    }

    // Set the new entry as the current entry.
    current = header;
    // Add the new entry to the result list.
    result.push(current);
  }

  return result;
};
