/* eslint-disable max-lines */
import { describe, expect, it } from 'bun:test';
import { splitBeskrivelse } from '@app/components/behandling/behandlingsdetaljer/gosys/parsing/split-beskrivelse';

describe('split beskrivelse', () => {
  it('should split one line', () => {
    expect.assertions(1);

    const beskrivelse = `--- 12.06.2024 14:29 F_Z994864 E_Z994864 (Z994864, 4291) ---
Overførte oppgaven fra Kabin til Kabal.`;

    const actual = splitBeskrivelse(beskrivelse);
    expect(actual).toStrictEqual([
      {
        date: new Date(2024, 5, 12, 14, 29),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Overførte oppgaven fra Kabin til Kabal.',
      },
    ]);
  });

  it('should split two lines', () => {
    expect.assertions(1);

    const twoLines = `--- 12.06.2024 14:29 F_Z994864 E_Z994864 (Z994864, 4291) ---
Overførte oppgaven fra Kabin til Kabal.

--- 12.06.2024 15:45 F_Z994864 E_Z994864 (Z994864, 4291) ---
Oppdaterte frist`;

    const actual = splitBeskrivelse(twoLines);
    expect(actual).toStrictEqual([
      {
        date: new Date(2024, 5, 12, 14, 29),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Overførte oppgaven fra Kabin til Kabal.',
      },
      {
        date: new Date(2024, 5, 12, 15, 45),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Oppdaterte frist',
      },
    ]);
  });

  it('should split three lines', () => {
    expect.assertions(1);

    const beskrivelse = `--- 12.06.2024 14:29 F_Z994864 E_Z994864 (Z994864, 4291) ---
Overførte oppgaven fra Kabin til Kabal.

--- 12.06.2024 15:45 F_Z994864 E_Z994864 (Z994864, 4291) ---
Oppdaterte frist

--- 12.06.2024 10:18 F_Z994864 E_Z994864 (Z994864, 4291) ---
Flyttet til riktig enhet

Oppgaven er flyttet fra enhet 4712 til 4293`;

    const actual = splitBeskrivelse(beskrivelse);
    expect(actual).toStrictEqual([
      {
        date: new Date(2024, 5, 12, 14, 29),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Overførte oppgaven fra Kabin til Kabal.',
      },
      {
        date: new Date(2024, 5, 12, 15, 45),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Oppdaterte frist',
      },
      {
        date: new Date(2024, 5, 12, 10, 18),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Flyttet til riktig enhet\n\nOppgaven er flyttet fra enhet 4712 til 4293',
      },
    ]);
  });

  it('should split eight lines', () => {
    expect.assertions(2);

    const beskrivelse = `--- 12.06.2024 14:29 F_Z994864 E_Z994864 (Z994864, 4291) ---
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

    const actual = splitBeskrivelse(beskrivelse);
    expect(actual).toHaveLength(8);
    expect(actual).toStrictEqual([
      {
        date: new Date(2024, 5, 12, 14, 29),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Overførte oppgaven fra Kabin til Kabal.\nOppdaterte frist',
      },
      {
        date: new Date(2024, 5, 12, 14, 8),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Oppdaterte frist.\nOverførte oppgave til Kabal fra Kabin.\nTildelte oppgaven til Z994864.',
      },
      {
        date: new Date(2024, 5, 12, 11, 11),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Oppgaven er flyttet   fra mappe Hjelpemidler til <ingen>',
      },
      {
        date: new Date(2024, 5, 12, 10, 18),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Oppgaven er flyttet   fra mappe <ingen> til Hjelpemidler',
      },
      {
        date: new Date(2024, 5, 12, 10, 18),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Flyttet til riktig enhet\nOppgaven er flyttet fra enhet 4712 til 4293',
      },
      {
        date: new Date(2024, 5, 12, 10, 10),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Oppdaterte frist.\nOverførte oppgave til Kabal.',
      },
      {
        date: new Date(2024, 5, 12, 10, 5),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Saksblokk : A04\nStatus : OK\nBekreftelsesbrev sendt : Nei',
      },
      {
        date: new Date(2024, 5, 12, 10, 5),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Mottok en klage\n\nSTK2 : Høreapparat\nSTK3 :\nSakstype : Klage\nMottatt dato : 24.05.2024',
      },
    ]);
  });

  it('should split with extra spacing', () => {
    expect.assertions(1);

    const beskrivelse = `            --- 11.06.2024 13:09 F_Z994864 E_Z994864 (Z994864, 4291) ---\n
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

    const actual = splitBeskrivelse(beskrivelse);
    expect(actual).toStrictEqual([
      {
        date: new Date(2024, 5, 11, 13, 9),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Oppdaterte frist.',
      },
      {
        date: new Date(2024, 5, 10, 10, 45),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Tilordner.\nOppgaven er flyttet fra enhet 4712 til 4291, fra saksbehandler <ingen> til Z994864,',
      },
      {
        date: new Date(2024, 5, 7, 12, 35),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Saksblokk : A01\nStatus : OK\nBekreftelsesbrev sendt : Nei',
      },
      {
        date: new Date(2024, 5, 7, 12, 35),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content:
          'Mottatt en klage fra bruker.\n\nSTK2 : Høreapparat\nSTK3 :\nSakstype : Klage\nMottatt dato : 21.05.2024',
      },
    ]);
  });

  it('should split no content', () => {
    expect.assertions(1);

    const beskrivelse = `--- 12.06.2024 14:29 F_Z994864 E_Z994864 (Z994864, 4291) ---`;

    const actual = splitBeskrivelse(beskrivelse);
    expect(actual).toStrictEqual([
      {
        date: new Date(2024, 5, 12, 14, 29),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: '',
      },
    ]);
  });

  it('should split two no content', () => {
    expect.assertions(1);

    const beskrivelse = `--- 12.06.2024 14:29 F_Z994864 E_Z994864 (Z994864, 4291) ---
--- 12.06.2024 14:29 F_Z994864 E_Z994864 (Z994864, 4291) ---`;

    const actual = splitBeskrivelse(beskrivelse);
    expect(actual).toStrictEqual([
      {
        date: new Date(2024, 5, 12, 14, 29),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: '',
      },
      {
        date: new Date(2024, 5, 12, 14, 29),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: '',
      },
    ]);
  });

  it('should split no name', () => {
    expect.assertions(1);

    const beskrivelse = `--- 12.06.2024 14:26  (Z994864, 4291) ---
Melding uten navn og to mellomrom.

--- 12.06.2024 14:25 (Z994864, 4291) ---
Melding uten navn og ett mellomrom.
`;

    const actual = splitBeskrivelse(beskrivelse);
    expect(actual).toStrictEqual([
      {
        date: new Date(2024, 5, 12, 14, 26),
        author: { name: null, navIdent: 'Z994864', enhet: '4291' },
        content: 'Melding uten navn og to mellomrom.',
      },
      {
        date: new Date(2024, 5, 12, 14, 25),
        author: { name: null, navIdent: 'Z994864', enhet: '4291' },
        content: 'Melding uten navn og ett mellomrom.',
      },
    ]);
  });

  it('should split with only two leading dashes', () => {
    expect.assertions(1);

    const beskrivelse = `-- 12.06.2024 14:26 F_Z994864 E_Z994864 (Z994864, 4291) ---
Melding med kun to streker på starten av header.

-- 12.06.2024 14:25 F_Z994864 E_Z994864 (Z994864, 4291) ---
Melding med kun to streker på starten av header.
`;

    const actual = splitBeskrivelse(beskrivelse);
    expect(actual).toStrictEqual([
      {
        date: new Date(2024, 5, 12, 14, 26),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Melding med kun to streker på starten av header.',
      },
      {
        date: new Date(2024, 5, 12, 14, 25),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Melding med kun to streker på starten av header.',
      },
    ]);
  });

  it('should split with only two trailing dashes', () => {
    expect.assertions(1);

    const beskrivelse = `--- 12.06.2024 14:26 F_Z994864 E_Z994864 (Z994864, 4291) --
Melding med kun to streker på slutten av header.

--- 12.06.2024 14:25 F_Z994864 E_Z994864 (Z994864, 4291) --
Melding med kun to streker på slutten av header.
`;

    const actual = splitBeskrivelse(beskrivelse);
    expect(actual).toStrictEqual([
      {
        date: new Date(2024, 5, 12, 14, 26),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Melding med kun to streker på slutten av header.',
      },
      {
        date: new Date(2024, 5, 12, 14, 25),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Melding med kun to streker på slutten av header.',
      },
    ]);
  });

  it('should split with only two dashes any place', () => {
    expect.assertions(1);

    const beskrivelse = `--- 12.06.2024 14:26 F_Z994864 E_Z994864 (Z994864, 4291) --
Melding med kun to streker på slutten av header.

-- 12.06.2024 14:25 F_Z994864 E_Z994864 (Z994864, 4291) ---
Melding med kun to streker på starten av header.
`;

    const actual = splitBeskrivelse(beskrivelse);
    expect(actual).toStrictEqual([
      {
        date: new Date(2024, 5, 12, 14, 26),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Melding med kun to streker på slutten av header.',
      },
      {
        date: new Date(2024, 5, 12, 14, 25),
        author: { name: 'F_Z994864 E_Z994864', navIdent: 'Z994864', enhet: '4291' },
        content: 'Melding med kun to streker på starten av header.',
      },
    ]);
  });
});
