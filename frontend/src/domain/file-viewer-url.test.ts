import { describe, expect, it } from 'bun:test';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { decodeArchivedDocumentIds, encodeArchivedDocumentIds, getFileViewerUrl } from './file-viewer-url';

describe('encodeArchivedFileIds', () => {
  it('should encode an empty array to an empty string', () => {
    expect.assertions(1);
    expect(encodeArchivedDocumentIds([])).toBe('');
  });

  it('should encode a single file', () => {
    expect.assertions(1);
    const docs: IJournalfoertDokumentId[] = [{ journalpostId: '111', dokumentInfoId: 'aaa' }];
    expect(encodeArchivedDocumentIds(docs)).toBe('111:aaa');
  });

  it('should group multiple files under the same journalpost', () => {
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

describe('decodeArchivedFileIds', () => {
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

describe('getFileViewerUrl', () => {
  it('should return null for an empty archived file set', () => {
    expect.assertions(1);
    expect(getFileViewerUrl({ archivedFiles: [] })).toBeNull();
  });

  it('should return a URL for archived files', () => {
    expect.assertions(1);
    const url = getFileViewerUrl({
      archivedFiles: [
        { journalpostId: '111', dokumentInfoId: 'aaa' },
        { journalpostId: '111', dokumentInfoId: 'bbb' },
      ],
    });
    expect(url).toBe('/file-viewer/archived/111:aaa,bbb');
  });

  it('should return a URL for a new document', () => {
    expect.assertions(1);
    expect(getFileViewerUrl({ newDocument: 'abc-123' }, 'oppgave-456')).toBe('/file-viewer/dua/oppgave-456/abc-123');
  });

  it('should return null for a new document without oppgaveId', () => {
    expect.assertions(1);
    expect(getFileViewerUrl({ newDocument: 'abc-123' })).toBeNull();
  });

  it('should return a URL for a vedleggsoversikt', () => {
    expect.assertions(1);
    expect(getFileViewerUrl({ vedleggsoversikt: 'abc-123' }, 'oppgave-456')).toBe(
      '/file-viewer/dua/oppgave-456/abc-123/vedleggsoversikt',
    );
  });

  it('should return null for a vedleggsoversikt without oppgaveId', () => {
    expect.assertions(1);
    expect(getFileViewerUrl({ vedleggsoversikt: 'abc-123' })).toBeNull();
  });
});
