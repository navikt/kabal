/* eslint-disable max-lines */
import { describe, expect, it } from 'bun:test';
import { parseHeader } from '@app/components/behandling/behandlingsdetaljer/gosys/parsing/parse-header';
import { GosysEntryAuthorType } from '@app/components/behandling/behandlingsdetaljer/gosys/parsing/type';

describe('parse Gosys header', () => {
  it('should parse simple header', () => {
    const header = '--- 12.06.2024 14:29 F_Z994864 E_Z994864 (Z994864, 4291) ---';

    expect.assertions(1);

    const actual = parseHeader(header);
    expect(actual).toStrictEqual({
      date: new Date(2024, 5, 12, 14, 29),
      author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291', type: GosysEntryAuthorType.EMPLOYEE },
      content: '',
    });
  });

  it('should parse header with name containing comma', () => {
    const header = `--- 12.06.2024 14:29 F_Z994864, E_Z994864 (Z994864, 4291) ---`;

    expect.assertions(1);

    const actual = parseHeader(header);
    expect(actual).toStrictEqual({
      date: new Date(2024, 5, 12, 14, 29),
      author: { name: 'F_Z994864, E_Z994864', navIdent: 'Z994864', enhet: '4291', type: GosysEntryAuthorType.EMPLOYEE },
      content: '',
    });
  });

  it('should parse header with many names', () => {
    const header = `--- 12.06.2024 14:29 Ola Navn Navnesen Normann (Z994864, 4291) ---`;

    expect.assertions(1);

    const actual = parseHeader(header);
    expect(actual).toStrictEqual({
      date: new Date(2024, 5, 12, 14, 29),
      author: {
        name: 'Ola Navn Navnesen Normann',
        navIdent: 'Z994864',
        enhet: '4291',
        type: GosysEntryAuthorType.EMPLOYEE,
      },
      content: '',
    });
  });

  it('should parse header with name containing Norwegian characters', () => {
    const header = `--- 12.06.2024 14:29 Øyvind Øystein Østensen (Z994864, 4291) ---`;

    expect.assertions(1);

    const actual = parseHeader(header);
    expect(actual).toStrictEqual({
      date: new Date(2024, 5, 12, 14, 29),
      author: {
        name: 'Øyvind Øystein Østensen',
        navIdent: 'Z994864',
        enhet: '4291',
        type: GosysEntryAuthorType.EMPLOYEE,
      },
      content: '',
    });
  });

  it('should parse header with name containing dash', () => {
    const header = `--- 12.06.2024 14:29 Ola-Navn Navnesen (Z994864, 4291) ---`;

    expect.assertions(1);

    const actual = parseHeader(header);
    expect(actual).toStrictEqual({
      date: new Date(2024, 5, 12, 14, 29),
      author: { name: 'Ola-Navn Navnesen', navIdent: 'Z994864', enhet: '4291', type: GosysEntryAuthorType.EMPLOYEE },
      content: '',
    });
  });

  it('should parse header with no name', () => {
    const header = `--- 12.06.2024 14:29 (Z994864, 4291) ---`;

    expect.assertions(1);

    const actual = parseHeader(header);
    expect(actual).toStrictEqual({
      date: new Date(2024, 5, 12, 14, 29),
      author: { name: null, navIdent: 'Z994864', enhet: '4291', type: GosysEntryAuthorType.EMPLOYEE },
      content: '',
    });
  });

  it('should parse header with no name and two spaces', () => {
    const header = `--- 12.06.2024 14:29  (Z994864, 4291) ---`;

    expect.assertions(1);

    const actual = parseHeader(header);
    expect(actual).toStrictEqual({
      date: new Date(2024, 5, 12, 14, 29),
      author: { name: null, navIdent: 'Z994864', enhet: '4291', type: GosysEntryAuthorType.EMPLOYEE },
      content: '',
    });
  });

  it('should parse header with no name and five spaces', () => {
    const header = `--- 12.06.2024 14:29     (Z994864, 4291) ---`;

    expect.assertions(1);

    const actual = parseHeader(header);
    expect(actual).toStrictEqual({
      date: new Date(2024, 5, 12, 14, 29),
      author: { name: null, navIdent: 'Z994864', enhet: '4291', type: GosysEntryAuthorType.EMPLOYEE },
      content: '',
    });
  });

  it('should parse header with missing last time digits', () => {
    const header = `--- 12.06.2024 14:0 F_Z994864 E_Z994864 (Z994864, 4291) ---`;

    expect.assertions(1);

    const actual = parseHeader(header);
    expect(actual).toStrictEqual({
      date: new Date(2024, 5, 12, 14, 0),
      author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291', type: GosysEntryAuthorType.EMPLOYEE },
      content: '',
    });
  });

  it('should parse header with missing last time digits', () => {
    const header = `--- 12.06.2024 9:00 F_Z994864 E_Z994864 (Z994864, 4291) ---`;

    expect.assertions(1);

    const actual = parseHeader(header);
    expect(actual).toStrictEqual({
      date: new Date(2024, 5, 12, 9, 0),
      author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291', type: GosysEntryAuthorType.EMPLOYEE },
      content: '',
    });
  });

  it('should parse header with missing first and last time digits', () => {
    const header = `--- 12.06.2024 9:0 F_Z994864 E_Z994864 (Z994864, 4291) ---`;

    expect.assertions(1);

    const actual = parseHeader(header);
    expect(actual).toStrictEqual({
      date: new Date(2024, 5, 12, 9, 0),
      author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291', type: GosysEntryAuthorType.EMPLOYEE },
      content: '',
    });
  });

  it('should parse header with missing leading zero in date', () => {
    const header = `--- 2.6.2024 09:00 F_Z994864 E_Z994864 (Z994864, 4291) ---`;

    expect.assertions(1);

    const actual = parseHeader(header);
    expect(actual).toStrictEqual({
      date: new Date(2024, 5, 2, 9, 0),
      author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291', type: GosysEntryAuthorType.EMPLOYEE },
      content: '',
    });
  });

  it('should parse header with only two leading dashes', () => {
    const header = '-- 12.06.2024 14:29 F_Z994864 E_Z994864 (Z994864, 4291) ---';

    expect.assertions(1);

    const actual = parseHeader(header);
    expect(actual).toStrictEqual({
      date: new Date(2024, 5, 12, 14, 29),
      author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291', type: GosysEntryAuthorType.EMPLOYEE },
      content: '',
    });
  });

  it('should parse header with only two trailing dashes', () => {
    const header = '--- 12.06.2024 14:29 F_Z994864 E_Z994864 (Z994864, 4291) --';

    expect.assertions(1);

    const actual = parseHeader(header);
    expect(actual).toStrictEqual({
      date: new Date(2024, 5, 12, 14, 29),
      author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291', type: GosysEntryAuthorType.EMPLOYEE },
      content: '',
    });
  });

  it('should parse header with system user', () => {
    const header = '--- 12.06.2024 14:29 (kabal-api) ---';

    expect.assertions(1);

    const actual = parseHeader(header);
    expect(actual).toStrictEqual({
      date: new Date(2024, 5, 12, 14, 29),
      author: { name: 'kabal-api', type: GosysEntryAuthorType.SYSTEM },
      content: '',
    });
  });
});
