import { describe, expect, it } from 'bun:test';
import { splitBeskrivelse } from '@app/components/gosys/beskrivelse/parsing/split-beskrivelse';
import { GosysEntryAuthorType } from '@app/components/gosys/beskrivelse/parsing/type';

describe('split beskrivelse', () => {
  it('should split one line', () => {
    expect.assertions(1);

    const beskrivelse = `--- 12.06.2024 14:29 F_Z994864 E_Z994864 (Z994864, 4291) ---
Overførte oppgaven fra Kabin til Kabal.`;

    const actual = splitBeskrivelse(beskrivelse);
    expect(actual).toStrictEqual([
      {
        date: new Date(2024, 5, 12, 14, 29),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Overførte oppgaven fra Kabin til Kabal.',
        id: expect.any(String),
      },
    ]);
  });

  it('should split two lines', () => {
    expect.assertions(1);

    const beskrivelse = `--- 12.06.2024 14:29 F_Z994864 E_Z994864 (Z994864, 4291) ---
Overførte oppgaven fra Kabin til Kabal.

--- 12.06.2024 15:45 F_Z994864 E_Z994864 (Z994864, 4291) ---
Oppdaterte frist`;

    const actual = splitBeskrivelse(beskrivelse);
    expect(actual).toStrictEqual([
      {
        date: new Date(2024, 5, 12, 14, 29),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Overførte oppgaven fra Kabin til Kabal.',
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 12, 15, 45),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Oppdaterte frist',
        id: expect.any(String),
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
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Overførte oppgaven fra Kabin til Kabal.',
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 12, 15, 45),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Oppdaterte frist',
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 12, 10, 18),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Flyttet til riktig enhet\n\nOppgaven er flyttet fra enhet 4712 til 4293',
        id: expect.any(String),
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
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Overførte oppgaven fra Kabin til Kabal.\nOppdaterte frist',
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 12, 14, 8),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Oppdaterte frist.\nOverførte oppgave til Kabal fra Kabin.\nTildelte oppgaven til Z994864.',
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 12, 11, 11),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Oppgaven er flyttet   fra mappe Hjelpemidler til <ingen>',
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 12, 10, 18),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Oppgaven er flyttet   fra mappe <ingen> til Hjelpemidler',
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 12, 10, 18),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Flyttet til riktig enhet\nOppgaven er flyttet fra enhet 4712 til 4293',
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 12, 10, 10),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Oppdaterte frist.\nOverførte oppgave til Kabal.',
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 12, 10, 5),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Saksblokk : A04\nStatus : OK\nBekreftelsesbrev sendt : Nei',
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 12, 10, 5),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Mottok en klage\n\nSTK2 : Høreapparat\nSTK3 :\nSakstype : Klage\nMottatt dato : 24.05.2024',
        id: expect.any(String),
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
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Oppdaterte frist.',
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 10, 10, 45),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Tilordner.\nOppgaven er flyttet fra enhet 4712 til 4291, fra saksbehandler <ingen> til Z994864,',
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 7, 12, 35),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Saksblokk : A01\nStatus : OK\nBekreftelsesbrev sendt : Nei',
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 7, 12, 35),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content:
          'Mottatt en klage fra bruker.\n\nSTK2 : Høreapparat\nSTK3 :\nSakstype : Klage\nMottatt dato : 21.05.2024',
        id: expect.any(String),
      },
    ]);
  });

  it('should split no content', () => {
    expect.assertions(1);

    const beskrivelse = '--- 12.06.2024 14:29 F_Z994864 E_Z994864 (Z994864, 4291) ---';

    const actual = splitBeskrivelse(beskrivelse);
    expect(actual).toStrictEqual([
      {
        date: new Date(2024, 5, 12, 14, 29),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: '',
        id: expect.any(String),
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
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: '',
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 12, 14, 29),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: '',
        id: expect.any(String),
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
        author: { name: null, navIdent: 'Z994864', enhet: '4291', type: GosysEntryAuthorType.EMPLOYEE },
        content: 'Melding uten navn og to mellomrom.',
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 12, 14, 25),
        author: { name: null, navIdent: 'Z994864', enhet: '4291', type: GosysEntryAuthorType.EMPLOYEE },
        content: 'Melding uten navn og ett mellomrom.',
        id: expect.any(String),
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
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Melding med kun to streker på starten av header.',
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 12, 14, 25),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Melding med kun to streker på starten av header.',
        id: expect.any(String),
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
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Melding med kun to streker på slutten av header.',
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 12, 14, 25),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Melding med kun to streker på slutten av header.',
        id: expect.any(String),
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
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Melding med kun to streker på slutten av header.',
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 12, 14, 25),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Melding med kun to streker på starten av header.',
        id: expect.any(String),
      },
    ]);
  });

  it('should preserve messages with referenced messages', () => {
    expect.assertions(1);

    const beskrivelse = `
--- 03.06.2024 08:41 E_994121, F_994121 (Z994121, 4488) ---
Hei! Her er en annen melding som jeg har kopiert ffra Gosys, tok med formateringen rundt også:
 
"--- 29.01.2024 15:27 E_Z994864, F_Z994864 (Z994864, 4291) ---
Dette er den kopierte meldingen. Den har metadata som Kabal må ignorere.
Oppgaven er flyttet  fra saksbehandler Z994864 til <ingen>"
 
Dette står i gosysoppgave opprettet 271022 og avsluttet 110723.
 
Det ser ut som noen har gjort noe rart med oppgaven (?!)
 
Hva er status i saken?`;

    const actual = splitBeskrivelse(beskrivelse);
    expect(actual).toStrictEqual([
      {
        date: new Date(2024, 5, 3, 8, 41),
        author: { name: 'E_994121, F_994121', navIdent: 'Z994121', enhet: '4488', type: GosysEntryAuthorType.EMPLOYEE },
        content: `Hei! Her er en annen melding som jeg har kopiert ffra Gosys, tok med formateringen rundt også:

"--- 29.01.2024 15:27 E_Z994864, F_Z994864 (Z994864, 4291) ---
Dette er den kopierte meldingen. Den har metadata som Kabal må ignorere.
Oppgaven er flyttet  fra saksbehandler Z994864 til <ingen>"

Dette står i gosysoppgave opprettet 271022 og avsluttet 110723.

Det ser ut som noen har gjort noe rart med oppgaven (?!)

Hva er status i saken?`,
        id: expect.any(String),
      },
    ]);
  });

  it('should handle messages from kabal-api', () => {
    expect.assertions(1);

    const beskrivelse = `--- 10.10.2024 15:07 (kabal-api) ---
Klageinstansen har fullført behandling av klage med utfall stadfestet. Tar gjerne en prat.
Oppgaven er flyttet fra enhet 4295 til 0124, fra saksbehandler Z994863 til <ingen>

--- 10.10.2024 15:06 (Z994863, 4295) ---
Overførte oppgaven fra Kabin til Kabal.`;

    const actual = splitBeskrivelse(beskrivelse);
    expect(actual).toStrictEqual([
      {
        date: new Date(2024, 9, 10, 15, 7),
        author: { name: 'kabal-api', type: GosysEntryAuthorType.SYSTEM },
        content: `Klageinstansen har fullført behandling av klage med utfall stadfestet. Tar gjerne en prat.
Oppgaven er flyttet fra enhet 4295 til 0124, fra saksbehandler Z994863 til <ingen>`,
        id: expect.any(String),
      },
      {
        date: new Date(2024, 9, 10, 15, 6),
        author: { name: null, navIdent: 'Z994863', enhet: '4295', type: GosysEntryAuthorType.EMPLOYEE },
        content: 'Overførte oppgaven fra Kabin til Kabal.',
        id: expect.any(String),
      },
    ]);
  });

  it('should handle lines of dashes in messages', () => {
    expect.assertions(1);

    const beskrivelse = `--- 12.06.2024 14:26 F_Z994864 E_Z994864 (Z994864, 4291) ---
Jeg har kopiert dette fra en annen oppgave i Gosys:

---------------------------------
--- 12.06.2024 14:29 F_Z994864 E_Z994864 (Z994864, 4291) ---
Overførte oppgaven fra Kabin til Kabal.

--- 12.06.2024 15:45 F_Z994864 E_Z994864 (Z994864, 4291) ---
Oppdaterte frist
---------------------------------------
`;

    const actual = splitBeskrivelse(beskrivelse);
    expect(actual).toStrictEqual([
      {
        date: new Date(2024, 5, 12, 14, 26),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: `Jeg har kopiert dette fra en annen oppgave i Gosys:

---------------------------------`,
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 12, 14, 29),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: 'Overførte oppgaven fra Kabin til Kabal.',
        id: expect.any(String),
      },
      {
        date: new Date(2024, 5, 12, 15, 45),
        author: {
          name: 'F_Z994864 E_Z994864',
          navIdent: 'Z994864',
          enhet: '4291',
          type: GosysEntryAuthorType.EMPLOYEE,
        },
        content: `Oppdaterte frist
---------------------------------------`,
        id: expect.any(String),
      },
    ]);
  });
});
