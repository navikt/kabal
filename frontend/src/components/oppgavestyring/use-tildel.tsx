import { Button } from '@navikt/ds-react';
import React, { useContext, useState } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { CountdownButton } from '@app/components/countdown-button/countdown-button';
import { ActionToast } from '@app/components/toast/action-toast';
import { formatEmployeeNameAndId, formatEmployeeNameAndIdFallback } from '@app/domain/employee-name';
import { useHasRole } from '@app/hooks/use-has-role';
import {
  useFradelSaksbehandlerMutation,
  useTildelSaksbehandlerMutation,
} from '@app/redux-api/oppgaver/mutations/tildeling';
import {
  useLazyGetSakenGjelderQuery,
  useLazyGetSaksbehandlerQuery,
} from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { INavEmployee, Role } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { ISakenGjelderResponse, ISaksbehandlerResponse } from '@app/types/oppgavebehandling/response';
import { FradelReason, FradelWithHjemler, FradelWithoutHjemler, ITildelingResponse } from '@app/types/oppgaver';
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

type UseTildel = [(employee: INavEmployee) => Promise<boolean>, { isLoading: boolean }];
type UseFradel = [(params: FradelWithHjemler | FradelWithoutHjemler) => Promise<boolean>, { isLoading: boolean }];

export const useTildel = (oppgaveId: string, oppgaveType: SaksTypeEnum, ytelseId: string): UseTildel => {
  const [getSaksbehandler] = useLazyGetSaksbehandlerQuery();
  const [getSakenGjelder] = useLazyGetSakenGjelderQuery();
  const [tildel] = useTildelSaksbehandlerMutation({ fixedCacheKey: oppgaveId });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const tildelSaksbehandler = async (employee: INavEmployee) => {
    setIsLoading(true);

    try {
      const { saksbehandler: fromSaksbehandler } = await getSaksbehandler(oppgaveId, true).unwrap();
      const { saksbehandler: toSaksbehandler } = await tildel({ oppgaveId, employee }).unwrap();
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
  const { user } = useContext(StaticDataContext);
  const sakenGjelderText = `${sakenGjelder.name ?? 'Navn mangler'} (${sakenGjelder.id})`;
  const toSaksbehandlerText = formatEmployeeNameAndIdFallback(toSaksbehandler, 'ukjent saksbehandler');
  const fromSaksbehandlerText = fromSaksbehandler === null ? '' : ` fra ${formatEmployeeNameAndId(fromSaksbehandler)}`;
  const [tildel] = useTildel(oppgaveId, oppgaveType, ytelseId);
  const [fradel] = useFradel(oppgaveId, oppgaveType, ytelseId);
  const canDeassignOthers = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);

  const secondary =
    fromSaksbehandler !== null || canDeassignOthers ? (
      <CountdownButton
        seconds={10}
        variant="tertiary"
        size="small"
        onClick={() => {
          if (fromSaksbehandler !== null) {
            return tildel(fromSaksbehandler);
          }

          if (canDeassignOthers || toSaksbehandler?.navIdent === user.navIdent) {
            return fradel({ reasonId: FradelReason.ANGRET });
          }
        }}
      >
        Angre
      </CountdownButton>
    ) : null;

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
      secondary={secondary}
    >
      Oppgave for {sakenGjelderText} er tildelt {toSaksbehandlerText}
      {fromSaksbehandlerText}.
    </ActionToast>
  );
};

const Fradelt = ({ oppgaveId, sakenGjelder, fromSaksbehandler, oppgaveType, ytelseId }: Props) => {
  const sakenGjelderText = `${sakenGjelder.name ?? 'Navn mangler'} (${sakenGjelder.id})`;
  const fromSaksbehandlerText = formatEmployeeNameAndIdFallback(fromSaksbehandler, '');
  const [tildel] = useTildel(oppgaveId, oppgaveType, ytelseId);

  const primary =
    fromSaksbehandler === null ? null : (
      <Button variant="tertiary" size="small" onClick={() => tildel(fromSaksbehandler)}>
        Angre
      </Button>
    );

  return (
    <ActionToast attrs={{ 'data-oppgaveid': oppgaveId, 'data-testid': 'oppgave-fradelt-toast' }} primary={primary}>
      Oppgave for {sakenGjelderText} er lagt tilbake fra {fromSaksbehandlerText}.
    </ActionToast>
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
