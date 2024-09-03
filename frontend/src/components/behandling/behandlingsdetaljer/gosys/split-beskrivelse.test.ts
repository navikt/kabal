/* eslint-disable max-lines */
import { describe, expect, it } from 'bun:test';
import { splitBeskrivelse } from '@app/components/behandling/behandlingsdetaljer/gosys/split-beskrivelse';

const malformed = `            --- 11.06.2024 13:09 F_Z994864 E_Z994864 (Z994864, 4291) ---\n
            Oppdaterte frist.\n
            --- 10.06.2024 10:45 F_Z994864 E_Z994864 (Z994864, 4291) ---
Tilordner.
Oppgaven er flyttet fra enhet 4712 til 4291, fra saksbehandler <ingen> til Z994864, 

--- 07.06.2024 12:35 F_Z994864 E_Z994864 (Z994864, 4291) ---
Saksblokk : A01
Status : OK
Bekreftelsesbrev sendt : Nei

--- 07.06.2024 12:35 F_Z994864 E_Z994864 (Z994864, 4291) ---
Mottatt en klage fra bruker.

STK2 : Høreapparat
STK3 : 
Sakstype : Klage
Mottatt dato : 21.05.2024`;

const noContent = `--- 12.06.2024 14:29 F_Z994864 E_Z994864 (Z994864, 4291) ---`;

const twoNoContent = noContent + '\n' + noContent;

const eightLines = `--- 12.06.2024 14:29 F_Z994864 E_Z994864 (Z994864, 4291) ---
Overførte oppgaven fra Kabin til Kabal.
Oppdaterte frist

--- 12.06.2024 14:08 F_Z994864 E_Z994864 (Z994864, 4291) ---
Oppdaterte frist.
Overførte oppgave til Kabal fra Kabin.
Tildelte oppgaven til Z994864.
--- 12.06.2024 11:11 F_Z994864 E_Z994864 (Z994864, 4291) ---

Oppgaven er flyttet   fra mappe Hjelpemidler til <ingen>

--- 12.06.2024 10:18 F_Z994864 E_Z994864 (Z994864, 4291) ---

Oppgaven er flyttet   fra mappe <ingen> til Hjelpemidler

--- 12.06.2024 10:18 F_Z994864 E_Z994864 (Z994864, 4291) ---
Flyttet til riktig enhet
Oppgaven er flyttet fra enhet 4712 til 4293  

--- 12.06.2024 10:10 F_Z994864 E_Z994864 (Z994864, 4291) ---
Oppdaterte frist.
Overførte oppgave til Kabal.
--- 12.06.2024 10:05 F_Z994864 E_Z994864 (Z994864, 4291) ---
Saksblokk : A04
Status : OK
Bekreftelsesbrev sendt : Nei

--- 12.06.2024 10:05 F_Z994864 E_Z994864 (Z994864, 4291) ---
Mottok en klage

STK2 : Høreapparat
STK3 : 
Sakstype : Klage
Mottatt dato : 24.05.2024`;

const oneLine = `--- 12.06.2024 14:29 F_Z994864 E_Z994864 (Z994864, 4291) ---
Overførte oppgaven fra Kabin til Kabal.`;

const twoLines = `--- 12.06.2024 14:29 F_Z994864 E_Z994864 (Z994864, 4291) ---
Overførte oppgaven fra Kabin til Kabal.

--- 12.06.2024 15:45 F_Z994864 E_Z994864 (Z994864, 4291) ---
Oppdaterte frist`;

const threeLines = `--- 12.06.2024 14:29 F_Z994864 E_Z994864 (Z994864, 4291) ---
Overførte oppgaven fra Kabin til Kabal.

--- 12.06.2024 15:45 F_Z994864 E_Z994864 (Z994864, 4291) ---
Oppdaterte frist

--- 12.06.2024 10:18 F_Z994864 E_Z994864 (Z994864, 4291) ---
Flyttet til riktig enhet

Oppgaven er flyttet fra enhet 4712 til 4293`;

