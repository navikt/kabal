import { describe, expect, it } from 'bun:test';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import {
  decodeArchivedDocumentIds,
  encodeArchivedDocumentIds,
  getDocumentSetId,
  getDocumentSetUrl,
} from './document-set-url';

describe('encodeArchivedDocumentIds', () => {
  it('should encode an empty array to an empty string', () => {
    expect.assertions(1);
    expect(encodeArchivedDocumentIds([])).toBe('');
  });

  it('should encode a single document', () => {
    expect.assertions(1);
    const docs: IJournalfoertDokumentId[] = [{ journalpostId: '111', dokumentInfoId: 'aaa' }];
    expect(encodeArchivedDocumentIds(docs)).toBe('111:aaa');
  });

  it('should group multiple documents under the same journalpost', () => {
    expect.assertions(1);
    const docs: IJournalfoertDokumentId[] = [
      { journalpostId: '111', dokumentInfoId: 'aaa' },
      { journalpostId: '111', dokumentInfoId: 'bbb' },
    ];
    expect(encodeArchivedDocumentIds(docs)).toBe('111:aaa,bbb');
  });

  it('should separate different journalposts with semicolons', () => {
    expect.assertions(1);
    const docs: IJournalfoertDokumentId[] = [
      { journalpostId: '111', dokumentInfoId: 'aaa' },
      { journalpostId: '222', dokumentInfoId: 'bbb' },
    ];
    expect(encodeArchivedDocumentIds(docs)).toBe('111:aaa;222:bbb');
  });

  it('should handle mixed grouping', () => {
    expect.assertions(1);
    const docs: IJournalfoertDokumentId[] = [
      { journalpostId: '111', dokumentInfoId: 'aaa' },
      { journalpostId: '222', dokumentInfoId: 'bbb' },
      { journalpostId: '111', dokumentInfoId: 'ccc' },
    ];
    expect(encodeArchivedDocumentIds(docs)).toBe('111:aaa,ccc;222:bbb');
  });
});

describe('decodeArchivedDocumentIds', () => {
  it('should decode an empty string to an empty array', () => {
    expect.assertions(1);
    expect(decodeArchivedDocumentIds('')).toEqual([]);
  });

  it('should decode a single document', () => {
    expect.assertions(1);
    expect(decodeArchivedDocumentIds('111:aaa')).toEqual([{ journalpostId: '111', dokumentInfoId: 'aaa' }]);
  });

  it('should decode multiple documents under the same journalpost', () => {
    expect.assertions(1);
    expect(decodeArchivedDocumentIds('111:aaa,bbb')).toEqual([
      { journalpostId: '111', dokumentInfoId: 'aaa' },
      { journalpostId: '111', dokumentInfoId: 'bbb' },
    ]);
  });

  it('should decode multiple journalposts', () => {
    expect.assertions(1);
    expect(decodeArchivedDocumentIds('111:aaa;222:bbb')).toEqual([
      { journalpostId: '111', dokumentInfoId: 'aaa' },
      { journalpostId: '222', dokumentInfoId: 'bbb' },
    ]);
  });

  it('should skip groups without a colon separator', () => {
    expect.assertions(1);
    expect(decodeArchivedDocumentIds('invalid;222:bbb')).toEqual([{ journalpostId: '222', dokumentInfoId: 'bbb' }]);
  });
});

describe('encode/decode roundtrip', () => {
  it('should roundtrip a complex set of documents', () => {
    expect.assertions(1);
    const docs: IJournalfoertDokumentId[] = [
      { journalpostId: '453885992', dokumentInfoId: '484938271' },
      { journalpostId: '453885992', dokumentInfoId: '484938272' },
      { journalpostId: '453885993', dokumentInfoId: '484938273' },
      { journalpostId: '453885994', dokumentInfoId: '484938274' },
      { journalpostId: '453885994', dokumentInfoId: '484938275' },
      { journalpostId: '453885994', dokumentInfoId: '484938276' },
    ];
    expect(decodeArchivedDocumentIds(encodeArchivedDocumentIds(docs))).toEqual(docs);
  });
});

describe('getDocumentSetId', () => {
  it('should return null for an empty archived documents set', () => {
    expect.assertions(1);
    expect(getDocumentSetId({ archivedDocuments: [] })).toBeNull();
  });

  it('should return the encoded segment for archived documents', () => {
    expect.assertions(1);
    const id = getDocumentSetId({
      archivedDocuments: [
        { journalpostId: '111', dokumentInfoId: 'aaa' },
        { journalpostId: '111', dokumentInfoId: 'bbb' },
      ],
    });
    expect(id).toBe('111:aaa,bbb');
  });

  it('should return the document UUID for a new document', () => {
    expect.assertions(1);
    expect(getDocumentSetId({ newDocument: 'abc-123' })).toBe('abc-123');
  });

  it('should return the document UUID with vedleggsoversikt suffix', () => {
    expect.assertions(1);
    expect(getDocumentSetId({ vedleggsoversikt: 'abc-123' })).toBe('abc-123/vedleggsoversikt');
  });
});

describe('getDocumentSetUrl', () => {
  it('should return null for an empty archived documents set', () => {
    expect.assertions(1);
    expect(getDocumentSetUrl({ archivedDocuments: [] })).toBeNull();
  });

  it('should return a URL for archived documents', () => {
    expect.assertions(1);
    const url = getDocumentSetUrl({
      archivedDocuments: [
        { journalpostId: '111', dokumentInfoId: 'aaa' },
        { journalpostId: '111', dokumentInfoId: 'bbb' },
      ],
    });
    expect(url).toBe('/document-set/archived/111:aaa,bbb');
  });

  it('should return a URL for a new document', () => {
    expect.assertions(1);
    expect(getDocumentSetUrl({ newDocument: 'abc-123' })).toBe('/document-set/dua/abc-123');
  });

  it('should return a URL for a vedleggsoversikt', () => {
    expect.assertions(1);
    expect(getDocumentSetUrl({ vedleggsoversikt: 'abc-123' })).toBe('/document-set/dua/abc-123/vedleggsoversikt');
  });
});
