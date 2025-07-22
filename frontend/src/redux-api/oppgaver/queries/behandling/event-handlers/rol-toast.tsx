import { StaticDataContext } from '@app/components/app/static-data-context';
import { employeeName } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/common';
import type { INavEmployee } from '@app/types/bruker';
import { FlowState } from '@app/types/oppgave-common';
import { useContext } from 'react';

interface Params {
  flowState: FlowState;
  rol: INavEmployee | null;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
export const getRolToastContent = (actor: INavEmployee, userId: string, previous: Params, next: Params) => {
  const nextNavIdent = next.rol?.navIdent ?? null;
  const isFlowChange = next.flowState !== previous.flowState;

  if (isFlowChange) {
    // ROL henter saken tilbake fra saksbehandler.
    if (previous.flowState === FlowState.RETURNED && next.flowState === FlowState.SENT) {
      if (actor.navIdent === nextNavIdent) {
        return (
          <>
            {employeeName(actor)} hentet saken tilbake fra saksbehandler til <b>seg selv</b>.
          </>
        );
      }

      return (
        <>
          {employeeName(actor)} sendte saken tilbake til {nextNavIdent === userId ? 'deg' : employeeName(next.rol)}.
        </>
      );
    }

    if (next.flowState === FlowState.SENT) {
      if (actor.navIdent === nextNavIdent) {
        return (
          <>
            {employeeName(actor)} satte <From {...previous} /> til <b>seg selv</b>.
          </>
        );
      }

      return (
        <>
          {employeeName(actor)} sendte <From {...previous} /> til {employeeName(next.rol)}.
        </>
      );
    }

    if (next.flowState === FlowState.RETURNED) {
      return (
        <>
          {employeeName(actor)} returnerte saken <b>til saksbehandler</b>.
        </>
      );
    }

    if (previous.flowState === FlowState.SENT && next.flowState === FlowState.NOT_SENT) {
      return (
        <>
          {employeeName(actor)} hentet saken tilbake fra {employeeName(next.rol)}.
        </>
      );
    }
  }

  const isRolChange = next.rol !== previous.rol;

  if (isRolChange) {
    if (next.flowState !== FlowState.NOT_SENT) {
      return (
        <>
          {employeeName(actor)} flyttet saken fra {employeeName(previous.rol)} til {employeeName(next.rol, 'felles kø')}
          .
        </>
      );
    }

    if (next.rol === null) {
      return (
        <>
          {employeeName(actor)} fjernet {employeeName(previous.rol)} som ROL.
        </>
      );
    }

    return (
      <>
        {employeeName(actor)} endret ROL fra {employeeName(previous.rol)} til {employeeName(next.rol)}.
      </>
    );
  }

  return null;
};

const From = ({ flowState, rol }: Params) => {
  const { user } = useContext(StaticDataContext);

  if (flowState === FlowState.NOT_SENT) {
    return 'saken';
  }

  if (user.navIdent === rol?.navIdent) {
    return 'saken din';
  }

  return `saken hos ${employeeName(rol)}`;
};
