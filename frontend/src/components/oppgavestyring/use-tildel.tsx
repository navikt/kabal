import React, { useState } from 'react';
import { ActionToast } from '@app/components/toast/action-toast';
import {
  useFradelSaksbehandlerMutation,
  useTildelSaksbehandlerMutation,
} from '@app/redux-api/oppgaver/mutations/tildeling';
import { useLazyGetSakenGjelderQuery, useLazyGetSaksbehandlerQuery } from '@app/redux-api/oppgaver/queries/behandling';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { ISakenGjelderResponse, ISaksbehandlerResponse } from '@app/types/oppgavebehandling/response';
import { FradelWithHjemler, FradelWithoutHjemler, ITildelingResponse } from '@app/types/oppgaver';
import { OpenOppgavebehandling } from '../common-table-components/open';
import { toast } from '../toast/store';

interface Props {
  oppgaveId: string;
  oppgaveType: SaksTypeEnum;
  ytelseId: string;
  fromSaksbehandler: ISaksbehandlerResponse['saksbehandler'];
  toSaksbehandler: ITildelingResponse['saksbehandler'];
  sakenGjelder: ISakenGjelderResponse['sakenGjelder'];
}

type UseTildel = [(navIdent: string) => Promise<boolean>, { isLoading: boolean }];
type UseFradel = [(params: FradelWithHjemler | FradelWithoutHjemler) => Promise<boolean>, { isLoading: boolean }];

export const useTildel = (oppgaveId: string, oppgaveType: SaksTypeEnum, ytelseId: string): UseTildel => {
  const [getSaksbehandler] = useLazyGetSaksbehandlerQuery();
  const [getSakenGjelder] = useLazyGetSakenGjelderQuery();
  const [tildel] = useTildelSaksbehandlerMutation({ fixedCacheKey: oppgaveId });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const tildelSaksbehandler = async (navIdent: string) => {
    setIsLoading(true);

    try {
      const { saksbehandler: fromSaksbehandler } = await getSaksbehandler(oppgaveId, true).unwrap();
      const { saksbehandler: toSaksbehandler } = await tildel({ oppgaveId, navIdent }).unwrap();
      const sakenGjelder = await getSakenGjelder(oppgaveId, true).unwrap();
      createTildeltToast({
        toSaksbehandler,
        fromSaksbehandler,
        sakenGjelder,
        oppgaveId,
        oppgaveType,
        ytelseId,
      });

      return true;
    } catch {
      toast.error('Kunne ikke tildele saksbehandler');

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return [tildelSaksbehandler, { isLoading }];
};

export const useFradel = (oppgaveId: string, oppgaveType: SaksTypeEnum, ytelseId: string): UseFradel => {
  const [getSakenGjelder] = useLazyGetSakenGjelderQuery();
  const [getSaksbehandler] = useLazyGetSaksbehandlerQuery();
  const [fradel] = useFradelSaksbehandlerMutation({ fixedCacheKey: oppgaveId });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fradelSaksbehandler = async (params: FradelWithHjemler | FradelWithoutHjemler) => {
    setIsLoading(true);

    try {
      const [{ saksbehandler: fromSaksbehandler }, sakenGjelder] = await Promise.all([
        getSaksbehandler(oppgaveId, true).unwrap(),
        getSakenGjelder(oppgaveId, true).unwrap(),
      ]);
      await fradel({ oppgaveId, ...params }).unwrap();
      createFradeltToast({
        toSaksbehandler: null,
        fromSaksbehandler,
        sakenGjelder,
        oppgaveId,
        oppgaveType,
        ytelseId,
      });

      return true;
    } catch {
      toast.error('Kunne ikke fradele saksbehandler.');

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return [fradelSaksbehandler, { isLoading }];
};

const Tildelt = ({ oppgaveId, oppgaveType, ytelseId, sakenGjelder, toSaksbehandler, fromSaksbehandler }: Props) => {
  const sakenGjelderText = `${sakenGjelder.name ?? 'Navn mangler'} (${sakenGjelder.id})`;
  const toSaksbehandlerText =
    toSaksbehandler === null ? 'ukjent saksbehandler' : `${toSaksbehandler.navn} (${toSaksbehandler.navIdent})`;
  const fromSaksbehandlerText =
    fromSaksbehandler === null ? '' : ` fra ${fromSaksbehandler.navn} (${fromSaksbehandler.navIdent})`;

  return (
    <ActionToast
      attrs={{ 'data-oppgaveid': oppgaveId, 'data-testid': 'oppgave-tildelt-toast' }}
      primary={
        <OpenOppgavebehandling
          size="small"
          variant="secondary"
          id={oppgaveId}
          typeId={oppgaveType}
          ytelseId={ytelseId}
          tildeltSaksbehandlerident={toSaksbehandler?.navIdent ?? null}
          medunderskriverident={null}
          rol={null}
        >
          Åpne
        </OpenOppgavebehandling>
      }
    >
      Oppgave for {sakenGjelderText} er tildelt {toSaksbehandlerText}
      {fromSaksbehandlerText}.
    </ActionToast>
  );
};

const Fradelt = ({ oppgaveId, sakenGjelder, fromSaksbehandler }: Props) => {
  const sakenGjelderText = `${sakenGjelder.name ?? 'Navn mangler'} (${sakenGjelder.id})`;
  const fromSaksbehandlerText =
    fromSaksbehandler === null ? '' : `${fromSaksbehandler.navn} (${fromSaksbehandler.navIdent})`;

  return (
    <div data-testid="oppgave-fradelt-toast" data-oppgaveid={oppgaveId}>
      <span>
        Oppgave for {sakenGjelderText} er lagt tilbake fra {fromSaksbehandlerText}.
      </span>
    </div>
  );
};

const createTildeltToast = (props: Props) => {
  if (props.fromSaksbehandler?.navIdent !== props.toSaksbehandler?.navIdent) {
    toast.success(<Tildelt {...props} />);
  }
};

const createFradeltToast = (props: Props) => {
  if (props.fromSaksbehandler !== null) {
    toast.success(<Fradelt {...props} />);
  }
};
