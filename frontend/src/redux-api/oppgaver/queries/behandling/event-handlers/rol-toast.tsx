import React, { useContext } from 'react';
import { UserContext } from '@app/components/app/user';
import { getName } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/common';
import { INavEmployee } from '@app/types/bruker';
import { FlowState } from '@app/types/oppgave-common';

interface Params {
  flowState: FlowState;
  navIdent: string | null;
}

export const getRolToastContent = (actor: INavEmployee, previous: Params, next: Params) => {
  const isFlowChange = next.flowState !== previous.flowState;

  if (isFlowChange) {
    // ROL henter saken tilbake fra saksbehandler.
    if (previous.flowState === FlowState.RETURNED && next.flowState === FlowState.SENT) {
      if (actor.navIdent === next.navIdent) {
        return (
          <>
            {actor.navn} hentet saken tilbake fra saksbehandler til <b>seg selv</b>.
          </>
        );
      }

      return (
        <>
          {actor.navn} sendte saken tilbake til {getName(next.navIdent)}.
        </>
      );
    }

    if (next.flowState === FlowState.SENT) {
      if (actor.navIdent === next.navIdent) {
        return (
          <>
            {actor.navn} satte <From previous={previous} /> til <b>seg selv</b>.
          </>
        );
      }

      return (
        <>
          {actor.navn} sendte <From previous={previous} /> til {getName(next.navIdent)}.
        </>
      );
    }

    if (next.flowState === FlowState.RETURNED) {
      return (
        <>
          {actor.navn} returnerte saken <b>til saksbehandler</b>.
        </>
      );
    }

    if (previous.flowState === FlowState.SENT && next.flowState === FlowState.NOT_SENT) {
      return (
        <>
          {actor.navn} hentet saken tilbake fra {getName(next.navIdent)}.
        </>
      );
    }
  }

  const isRolChange = next.navIdent !== previous.navIdent;

  if (isRolChange) {
    if (next.flowState !== FlowState.NOT_SENT) {
      return (
        <>
          {actor.navn} flyttet saken fra {getName(previous.navIdent)} til {getName(next.navIdent, 'felles kø')}.
        </>
      );
    }

    if (next.navIdent === null) {
      return (
        <>
          {actor.navn} fjernet {getName(previous.navIdent)} som ROL.
        </>
      );
    }

    return (
      <>
        {actor.navn} endret ROL fra {getName(previous.navIdent)} til {getName(next.navIdent)}.
      </>
    );
  }

  return null;
};

const From = ({ previous }: { previous: Params }) => {
  const user = useContext(UserContext);

  if (previous.flowState === FlowState.NOT_SENT) {
    return <>saken</>;
  }

  if (user.navIdent === previous.navIdent) {
    return <>saken din</>;
  }

  return <>saken hos {getName(previous.navIdent)}</>;
};
