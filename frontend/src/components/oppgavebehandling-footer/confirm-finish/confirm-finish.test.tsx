import { afterAll, beforeAll, describe, expect, mock, test } from 'bun:test';
import { ConfirmFinish } from '@/components/oppgavebehandling-footer/confirm-finish/confirm-finish';
import { FAGSYSTEM_ARENA } from '@/components/oppgavebehandling-footer/fagsystem';
import { act, fireEvent, render, screen } from '@/test-utils';
import { SaksTypeEnum, UtfallEnum } from '@/types/kodeverk';

const mockOppgave = (
  typeId: SaksTypeEnum,
  utfallId: UtfallEnum,
  requiresGosysOppgave: boolean,
  fagsystemId?: string,
) => {
  mock.module('@/hooks/oppgavebehandling/use-oppgave', () => ({
    useOppgave: () => ({
      data: {
        typeId,
        requiresGosysOppgave,
        resultat: { utfallId, extraUtfallIdSet: [] },
        fagsystemId,
      },
      isSuccess: true,
    }),
  }));
};

const mockEkspedisjonsbrevIsSent = (isSent: boolean) => {
  mock.module('@/redux-api/oppgaver/queries/documents', () => ({
    useGetEkspedisjonsbrevTilTrygderettenIsSentQuery: () => ({ data: isSent, isSuccess: true }),
  }));
};

const MUTATION_MOCK = [
  () => null,
  {
    data: { isAvsluttetAvSaksbehandler: true, modified: new Date().toISOString() },
    isSuccess: true,
  },
];