describe('split beskrivelse', () => {
  it('should split one line', () => {
    expect.assertions(1);

    const actual = splitBeskrivelse(oneLine);
    expect(actual).toStrictEqual([
      {
        date: '12.06.2024 14:29',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Overførte oppgaven fra Kabin til Kabal.',
      },
    ]);
  });

  it('should split two lines', () => {
    expect.assertions(1);

    const actual = splitBeskrivelse(twoLines);
    expect(actual).toStrictEqual([
      {
        date: '12.06.2024 14:29',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Overførte oppgaven fra Kabin til Kabal.',
      },
      {
        date: '12.06.2024 15:45',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Oppdaterte frist',
      },
    ]);
  });

  it('should split three lines', () => {
    expect.assertions(1);

    const actual = splitBeskrivelse(threeLines);
    expect(actual).toStrictEqual([
      {
        date: '12.06.2024 14:29',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Overførte oppgaven fra Kabin til Kabal.',
      },
      {
        date: '12.06.2024 15:45',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Oppdaterte frist',
      },
      {
        date: '12.06.2024 10:18',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Flyttet til riktig enhet\n\nOppgaven er flyttet fra enhet 4712 til 4293',
      },
    ]);
  });

  it('should split eight lines', () => {
    expect.assertions(2);

    const actual = splitBeskrivelse(eightLines);
    expect(actual).toHaveLength(8);
    expect(actual).toStrictEqual([
      {
        date: '12.06.2024 14:29',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Overførte oppgaven fra Kabin til Kabal.\nOppdaterte frist',
      },
      {
        date: '12.06.2024 14:08',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Oppdaterte frist.\nOverførte oppgave til Kabal fra Kabin.\nTildelte oppgaven til Z994864.',
      },
      {
        date: '12.06.2024 11:11',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Oppgaven er flyttet   fra mappe Hjelpemidler til <ingen>',
      },
      {
        date: '12.06.2024 10:18',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Oppgaven er flyttet   fra mappe <ingen> til Hjelpemidler',
      },
      {
        date: '12.06.2024 10:18',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Flyttet til riktig enhet\nOppgaven er flyttet fra enhet 4712 til 4293',
      },
      {
        date: '12.06.2024 10:10',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Oppdaterte frist.\nOverførte oppgave til Kabal.',
      },
      {
        date: '12.06.2024 10:05',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Saksblokk : A04\nStatus : OK\nBekreftelsesbrev sendt : Nei',
      },
      {
        date: '12.06.2024 10:05',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Mottok en klage\n\nSTK2 : Høreapparat\nSTK3 : \nSakstype : Klage\nMottatt dato : 24.05.2024',
      },
    ]);
  });

  it('should split malformed', () => {
    expect.assertions(1);

    const actual = splitBeskrivelse(malformed);
    expect(actual).toStrictEqual([
      {
        date: '11.06.2024 13:09',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Oppdaterte frist.',
      },
      {
        date: '10.06.2024 10:45',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Tilordner.\nOppgaven er flyttet fra enhet 4712 til 4291, fra saksbehandler <ingen> til Z994864,',
      },
      {
        date: '07.06.2024 12:35',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Saksblokk : A01\nStatus : OK\nBekreftelsesbrev sendt : Nei',
      },
      {
        date: '07.06.2024 12:35',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content:
          'Mottatt en klage fra bruker.\n\nSTK2 : Høreapparat\nSTK3 : \nSakstype : Klage\nMottatt dato : 21.05.2024',
      },
    ]);
  });

  it('should split no content', () => {
    expect.assertions(1);

    const actual = splitBeskrivelse(noContent);
    expect(actual).toStrictEqual([
      {
        date: '12.06.2024 14:29',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: '',
      },
    ]);
  });

  it('should split two no content', () => {
    expect.assertions(1);

    const actual = splitBeskrivelse(twoNoContent);
    expect(actual).toStrictEqual([
      {
        date: '12.06.2024 14:29',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: '',
      },
      {
        date: '12.06.2024 14:29',
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: '',
      },
    ]);
  });
});
