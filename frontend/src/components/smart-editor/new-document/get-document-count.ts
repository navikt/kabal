interface IDocumentTitle {
  tittel: string;
}

const DOCUMENT_COUNT_REGEX = /\((\d+)\)$/;

export const getDocumentCount = (documents: IDocumentTitle[], template: IDocumentTitle): number => {
  const counts: number[] = [];
  let exactMatchCount = 0;

  for (const document of documents) {
    if (document.tittel === template.tittel) {
      exactMatchCount++;

      continue;
    }

    if (document.tittel.startsWith(template.tittel)) {
      const match = document.tittel.match(DOCUMENT_COUNT_REGEX);

      if (match === null) {
        continue;
      }

      const [, countStr] = match;

      if (typeof countStr === 'undefined') {
        continue;
      }

      const parsedCount = parseInt(countStr, 10);

      if (Number.isNaN(parsedCount)) {
        continue;
      }

      counts.push(parsedCount);
    }
  }

  if (counts.length === 0) {
    return exactMatchCount ? 1 : 0;
  }

  for (let i = 1; i <= counts.length; i++) {
    if (!counts.includes(i)) {
      return i;
    }
  }

  return counts.length + 1;
};
