import { afterAll, beforeAll, describe, expect, mock, test } from 'bun:test';
import { ConfirmFinish } from '@app/components/oppgavebehandling-footer/confirm-finish';
import * as originalUseOppgave from '@app/hooks/oppgavebehandling/use-oppgave';
import * as originalSearch from '@app/redux-api/search';
import * as originalKodeverk from '@app/simple-api-state/use-kodeverk';
import { fireEvent, render, screen } from '@app/test-utils';
import { SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';

const mockOppgave = (typeId: SaksTypeEnum, utfallId: UtfallEnum, requiresGosysOppgave: boolean) => {
  mock.module('@app/hooks/oppgavebehandling/use-oppgave', () => ({
    useOppgave: () => ({
      data: { typeId, requiresGosysOppgave, resultat: { utfallId, extraUtfallIdSet: [] } },
      isSuccess: true,
    }),
  }));
};

describe('ConfirmFinish', () => {
  beforeAll(() => {
    mock.module('@app/redux-api/search', () => ({ useSearchEnheterQuery: () => ({ data: [], isSuccess: true }) }));

    mock.module('@app/simple-api-state/use-kodeverk', () => ({
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
  afterAll(() => {
    mock.module('@app/redux-api/search', () => originalSearch);
    mock.module('@app/simple-api-state/use-kodeverk', () => originalKodeverk);
    mock.module('@app/hooks/oppgavebehandling/use-oppgave', () => originalUseOppgave);
  });

  describe('Klage', () => {
    const cases = [false, true];

    test.each(cases)('Requires Gosys oppgave: %p', async (requiresGosysOppgave) => {
      mockOppgave(SaksTypeEnum.KLAGE, UtfallEnum.MEDHOLD, requiresGosysOppgave);
      render(<ConfirmFinish cancel={() => {}} show />);

      const buttonText = requiresGosysOppgave ? 'Oppdater oppgaven i Gosys og fullfør' : 'Fullfør';
      const finishButton = screen.getByRole('button', { name: buttonText });
      expect(finishButton).toBeVisible();
      expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
      expect(await screen.findAllByRole('button')).toHaveLength(2);

      fireEvent.click(finishButton);

      if (requiresGosysOppgave) {
        expect(screen.getByLabelText('Oppdater oppgaven i Gosys og fullfør', { selector: 'dialog' })).toBeVisible();
      } else {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      }
    });
  });

  describe('Omgjøringskrav', () => {
    describe('Does not require Gosys oppgave', async () => {
      const cases = [
        UtfallEnum.STADFESTET_MED_EN_ANNEN_BEGRUNNELSE,
        UtfallEnum.BESLUTNING_OM_IKKE_Å_OMGJØRE,
        UtfallEnum.MEDHOLD_ETTER_FORVALTNINGSLOVEN_35,
      ];

      test.each(cases)('Utfall id: %s', async (utfall) => {
        mockOppgave(SaksTypeEnum.OMGJØRINGSKRAV, utfall, false);
        render(<ConfirmFinish cancel={() => {}} show />);

        const buttonText = 'Fullfør';
        const finishButton = screen.getByRole('button', { name: buttonText });
        expect(finishButton).toBeVisible();
        expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
        expect(await screen.findAllByRole('button')).toHaveLength(2);

        fireEvent.click(finishButton);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    describe('Requires Gosys oppgave', async () => {
      test('Medhold etter forvaltningsloven § 35', async () => {
        mockOppgave(SaksTypeEnum.OMGJØRINGSKRAV, UtfallEnum.MEDHOLD_ETTER_FORVALTNINGSLOVEN_35, true);
        render(<ConfirmFinish cancel={() => {}} show />);

        const buttonText = 'Oppdater oppgaven i Gosys og fullfør';
        const finishButton = screen.getByRole('button', { name: buttonText });
        expect(finishButton).toBeVisible();
        expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
        expect(await screen.findAllByRole('button')).toHaveLength(2);

        fireEvent.click(finishButton);

        expect(screen.queryByRole('dialog')).toBeVisible();
      });

      const cases = [UtfallEnum.STADFESTET_MED_EN_ANNEN_BEGRUNNELSE, UtfallEnum.BESLUTNING_OM_IKKE_Å_OMGJØRE];

      test.each(cases)('Utfall id: %s', async (utfall) => {
        mockOppgave(SaksTypeEnum.OMGJØRINGSKRAV, utfall, true);
        render(<ConfirmFinish cancel={() => {}} show />);

        const buttonText = 'Fullfør';
        const finishButton = screen.getByRole('button', { name: buttonText });
        expect(finishButton).toBeVisible();
        expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
        expect(await screen.findAllByRole('button')).toHaveLength(2);

        fireEvent.click(finishButton);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Anke i Trygderetten', () => {
    const type = SaksTypeEnum.ANKE_I_TRYGDERETTEN;

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
        render(<ConfirmFinish cancel={() => {}} show />);
        const buttonText = 'Fullfør';
        expect(screen.getByRole('button', { name: buttonText })).toBeVisible();

        const items = await screen.findAllByRole('button');
        expect(items).toHaveLength(2);

        fireEvent.click(screen.getByRole('button', { name: buttonText }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      test('Opphevet', async () => {
        mockOppgave(type, UtfallEnum.OPPHEVET, false);
        render(<ConfirmFinish cancel={() => {}} show />);
        const button1 = 'Nei, fullfør uten å opprette ny behandling i Kabal.';
        const button2 = 'Ja, fullfør og opprett ny behandling i Kabal';
        expect(screen.getByRole('button', { name: button1 })).toBeVisible();
        expect(screen.getByRole('button', { name: button2 })).toBeVisible();

        const items = await screen.findAllByRole('button');
        expect(items).toHaveLength(3);

        fireEvent.click(screen.getByRole('button', { name: button1 }));
        expect(screen.getByLabelText('Oppdater oppgaven i Gosys og fullfør', { selector: 'dialog' })).toBeVisible();
      });

      test('Henvist', async () => {
        mockOppgave(type, UtfallEnum.HENVIST, false);
        render(<ConfirmFinish cancel={() => {}} show />);
        const button = 'Fullfør';
        expect(screen.getByRole('button', { name: button })).toBeVisible();

        const items = await screen.findAllByRole('button');
        expect(items).toHaveLength(2);

        fireEvent.click(screen.getByRole('button', { name: button }));
        expect(
          screen.queryByLabelText('Oppdater oppgaven i Gosys og fullfør', { selector: 'dialog' }),
        ).not.toBeInTheDocument();
      });
    });

    describe('Requires Gosys oppgave', async () => {
      test('Opphevet', async () => {
        mockOppgave(type, UtfallEnum.OPPHEVET, true);
        render(<ConfirmFinish cancel={() => {}} show />);
        const button1 = 'Nei, fullfør uten å opprette ny behandling i Kabal. Husk å sende oppgave i Gosys.';
        const button2 = 'Ja, fullfør og opprett ny behandling i Kabal';
        expect(screen.getByRole('button', { name: button1 })).toBeVisible();
        expect(screen.getByRole('button', { name: button2 })).toBeVisible();

        const items = await screen.findAllByRole('button');
        expect(items).toHaveLength(3);

        fireEvent.click(screen.getByRole('button', { name: button2 }));
        expect(screen.getByLabelText('Oppdater oppgaven i Gosys og fullfør', { selector: 'dialog' })).not.toBeVisible();
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
        render(<ConfirmFinish cancel={() => {}} show />);
        const buttonText = 'Oppdater oppgaven i Gosys og fullfør';
        expect(screen.getByRole('button', { name: buttonText })).toBeVisible();

        const items = await screen.findAllByRole('button');
        expect(items).toHaveLength(2);

        fireEvent.click(screen.getByRole('button', { name: buttonText }));
        expect(screen.getByLabelText('Oppdater oppgaven i Gosys og fullfør', { selector: 'dialog' })).toBeVisible();
      });
    });
  });
});
