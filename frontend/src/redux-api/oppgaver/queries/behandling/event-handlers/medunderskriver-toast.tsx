import React from 'react';
import { getName } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/common';
import { FlowState, INavEmployee } from '@app/types/oppgave-common';

interface Params {
  flowState: FlowState;
  navIdent: string | null;
}

export const getMedunderskriverToastContent = (
  actor: INavEmployee,
  previous: Params,
  next: Params,
): React.ReactNode => {
  const isFlowChange = next.flowState !== previous.flowState;

  if (isFlowChange) {
    if (previous.flowState === FlowState.RETURNED && next.flowState === FlowState.SENT) {
      if (next.navIdent === null) {
        console.warn('Cannot be sent to medunderskriver when medunderskriver is null.');

        return null;
      }

      if (actor.navIdent === next.navIdent) {
        return (
          <>
            {actor.navn} hentet saken tilbake fra saksbehandler til <b>seg selv</b>.
          </>
        );
      }

      return (
        <>
          {actor.navn} sendte saken tilbake til {getName(next.navIdent)} (medunderskriver).
        </>
      );
    }

    if (previous.flowState === FlowState.NOT_SENT && next.flowState === FlowState.SENT) {
      return (
        <>
          {actor.navn} sendte saken til {getName(next.navIdent)} (medunderskriver).
        </>
      );
    }

    if (previous.flowState === FlowState.SENT && next.flowState === FlowState.RETURNED) {
      return <>{actor.navn} returnerte saken fra medunderskrift til saksbehandler.</>;
    }

    if (previous.flowState === FlowState.SENT && next.flowState === FlowState.NOT_SENT) {
      return (
        <>
          {actor.navn} hentet saken tilbake fra {getName(next.navIdent)} (medunderskriver).
        </>
      );
    }
  }

  const isMedunderskriverChange = next.navIdent !== previous.navIdent;

  if (isMedunderskriverChange) {
    if (next.navIdent === null) {
      return (
        <>
          {actor.navn} fjernet {getName(previous.navIdent)} som medunderskriver.
        </>
      );
    }

    if (previous.navIdent === null) {
      return (
        <>
          {actor.navn} satt {getName(next.navIdent)} som medunderskriver.
        </>
      );
    }

    return (
      <>
        {actor.navn} byttet medunderskriver fra {getName(previous.navIdent)} til {getName(next.navIdent)}.
      </>
    );
  }

  return null;
};