describe('ConfirmFinish', () => {
  beforeAll(() => {
    mock.module('@/redux-api/search', () => ({ useSearchEnheterQuery: () => ({ data: [], isSuccess: true }) }));
    mock.module('@/redux-api/oppgaver/mutations/behandling', () => ({
      useFinishOppgavebehandlingMutation: () => MUTATION_MOCK,
      useFinishOppgavebehandlingWithUpdateInGosysMutation: () => MUTATION_MOCK,
    }));
    mockEkspedisjonsbrevIsSent(true);

    mock.module('@/simple-api-state/use-kodeverk', () => ({
      useUtfall: () => ({
        data: [
          { id: UtfallEnum.TRUKKET, navn: 'Trukket' },
          { id: UtfallEnum.RETUR, navn: 'Retur' },
          { id: UtfallEnum.OPPHEVET, navn: 'Opphevet' },
          { id: UtfallEnum.MEDHOLD, navn: 'Medhold' },
          { id: UtfallEnum.DELVIS_MEDHOLD, navn: 'Delvis medhold' },
          { id: UtfallEnum.STADFESTELSE, navn: 'Stadfestet' },
          { id: UtfallEnum.UGUNST, navn: 'Ugunst (Ugyldig)' },
          { id: UtfallEnum.AVVIST, navn: 'Avvist' },
          { id: UtfallEnum.INNSTILLING_STADFESTELSE, navn: 'Innstilling: Stadfestet' },
          { id: UtfallEnum.INNSTILLING_AVVIST, navn: 'Innstilling: Avvist' },
          { id: UtfallEnum.HEVET, navn: 'Hevet' },
          { id: UtfallEnum.HENVIST, navn: 'Henvist' },
          { id: UtfallEnum.MEDHOLD_ETTER_FORVALTNINGSLOVEN_35, navn: 'Medhold etter forvaltningsloven § 35' },
          { id: UtfallEnum.BESLUTNING_OM_IKKE_Å_OMGJØRE, navn: 'Beslutning om ikke å omgjøre' },
          { id: UtfallEnum.STADFESTET_MED_EN_ANNEN_BEGRUNNELSE, navn: 'Stadfestet med en annen begrunnelse' },
        ],
        isSuccess: true,
      }),
    }));
  });

  // Reset all mocked modules to original implementations.
  afterAll(async () => {
    const originalUseOppgave = await import('@/hooks/oppgavebehandling/use-oppgave');
    const originalSearch = await import('@/redux-api/search');
    const originalKodeverk = await import('@/simple-api-state/use-kodeverk');
    const originalBehandling = await import('@/redux-api/oppgaver/mutations/behandling');
    const originalDocuments = await import('@/redux-api/oppgaver/queries/documents');

    mock.module('@/redux-api/search', () => originalSearch);
    mock.module('@/simple-api-state/use-kodeverk', () => originalKodeverk);
    mock.module('@/hooks/oppgavebehandling/use-oppgave', () => originalUseOppgave);
    mock.module('@/redux-api/oppgaver/mutations/behandling', () => originalBehandling);
    mock.module('@/redux-api/oppgaver/queries/documents', () => originalDocuments);
  });

  describe('Klage', () => {
    const cases = [false, true];

    test.each(cases)('Requires Gosys oppgave: %p', async (requiresGosysOppgave) => {
      mockOppgave(SaksTypeEnum.KLAGE, UtfallEnum.MEDHOLD, requiresGosysOppgave);
      render(<ConfirmFinish cancel={() => undefined} />);

      const buttonText = requiresGosysOppgave ? 'Oppdater oppgaven i Gosys og fullfør' : 'Fullfør';
      const finishButton = screen.getByRole('button', { name: buttonText });
      expect(finishButton).toBeVisible();
      expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
      expect(await screen.findAllByRole('button')).toHaveLength(2);

      await act(async () => fireEvent.click(finishButton));

      if (requiresGosysOppgave) {
        expect(screen.getByLabelText('Oppdater oppgaven i Gosys og fullfør', { selector: 'dialog' })).toBeVisible();
      } else {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      }
    });

    test('Arena warning', async () => {
      mockOppgave(SaksTypeEnum.KLAGE, UtfallEnum.MEDHOLD, false, FAGSYSTEM_ARENA);
      render(<ConfirmFinish cancel={() => undefined} />);

      const checkbox = screen.getByRole('checkbox', { name: 'Jeg bekrefter at saken er besluttet i Arena.' });
      expect(checkbox).toBeVisible();
      expect(checkbox).not.toBeChecked();

      const finishButton = screen.getByRole('button', { name: 'Fullfør' });
      expect(finishButton).toBeVisible();
      expect(finishButton).toBeDisabled();

      await act(async () => fireEvent.click(checkbox));
      expect(checkbox).toBeChecked();
      expect(finishButton).toBeEnabled();
    });

    test('No Arena warning', async () => {
      mockOppgave(SaksTypeEnum.KLAGE, UtfallEnum.MEDHOLD, false);
      render(<ConfirmFinish cancel={() => undefined} />);

      expect(
        screen.queryByRole('checkbox', { name: 'Jeg bekrefter at saken er besluttet i Arena.' }),
      ).not.toBeInTheDocument();

      const finishButton = screen.getByRole('button', { name: 'Fullfør' });
      expect(finishButton).toBeVisible();
      expect(finishButton).toBeEnabled();
    });
  });

  describe('Anke', () => {
    test('Arena warning', async () => {
      mockOppgave(SaksTypeEnum.ANKE, UtfallEnum.MEDHOLD, false, FAGSYSTEM_ARENA);
      render(<ConfirmFinish cancel={() => undefined} />);

      const checkbox = screen.getByRole('checkbox', { name: 'Jeg bekrefter at saken er besluttet i Arena.' });
      expect(checkbox).toBeVisible();
      expect(checkbox).not.toBeChecked();

      const finishButton = screen.getByRole('button', { name: 'Fullfør' });
      expect(finishButton).toBeVisible();
      expect(finishButton).toBeDisabled();

      await act(async () => fireEvent.click(checkbox));
      expect(checkbox).toBeChecked();
      expect(finishButton).toBeEnabled();
    });

    test('No Arena warning', async () => {
      mockOppgave(SaksTypeEnum.ANKE, UtfallEnum.MEDHOLD, false);
      render(<ConfirmFinish cancel={() => undefined} />);

      expect(
        screen.queryByRole('checkbox', { name: 'Jeg bekrefter at saken er besluttet i Arena.' }),
      ).not.toBeInTheDocument();

      const finishButton = screen.getByRole('button', { name: 'Fullfør' });
      expect(finishButton).toBeVisible();
      expect(finishButton).toBeEnabled();
    });

    describe('Ekspedisjonsbrev til Trygderetten warning', () => {
      const ekspedisjonsbrevWarning =
        'Du har ikke sendt ekspedisjonsbrev til Trygderetten. Er du sikker på at du vil fullføre anken?';
      const ekspedisjonsbrevCheckboxLabel =
        'Jeg bekrefter at jeg har sendt ekspedisjonsbrev til Trygderetten på en annen måte.';

      const relevantUtfall = [
        UtfallEnum.DELVIS_MEDHOLD,
        UtfallEnum.INNSTILLING_STADFESTELSE,
        UtfallEnum.INNSTILLING_AVVIST,
      ];

      test.each(relevantUtfall)('Shows warning and disables finish when not sent - utfall id: %s', async (utfall) => {
        mockEkspedisjonsbrevIsSent(false);
        mockOppgave(SaksTypeEnum.ANKE, utfall, false);
        render(<ConfirmFinish cancel={() => undefined} />);

        expect(screen.getByText(ekspedisjonsbrevWarning)).toBeVisible();

        const checkbox = screen.getByRole('checkbox', { name: ekspedisjonsbrevCheckboxLabel });
        expect(checkbox).toBeVisible();
        expect(checkbox).not.toBeChecked();

        const finishButton = screen.getByRole('button', { name: 'Fullfør' });
        expect(finishButton).toBeVisible();
        expect(finishButton).toBeDisabled();

        await act(async () => fireEvent.click(checkbox));
        expect(checkbox).toBeChecked();
        expect(finishButton).toBeEnabled();
      });

      test.each(relevantUtfall)('Does not show warning when already sent - utfall id: %s', async (utfall) => {
        mockEkspedisjonsbrevIsSent(true);
        mockOppgave(SaksTypeEnum.ANKE, utfall, false);
        render(<ConfirmFinish cancel={() => undefined} />);

        expect(screen.queryByText(ekspedisjonsbrevWarning)).not.toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: ekspedisjonsbrevCheckboxLabel })).not.toBeInTheDocument();

        const finishButton = screen.getByRole('button', { name: 'Fullfør' });
        expect(finishButton).toBeVisible();
        expect(finishButton).toBeEnabled();
      });

      test('Does not show warning for irrelevant utfall', async () => {
        mockEkspedisjonsbrevIsSent(false);
        mockOppgave(SaksTypeEnum.ANKE, UtfallEnum.MEDHOLD, false);
        render(<ConfirmFinish cancel={() => undefined} />);

        expect(screen.queryByText(ekspedisjonsbrevWarning)).not.toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: ekspedisjonsbrevCheckboxLabel })).not.toBeInTheDocument();

        const finishButton = screen.getByRole('button', { name: 'Fullfør' });
        expect(finishButton).toBeVisible();
        expect(finishButton).toBeEnabled();
      });
    });
  });

  describe('Omgjøringskrav', () => {
    describe('Does not require Gosys oppgave', async () => {
      const cases = [
        UtfallEnum.STADFESTET_MED_EN_ANNEN_BEGRUNNELSE,
        UtfallEnum.BESLUTNING_OM_IKKE_Å_OMGJØRE,
        UtfallEnum.TRUKKET,
        UtfallEnum.HENLAGT,
        UtfallEnum.MEDHOLD_ETTER_FORVALTNINGSLOVEN_35,
      ];

      test.each(cases)('Utfall id: %s', async (utfall) => {
        mockOppgave(SaksTypeEnum.OMGJØRINGSKRAV, utfall, false);
        render(<ConfirmFinish cancel={() => undefined} />);

        const buttonText = 'Fullfør';
        const finishButton = screen.getByRole('button', { name: buttonText });
        expect(finishButton).toBeVisible();
        expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
        expect(await screen.findAllByRole('button')).toHaveLength(2);

        await act(async () => fireEvent.click(finishButton));

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    describe('Requires Gosys oppgave', async () => {
      test('Medhold etter forvaltningsloven § 35', async () => {
        mockOppgave(SaksTypeEnum.OMGJØRINGSKRAV, UtfallEnum.MEDHOLD_ETTER_FORVALTNINGSLOVEN_35, true);
        render(<ConfirmFinish cancel={() => undefined} />);

        const buttonText = 'Oppdater oppgaven i Gosys og fullfør';
        const finishButton = screen.getByRole('button', { name: buttonText });
        expect(finishButton).toBeVisible();
        expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
        expect(await screen.findAllByRole('button')).toHaveLength(2);

        await act(async () => fireEvent.click(finishButton));

        expect(screen.queryByRole('dialog')).toBeVisible();
      });

      const cases = [
        UtfallEnum.STADFESTET_MED_EN_ANNEN_BEGRUNNELSE,
        UtfallEnum.BESLUTNING_OM_IKKE_Å_OMGJØRE,
        UtfallEnum.TRUKKET,
        UtfallEnum.HENLAGT,
      ];

      test.each(cases)('Utfall id: %s', async (utfall) => {
        mockOppgave(SaksTypeEnum.OMGJØRINGSKRAV, utfall, true);
        render(<ConfirmFinish cancel={() => undefined} />);

        const buttonText = 'Fullfør';
        const finishButton = screen.getByRole('button', { name: buttonText });
        expect(finishButton).toBeVisible();
        expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
        expect(await screen.findAllByRole('button')).toHaveLength(2);

        await act(async () => fireEvent.click(finishButton));

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Anke i Trygderetten', () => {
    const type = SaksTypeEnum.ANKE_I_TRYGDERETTEN;
    const arenaOpphevetMessage =
      'Husk at du må be merkantil om å opprette en endringsoppgave i Arena knyttet til ankesaken som Trygderetten har opphevet.';

    describe('Does not require Gosys oppgave', async () => {
      const cases = [
        UtfallEnum.MEDHOLD,
        UtfallEnum.DELVIS_MEDHOLD,
        UtfallEnum.STADFESTELSE,
        UtfallEnum.AVVIST,
        UtfallEnum.HEVET,
      ];

      test.each(cases)('Utfall id: %s', async (utfall) => {
        mockOppgave(type, utfall, false);
        render(<ConfirmFinish cancel={() => undefined} />);
        const buttonText = 'Fullfør';
        expect(screen.getByRole('button', { name: buttonText })).toBeVisible();

        const items = await screen.findAllByRole('button');
        expect(items).toHaveLength(2);

        expect(screen.queryByText(arenaOpphevetMessage)).not.toBeInTheDocument();

        await act(async () => fireEvent.click(screen.getByRole('button', { name: buttonText })));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      test('Opphevet', async () => {
        mockOppgave(type, UtfallEnum.OPPHEVET, false);
        render(<ConfirmFinish cancel={() => undefined} />);
        const button1 = 'Nei, fullfør uten å opprette ny behandling i Kabal';
        const button2 = 'Ja, fullfør og opprett ny behandling i Kabal';
        expect(screen.getByRole('button', { name: button1 })).toBeVisible();
        expect(screen.getByRole('button', { name: button2 })).toBeVisible();

        expect(screen.getByText(arenaOpphevetMessage)).toBeVisible();

        const items = await screen.findAllByRole('button');
        expect(items).toHaveLength(3);

        await act(async () => fireEvent.click(screen.getByRole('button', { name: button1 })));
        expect(
          screen.queryByLabelText('Oppdater oppgaven i Gosys og fullfør', { selector: 'dialog' }),
        ).not.toBeInTheDocument();
      });

      test('Henvist', async () => {
        mockOppgave(type, UtfallEnum.HENVIST, false);
        render(<ConfirmFinish cancel={() => undefined} />);
        const button = 'Fullfør';
        expect(screen.getByRole('button', { name: button })).toBeVisible();

        const items = await screen.findAllByRole('button');
        expect(items).toHaveLength(2);

        expect(screen.queryByText(arenaOpphevetMessage)).not.toBeInTheDocument();
        expect(
          screen.queryByText(
            'Husk at du må be merkantil om å opprette en endringsoppgave i Arena knyttet til ankesaken som Trygderetten har henvist.',
          ),
        ).toBeInTheDocument();

        await act(async () => fireEvent.click(screen.getByRole('button', { name: button })));
        expect(
          screen.queryByLabelText('Oppdater oppgaven i Gosys og fullfør', { selector: 'dialog' }),
        ).not.toBeInTheDocument();
      });
    });

    describe('Requires Gosys oppgave', async () => {
      test('Opphevet', async () => {
        mockOppgave(type, UtfallEnum.OPPHEVET, true);
        render(<ConfirmFinish cancel={() => undefined} />);
        const button1 = 'Nei, fullfør uten å opprette ny behandling i Kabal';
        const button2 = 'Ja, fullfør og opprett ny behandling i Kabal';
        expect(screen.getByRole('button', { name: button1 })).toBeVisible();
        expect(screen.getByRole('button', { name: button2 })).toBeVisible();

        expect(screen.getByText(arenaOpphevetMessage)).toBeVisible();

        const items = await screen.findAllByRole('button');
        expect(items).toHaveLength(3);

        await act(async () => fireEvent.click(screen.getByRole('button', { name: button1 })));
        expect(screen.getByLabelText('Oppdater oppgaven i Gosys og fullfør', { selector: 'dialog' })).toBeVisible();
      });

      const cases = [
        UtfallEnum.MEDHOLD,
        UtfallEnum.DELVIS_MEDHOLD,
        UtfallEnum.STADFESTELSE,
        UtfallEnum.AVVIST,
        UtfallEnum.HEVET,
      ];

      test.each(cases)('Utfall id: %s', async (utfall) => {
        mockOppgave(type, utfall, true);
        render(<ConfirmFinish cancel={() => undefined} />);
        const buttonText = 'Oppdater oppgaven i Gosys og fullfør';
        expect(screen.getByRole('button', { name: buttonText })).toBeVisible();

        const items = await screen.findAllByRole('button');
        expect(items).toHaveLength(2);

        expect(screen.queryByText(arenaOpphevetMessage)).not.toBeInTheDocument();

        await act(async () => fireEvent.click(screen.getByRole('button', { name: buttonText })));
        expect(screen.getByLabelText('Oppdater oppgaven i Gosys og fullfør', { selector: 'dialog' })).toBeVisible();
      });
    });

    test('Arena warning', async () => {
      mockOppgave(SaksTypeEnum.ANKE_I_TRYGDERETTEN, UtfallEnum.MEDHOLD, false, FAGSYSTEM_ARENA);
      render(<ConfirmFinish cancel={() => undefined} />);

      const checkbox = screen.getByRole('checkbox', {
        name: 'Jeg bekrefter at jeg har registrert utfallet fra Trygderetten i Arena',
      });
      expect(checkbox).toBeVisible();
      expect(checkbox).not.toBeChecked();

      const finishButton = screen.getByRole('button', { name: 'Fullfør' });
      expect(finishButton).toBeVisible();
      expect(finishButton).toBeDisabled();

      await act(async () => fireEvent.click(checkbox));
      expect(checkbox).toBeChecked();
      expect(finishButton).toBeEnabled();
    });

    test('No Arena warning', async () => {
      mockOppgave(SaksTypeEnum.KLAGE, UtfallEnum.MEDHOLD, false);
      render(<ConfirmFinish cancel={() => undefined} />);

      expect(
        screen.queryByRole('checkbox', { name: 'Jeg bekrefter at saken er besluttet i Arena.' }),
      ).not.toBeInTheDocument();

      const finishButton = screen.getByRole('button', { name: 'Fullfør' });
      expect(finishButton).toBeVisible();
      expect(finishButton).toBeEnabled();
    });
  });

  describe('Begjæring om gjenopptak i Trygderetten', () => {
    const type = SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR;

    // Utfall that always show "Fullfør", regardless of `requiresGosysOppgave`.
    const alwaysFullførCases = [
      UtfallEnum.HEVET,
      UtfallEnum.IKKE_GJENOPPTATT,
      UtfallEnum.AVVIST,
      UtfallEnum.GJENOPPTATT_STADFESTET,
    ];

    // Utfall that fall through to the default branch and respect `requiresGosysOppgave`.
    const defaultCases = [UtfallEnum.GJENOPPTATT_DELVIS_ELLER_FULLT_MEDHOLD, UtfallEnum.INNSTILLING_IKKE_GJENOPPTAS];

    describe('Does not require Gosys oppgave', async () => {
      test.each([...alwaysFullførCases, ...defaultCases])('Utfall id: %s', async (utfall) => {
        mockOppgave(type, utfall, false);
        render(<ConfirmFinish cancel={() => undefined} />);
        const buttonText = 'Fullfør';
        expect(screen.getByRole('button', { name: buttonText })).toBeVisible();

        const items = await screen.findAllByRole('button');
        expect(items).toHaveLength(2);

        await act(async () => fireEvent.click(screen.getByRole('button', { name: buttonText })));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      test('Gjenopptatt - Opphevet', async () => {
        mockOppgave(type, UtfallEnum.GJENOPPTATT_OPPHEVET, false);
        render(<ConfirmFinish cancel={() => undefined} />);
        const button1 = 'Nei, fullfør uten å opprette ny behandling i Kabal';
        const button2 = 'Ja, fullfør og opprett ny behandling i Kabal';
        expect(screen.getByRole('button', { name: button1 })).toBeVisible();
        expect(screen.getByRole('button', { name: button2 })).toBeVisible();

        const items = await screen.findAllByRole('button');
        expect(items).toHaveLength(3);

        await act(async () => fireEvent.click(screen.getByRole('button', { name: button1 })));
        expect(
          screen.queryByLabelText('Oppdater oppgaven i Gosys og fullfør', { selector: 'dialog' }),
        ).not.toBeInTheDocument();
      });
    });

    describe('Requires Gosys oppgave', async () => {
      test('Gjenopptatt - Opphevet', async () => {
        mockOppgave(type, UtfallEnum.GJENOPPTATT_OPPHEVET, true);
        render(<ConfirmFinish cancel={() => undefined} />);
        const button1 = 'Nei, fullfør uten å opprette ny behandling i Kabal';
        const button2 = 'Ja, fullfør og opprett ny behandling i Kabal';
        expect(screen.getByRole('button', { name: button1 })).toBeVisible();
        expect(screen.getByRole('button', { name: button2 })).toBeVisible();

        const items = await screen.findAllByRole('button');
        expect(items).toHaveLength(3);

        await act(async () => fireEvent.click(screen.getByRole('button', { name: button1 })));
        expect(screen.getByLabelText('Oppdater oppgaven i Gosys og fullfør', { selector: 'dialog' })).toBeVisible();
      });

      test.each(alwaysFullførCases)('Utfall id: %s', async (utfall) => {
        mockOppgave(type, utfall, true);
        render(<ConfirmFinish cancel={() => undefined} />);
        const buttonText = 'Fullfør';
        expect(screen.getByRole('button', { name: buttonText })).toBeVisible();

        const items = await screen.findAllByRole('button');
        expect(items).toHaveLength(2);

        await act(async () => fireEvent.click(screen.getByRole('button', { name: buttonText })));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      test.each(defaultCases)('Utfall id: %s', async (utfall) => {
        mockOppgave(type, utfall, true);
        render(<ConfirmFinish cancel={() => undefined} />);
        const buttonText = 'Oppdater oppgaven i Gosys og fullfør';
        expect(screen.getByRole('button', { name: buttonText })).toBeVisible();

        const items = await screen.findAllByRole('button');
        expect(items).toHaveLength(2);

        await act(async () => fireEvent.click(screen.getByRole('button', { name: buttonText })));
        expect(screen.getByLabelText('Oppdater oppgaven i Gosys og fullfør', { selector: 'dialog' })).toBeVisible();
      });
    });
  });

  describe('Begjæring om gjenopptak', () => {
    const type = SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK;

    // Utfall that always show "Fullfør", regardless of `requiresGosysOppgave`.
    const alwaysFullførCases = [UtfallEnum.TRUKKET, UtfallEnum.HENLAGT];

    // Utfall that fall through to the default branch and respect `requiresGosysOppgave`.
    const defaultCases = [UtfallEnum.INNSTILLING_GJENOPPTAS, UtfallEnum.INNSTILLING_IKKE_GJENOPPTAS];

    describe('Does not require Gosys oppgave', () => {
      test.each([...alwaysFullførCases, ...defaultCases])('Utfall id: %s', async (utfall) => {
        mockOppgave(type, utfall, false);
        render(<ConfirmFinish cancel={() => undefined} />);
        const buttonText = 'Fullfør';
        expect(screen.getByRole('button', { name: buttonText })).toBeVisible();

        const items = await screen.findAllByRole('button');
        expect(items).toHaveLength(2);

        await act(async () => fireEvent.click(screen.getByRole('button', { name: buttonText })));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    describe('Requires Gosys oppgave', () => {
      test.each(alwaysFullførCases)('Utfall id: %s', async (utfall) => {
        mockOppgave(type, utfall, true);
        render(<ConfirmFinish cancel={() => undefined} />);
        const buttonText = 'Fullfør';
        expect(screen.getByRole('button', { name: buttonText })).toBeVisible();

        const items = await screen.findAllByRole('button');
        expect(items).toHaveLength(2);

        await act(async () => fireEvent.click(screen.getByRole('button', { name: buttonText })));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      test.each(defaultCases)('Utfall id: %s', async (utfall) => {
        mockOppgave(type, utfall, true);
        render(<ConfirmFinish cancel={() => undefined} />);
        const buttonText = 'Oppdater oppgaven i Gosys og fullfør';
        expect(screen.getByRole('button', { name: buttonText })).toBeVisible();

        const items = await screen.findAllByRole('button');
        expect(items).toHaveLength(2);

        await act(async () => fireEvent.click(screen.getByRole('button', { name: buttonText })));
        expect(screen.getByLabelText('Oppdater oppgaven i Gosys og fullfør', { selector: 'dialog' })).toBeVisible();
      });
    });
  });
});
