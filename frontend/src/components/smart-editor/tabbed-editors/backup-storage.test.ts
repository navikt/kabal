import { describe, expect, it } from 'bun:test';
import { parseBackup, serializeBackup } from '@/components/smart-editor/tabbed-editors/backup-storage';
import { KEY_PREFIX } from '@/components/smart-editor/tabbed-editors/constants';
import { createSimpleParagraph } from '@/plate/templates/helpers';
import type { KabalValue } from '@/plate/types';
import type { INavEmployee } from '@/types/bruker';

const CONTENT: KabalValue = [createSimpleParagraph('hello')];
const AUTHOR: INavEmployee = { navIdent: 'A123456', navn: 'Ola Nordmann' };
const MODIFIED = '2026-06-04T10:35:12';
const KEY_DATE = '2026-06-04T10:35'; // minute-precision, as produced by BACKUP_KEY_DATE_FORMAT
const KEY = `${KEY_PREFIX}oppgave1/doc1/${KEY_DATE}`;
const LEGACY_KEY = `${KEY_PREFIX}oppgave1/doc1/2026-06-04T10:35`;
describe('parseBackup', () => {
  it('should round-trip a new-format backup', () => {
    expect.assertions(1);

    expect(parseBackup(serializeBackup(CONTENT, MODIFIED, AUTHOR), KEY)).toEqual({
      content: CONTENT,
      modified: MODIFIED,
      author: AUTHOR,
    });
  });

  it('should parse a legacy bare-array backup using the key date as modified, normalised to seconds precision', () => {
    expect.assertions(1);

    expect(parseBackup(JSON.stringify(CONTENT), LEGACY_KEY)).toEqual({
      content: CONTENT,
      modified: '2026-06-04T10:35:00',
      author: null,
    });
  });

  it('should return null for a legacy bare-array backup with an invalid key date', () => {
    expect.assertions(1);

    expect(parseBackup(JSON.stringify(CONTENT), `${KEY_PREFIX}oppgave1/doc1/not-a-date`)).toBeNull();
  });

  it('should return null for invalid JSON', () => {
    expect.assertions(1);

    expect(parseBackup('not json', KEY)).toBeNull();
  });

  it('should return null for an object missing content', () => {
    expect.assertions(1);

    expect(parseBackup(JSON.stringify({ modified: MODIFIED, author: AUTHOR }), KEY)).toBeNull();
  });

  it('should return null for an object with non-array content', () => {
    expect.assertions(1);

    expect(parseBackup(JSON.stringify({ content: 'nope', modified: MODIFIED, author: AUTHOR }), KEY)).toBeNull();
  });

  it('should return null for an object missing modified', () => {
    expect.assertions(1);

    expect(parseBackup(JSON.stringify({ content: CONTENT, author: AUTHOR }), KEY)).toBeNull();
  });

  it('should return null for an object with non-string modified', () => {
    expect.assertions(1);

    expect(parseBackup(JSON.stringify({ content: CONTENT, modified: 123, author: AUTHOR }), KEY)).toBeNull();
  });

  it('should return null for an object missing author', () => {
    expect.assertions(1);

    expect(parseBackup(JSON.stringify({ content: CONTENT, modified: MODIFIED }), KEY)).toBeNull();
  });

  it('should return null for an object with malformed author navIdent', () => {
    expect.assertions(1);

    const raw = JSON.stringify({
      content: CONTENT,
      modified: MODIFIED,
      author: { navIdent: 123, navn: 'Ola Nordmann' },
    });

    expect(parseBackup(raw, KEY)).toBeNull();
  });

  it('should return null for an object with malformed author navn', () => {
    expect.assertions(1);

    const raw = JSON.stringify({ content: CONTENT, modified: MODIFIED, author: { navIdent: 'A123456', navn: 123 } });

    expect(parseBackup(raw, KEY)).toBeNull();
  });
});
