import { afterAll, beforeAll, beforeEach, describe, expect, it, mock } from 'bun:test';
import { ConfirmFinish } from '@app/components/oppgavebehandling-footer/confirm-finish';
// biome-ignore lint/style/noNamespaceImport: Needed in order to restore after mock
import * as originalUseOppgave from '@app/hooks/oppgavebehandling/use-oppgave';
// biome-ignore lint/style/noNamespaceImport: Needed in order to restore after mock
import * as originalUseIsModernized from '@app/hooks/use-is-modernized';
// biome-ignore lint/style/noNamespaceImport: Needed in order to restore after mock
import * as originalSearch from '@app/redux-api/search';
// biome-ignore lint/style/noNamespaceImport: Needed in order to restore after mock
import * as originalKodeverk from '@app/simple-api-state/use-kodeverk';
import { fireEvent, render, screen } from '@app/test-utils';
import { SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';

const mockOppgave = (typeId: SaksTypeEnum, utfallId: UtfallEnum) => {
  mock.module('@app/hooks/oppgavebehandling/use-oppgave', () => ({
    useOppgave: () => ({ data: { typeId, resultat: { utfallId, extraUtfallIdSet: [] } }, isSuccess: true }),
  }));
};

const mockIsModernized = (isModernized: boolean) => {
  mock.module('@app/hooks/use-is-modernized', () => ({ useIsModernized: () => isModernized }));
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
    mock.module('@app/hooks/use-is-modernized', () => originalUseIsModernized);
  });

  describe('Klage', () => {
    const cases = [true, false];

    it.each(cases)('Modernized %p', async (isModernized) => {
      mockIsModernized(isModernized);
      mockOppgave(SaksTypeEnum.KLAGE, UtfallEnum.MEDHOLD);
      render(<ConfirmFinish cancel={() => {}} show />);

      const buttonText = isModernized ? 'Fullfør' : 'Oppdater oppgaven i Gosys og fullfør';
      const finishButton = screen.getByRole('button', { name: buttonText });
      expect(finishButton).toBeVisible();
      expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
      expect(await screen.findAllByRole('button')).toHaveLength(2);

      fireEvent.click(finishButton);

      if (isModernized) {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      } else {
        expect(screen.getByLabelText('Oppdater oppgaven i Gosys og fullfør', { selector: 'dialog' })).toBeVisible();
      }
    });
  });

  describe('Anke i Trygderetten', () => {
    const type = SaksTypeEnum.ANKE_I_TRYGDERETTEN;

    describe('Modernized', async () => {
      beforeEach(() => {
        mockIsModernized(true);
      });

      const cases = [
        UtfallEnum.MEDHOLD,
        UtfallEnum.DELVIS_MEDHOLD,
        UtfallEnum.STADFESTELSE,
        UtfallEnum.AVVIST,
        UtfallEnum.HEVET,
      ];

      it.each(cases)('Utfall id: %s', async (utfall) => {
        mockOppgave(type, utfall);
        render(<ConfirmFinish cancel={() => {}} show />);
        const buttonText = 'Oppdater oppgaven i Gosys og fullfør';
        expect(screen.getByRole('button', { name: buttonText })).toBeVisible();

        const items = await screen.findAllByRole('button');
        expect(items).toHaveLength(2);

        fireEvent.click(screen.getByRole('button', { name: buttonText }));
        expect(screen.getByLabelText(buttonText, { selector: 'dialog' })).toBeVisible();
      });

      it('Opphevet', async () => {
        mockOppgave(type, UtfallEnum.OPPHEVET);
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

      it('Henvist', async () => {
        mockOppgave(type, UtfallEnum.HENVIST);
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

    describe('Not modernized', async () => {
      beforeEach(() => {
        mockIsModernized(false);
      });

      it('Opphevet', async () => {
        mockOppgave(type, UtfallEnum.OPPHEVET);
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
    });
  });
});
