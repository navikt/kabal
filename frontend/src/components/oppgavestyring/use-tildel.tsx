import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useTildelSaksbehandlerMutation } from '@app/redux-api/oppgaver/mutations/tildeling';
import { useLazyGetSakenGjelderQuery, useLazyGetSaksbehandlerQuery } from '@app/redux-api/oppgaver/queries/behandling';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { ISakenGjelderResponse, ISaksbehandlerResponse } from '@app/types/oppgavebehandling/response';
import { ITildelingResponse } from '@app/types/oppgaver';
import { OpenOppgavebehandling } from '../common-table-components/open';
import { toast } from '../toast/store';

interface Props {
  oppgaveId: string;
  oppgaveType: SaksTypeEnum;
  ytelse: string;
  fromSaksbehandler: ISaksbehandlerResponse['saksbehandler'];
  toSaksbehandler: ITildelingResponse['saksbehandler'];
  sakenGjelder: ISakenGjelderResponse['sakenGjelder'];
}

export const useTildel = (
  oppgaveId: string,
  oppgaveType: SaksTypeEnum,
  ytelse: string
): [(navIdent: string) => Promise<void>, { isLoading: boolean }] => {
  const [getSaksbehandler] = useLazyGetSaksbehandlerQuery();
  const [getSakenGjelder] = useLazyGetSakenGjelderQuery();
  const [tildel] = useTildelSaksbehandlerMutation({ fixedCacheKey: oppgaveId });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onTildelSaksbehandler = async (navIdent: string) => {
    setIsLoading(true);

    try {
      const { saksbehandler: fromSaksbehandler } = await getSaksbehandler(oppgaveId, true).unwrap();
      const { saksbehandler: toSaksbehandler } = await tildel({ oppgaveId, navIdent }).unwrap();
      const { sakenGjelder } = await getSakenGjelder(oppgaveId, true).unwrap();
      createTildeltToast({ toSaksbehandler, fromSaksbehandler, sakenGjelder, oppgaveId, oppgaveType, ytelse });
    } catch {
      toast.error('Kunne ikke tildele saksbehandler');
    }
    setIsLoading(false);
  };

  return [onTildelSaksbehandler, { isLoading }];
};

export const useFradel = (
  oppgaveId: string,
  oppgaveType: SaksTypeEnum,
  ytelse: string
): [() => Promise<void>, { isLoading: boolean }] => {
  const [getSakenGjelder] = useLazyGetSakenGjelderQuery();
  const [getSaksbehandler] = useLazyGetSaksbehandlerQuery();
  const [tildel] = useTildelSaksbehandlerMutation({ fixedCacheKey: oppgaveId });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onFradelSaksbehandler = async () => {
    setIsLoading(true);

    try {
      const [{ saksbehandler: fromSaksbehandler }, { sakenGjelder }] = await Promise.all([
        getSaksbehandler(oppgaveId, true).unwrap(),
        getSakenGjelder(oppgaveId, true).unwrap(),
      ]);
      const { saksbehandler: toSaksbehandler } = await tildel({ oppgaveId, navIdent: null }).unwrap();
      createFradeltToast({ toSaksbehandler, fromSaksbehandler, sakenGjelder, oppgaveId, oppgaveType, ytelse });
    } catch {
      toast.error('Kunne ikke fradele saksbehandler.');
    }
    setIsLoading(false);
  };

  return [onFradelSaksbehandler, { isLoading }];
};

const Tildelt = ({ oppgaveId, oppgaveType, ytelse, sakenGjelder, toSaksbehandler, fromSaksbehandler }: Props) => {
  const sakenGjelderText = `${sakenGjelder.navn ?? 'Navn mangler'} (${sakenGjelder.fnr})`;
  const toSaksbehandlerText =
    toSaksbehandler === null ? 'ukjent saksbehandler' : `${toSaksbehandler.navn} (${toSaksbehandler.navIdent})`;
  const fromSaksbehandlerText =
    fromSaksbehandler === null ? '' : ` fra ${fromSaksbehandler.navn} (${fromSaksbehandler.navIdent})`;

  return (
    <div data-testid="oppgave-tildelt-toast" data-oppgaveid={oppgaveId}>
      <span>
        Oppgave for {sakenGjelderText} er tildelt {toSaksbehandlerText}
        {fromSaksbehandlerText}.
      </span>
      <ButtonRow>
        <OpenOppgavebehandling
          size="small"
          variant="secondary"
          oppgavebehandlingId={oppgaveId}
          type={oppgaveType}
          ytelse={ytelse}
          tildeltSaksbehandlerident={toSaksbehandler?.navIdent ?? null}
          medunderskriverident={null}
        >
          Åpne
        </OpenOppgavebehandling>
        <CancelButton
          oppgaveId={oppgaveId}
          oppgaveType={oppgaveType}
          ytelse={ytelse}
          fromSaksbehandler={fromSaksbehandler}
          toSaksbehandler={toSaksbehandler}
        />
      </ButtonRow>
    </div>
  );
};

const Fradelt = ({ oppgaveId, oppgaveType, ytelse, sakenGjelder, toSaksbehandler, fromSaksbehandler }: Props) => {
  const sakenGjelderText = `${sakenGjelder.navn ?? 'Navn mangler'} (${sakenGjelder.fnr})`;
  const fromSaksbehandlerText =
    fromSaksbehandler === null ? '' : `${fromSaksbehandler.navn} (${fromSaksbehandler.navIdent})`;

  return (
    <div data-testid="oppgave-fradelt-toast" data-oppgaveid={oppgaveId}>
      <span>
        Oppgave for {sakenGjelderText} er lagt tilbake fra {fromSaksbehandlerText}.
      </span>
      <CancelButton
        oppgaveId={oppgaveId}
        oppgaveType={oppgaveType}
        ytelse={ytelse}
        fromSaksbehandler={fromSaksbehandler}
        toSaksbehandler={toSaksbehandler}
      />
    </div>
  );
};

interface CancelProps {
  oppgaveId: string;
  oppgaveType: SaksTypeEnum;
  ytelse: string;
  fromSaksbehandler: ITildelingResponse['saksbehandler'];
  toSaksbehandler: ITildelingResponse['saksbehandler'];
}

const CancelButton = ({ oppgaveId, oppgaveType, ytelse, fromSaksbehandler, toSaksbehandler }: CancelProps) => {
  const [tildel, { isLoading: isTildeling }] = useTildel(oppgaveId, oppgaveType, ytelse);
  const [fradel, { isLoading: isFradeling }] = useFradel(oppgaveId, oppgaveType, ytelse);

  if (fromSaksbehandler?.navIdent === toSaksbehandler?.navIdent) {
    return null;
  }

  const onClick = async () => {
    if (fromSaksbehandler === null) {
      await fradel();
    } else {
      await tildel(fromSaksbehandler.navIdent);
    }
  };

  return (
    <Button size="small" variant="tertiary" onClick={onClick} loading={isTildeling || isFradeling}>
      Angre
    </Button>
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

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  column-gap: 8px;
`;
