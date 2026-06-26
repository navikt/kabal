import { describe, expect, test } from 'bun:test';
import { getInitialBeskrivelse } from '@/components/oppgavebehandling-footer/update-in-gosys/beskrivelse';
import { SaksTypeEnum, UtfallEnum } from '@/types/kodeverk';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

const getOppgave = (typeId: SaksTypeEnum, utfall: UtfallEnum | null, extraUtfallIdSet: UtfallEnum[] = []) =>
  ({
    typeId,
    resultat: {
      utfallId: utfall,
      extraUtfallIdSet,
    },
  }) as IOppgavebehandling;

const kodeverk = [
  { id: UtfallEnum.MEDHOLD, navn: 'Medhold' },
  { id: UtfallEnum.DELVIS_MEDHOLD, navn: 'Delvis medhold' },
  { id: UtfallEnum.STADFESTELSE, navn: 'Stadfestet' },
  { id: UtfallEnum.AVVIST, navn: 'Avvist' },
  { id: UtfallEnum.OPPHEVET, navn: 'Opphevet' },
];

describe('getInitialBeskrivelse', () => {
  describe('utfallId = null', () => {
    const cases: [SaksTypeEnum, string][] = [
      [SaksTypeEnum.KLAGE, 'Klageinstansen har fullført behandling av klage.'],
      [SaksTypeEnum.ANKE, 'Klageinstansen har fullført behandling av anken.'],
      [SaksTypeEnum.ANKE_I_TRYGDERETTEN, 'Trygderetten har fullført behandling av anken.'],
      [
        SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET,
        'Klageinstansen har fullført ny behandling etter Trygderetten har opphevet.',
      ],
      [SaksTypeEnum.OMGJØRINGSKRAV, 'Klageinstansen har fullført behandling av omgjøringskrav.'],
      [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK, 'Klageinstansen har fullført behandling av begjæringen om gjenopptak.'],
      [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR, 'Trygderetten har fullført behandling av begjæring om gjenopptak.'],
    ];

    test.each(cases)('Sakstype-enum: %s', (type, expected) => {
      expect(getInitialBeskrivelse(getOppgave(type, null), kodeverk)).toBe(expected);
    });
  });

  describe('0 ekstrautfall', () => {
    const cases: [SaksTypeEnum, string][] = [
      [SaksTypeEnum.KLAGE, 'Klageinstansen har fullført behandling av klage med utfall medhold.'],
      [SaksTypeEnum.ANKE, 'Klageinstansen har fullført behandling av anken med utfall medhold.'],
      [SaksTypeEnum.ANKE_I_TRYGDERETTEN, 'Trygderetten har fullført behandling av anken med utfall medhold.'],
      [
        SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET,
        'Klageinstansen har fullført ny behandling etter Trygderetten har opphevet med utfall medhold.',
      ],
      [SaksTypeEnum.OMGJØRINGSKRAV, 'Klageinstansen har fullført behandling av omgjøringskrav med utfall medhold.'],
      [
        SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK,
        'Klageinstansen har fullført behandling av begjæringen om gjenopptak med utfall medhold.',
      ],
      [
        SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR,
        'Trygderetten har fullført behandling av begjæring om gjenopptak med utfall medhold.',
      ],
    ];

    test.each(cases)('Sakstype-enum: %s', (type, expected) => {
      expect(getInitialBeskrivelse(getOppgave(type, UtfallEnum.MEDHOLD), kodeverk)).toBe(expected);
    });
  });

  describe('1 ekstrautfall', () => {
    const cases: [SaksTypeEnum, string][] = [
      [
        SaksTypeEnum.KLAGE,
        'Klageinstansen har fullført behandling av klage med hovedutfall medhold og ekstra utfall: delvis medhold.',
      ],
      [
        SaksTypeEnum.ANKE,
        'Klageinstansen har fullført behandling av anken med hovedutfall medhold og ekstra utfall: delvis medhold.',
      ],
      [
        SaksTypeEnum.ANKE_I_TRYGDERETTEN,
        'Trygderetten har fullført behandling av anken med hovedutfall medhold og ekstra utfall: delvis medhold.',
      ],
      [
        SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET,
        'Klageinstansen har fullført ny behandling etter Trygderetten har opphevet med hovedutfall medhold og ekstra utfall: delvis medhold.',
      ],
      [
        SaksTypeEnum.OMGJØRINGSKRAV,
        'Klageinstansen har fullført behandling av omgjøringskrav med hovedutfall medhold og ekstra utfall: delvis medhold.',
      ],
      [
        SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK,
        'Klageinstansen har fullført behandling av begjæringen om gjenopptak med hovedutfall medhold og ekstra utfall: delvis medhold.',
      ],
      [
        SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR,
        'Trygderetten har fullført behandling av begjæring om gjenopptak med hovedutfall medhold og ekstra utfall: delvis medhold.',
      ],
    ];

    test.each(cases)('Sakstype-enum: %s', (type, expected) => {
      expect(getInitialBeskrivelse(getOppgave(type, UtfallEnum.MEDHOLD, [UtfallEnum.DELVIS_MEDHOLD]), kodeverk)).toBe(
        expected,
      );
    });
  });

  describe('2 ekstrautfall', () => {
    const cases: [SaksTypeEnum, string][] = [
      [
        SaksTypeEnum.KLAGE,
        'Klageinstansen har fullført behandling av klage med hovedutfall medhold og ekstra utfall: delvis medhold og stadfestet.',
      ],
      [
        SaksTypeEnum.ANKE,
        'Klageinstansen har fullført behandling av anken med hovedutfall medhold og ekstra utfall: delvis medhold og stadfestet.',
      ],
      [
        SaksTypeEnum.ANKE_I_TRYGDERETTEN,
        'Trygderetten har fullført behandling av anken med hovedutfall medhold og ekstra utfall: delvis medhold og stadfestet.',
      ],
      [
        SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET,
        'Klageinstansen har fullført ny behandling etter Trygderetten har opphevet med hovedutfall medhold og ekstra utfall: delvis medhold og stadfestet.',
      ],
      [
        SaksTypeEnum.OMGJØRINGSKRAV,
        'Klageinstansen har fullført behandling av omgjøringskrav med hovedutfall medhold og ekstra utfall: delvis medhold og stadfestet.',
      ],
      [
        SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK,
        'Klageinstansen har fullført behandling av begjæringen om gjenopptak med hovedutfall medhold og ekstra utfall: delvis medhold og stadfestet.',
      ],
      [
        SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR,
        'Trygderetten har fullført behandling av begjæring om gjenopptak med hovedutfall medhold og ekstra utfall: delvis medhold og stadfestet.',
      ],
    ];

    test.each(cases)('Sakstype-enum: %s', (type, expected) => {
      expect(
        getInitialBeskrivelse(
          getOppgave(type, UtfallEnum.MEDHOLD, [UtfallEnum.DELVIS_MEDHOLD, UtfallEnum.STADFESTELSE]),
          kodeverk,
        ),
      ).toBe(expected);
    });
  });

  describe('3 ekstrautfall', () => {
    const cases: [SaksTypeEnum, string][] = [
      [
        SaksTypeEnum.KLAGE,
        'Klageinstansen har fullført behandling av klage med hovedutfall medhold og ekstra utfall: delvis medhold, stadfestet og avvist.',
      ],
      [
        SaksTypeEnum.ANKE,
        'Klageinstansen har fullført behandling av anken med hovedutfall medhold og ekstra utfall: delvis medhold, stadfestet og avvist.',
      ],
      [
        SaksTypeEnum.ANKE_I_TRYGDERETTEN,
        'Trygderetten har fullført behandling av anken med hovedutfall medhold og ekstra utfall: delvis medhold, stadfestet og avvist.',
      ],
      [
        SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET,
        'Klageinstansen har fullført ny behandling etter Trygderetten har opphevet med hovedutfall medhold og ekstra utfall: delvis medhold, stadfestet og avvist.',
      ],
      [
        SaksTypeEnum.OMGJØRINGSKRAV,
        'Klageinstansen har fullført behandling av omgjøringskrav med hovedutfall medhold og ekstra utfall: delvis medhold, stadfestet og avvist.',
      ],
      [
        SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK,
        'Klageinstansen har fullført behandling av begjæringen om gjenopptak med hovedutfall medhold og ekstra utfall: delvis medhold, stadfestet og avvist.',
      ],
      [
        SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR,
        'Trygderetten har fullført behandling av begjæring om gjenopptak med hovedutfall medhold og ekstra utfall: delvis medhold, stadfestet og avvist.',
      ],
    ];

    test.each(cases)('Sakstype-enum: %s', (type, expected) => {
      expect(
        getInitialBeskrivelse(
          getOppgave(type, UtfallEnum.MEDHOLD, [UtfallEnum.DELVIS_MEDHOLD, UtfallEnum.STADFESTELSE, UtfallEnum.AVVIST]),
          kodeverk,
        ),
      ).toBe(expected);
    });
  });

  describe('Anke i Trygderetten', () => {
    test('Opphevet', () => {
      expect(getInitialBeskrivelse(getOppgave(SaksTypeEnum.ANKE_I_TRYGDERETTEN, UtfallEnum.OPPHEVET), kodeverk)).toBe(
        'Trygderetten har fullført behandling av anken med utfall opphevet. Vedtaksinstans skal gjøre ny behandling i saken.',
      );
    });

    test('Ikke opphevet', () => {
      expect(getInitialBeskrivelse(getOppgave(SaksTypeEnum.ANKE_I_TRYGDERETTEN, UtfallEnum.MEDHOLD), kodeverk)).toBe(
        'Trygderetten har fullført behandling av anken med utfall medhold.',
      );
    });
  });
});
