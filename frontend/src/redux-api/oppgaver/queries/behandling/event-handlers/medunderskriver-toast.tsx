import { formatEmployeeName } from '@app/domain/employee-name';
import { employeeName } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/common';
import type { INavEmployee } from '@app/types/bruker';
import { FlowState } from '@app/types/oppgave-common';

interface Params {
  flowState: FlowState;
  medunderskriver: INavEmployee | null;
}

export const getMedunderskriverToastContent = (
  actor: INavEmployee,
  previous: Params,
  next: Params,
): React.ReactNode => {
  const isFlowChange = next.flowState !== previous.flowState;

  if (isFlowChange) {
    if (previous.flowState === FlowState.RETURNED && next.flowState === FlowState.SENT) {
      if (next.medunderskriver === null) {
        console.warn('Cannot be sent to medunderskriver when medunderskriver is null.');

        return null;
      }

      if (actor.navIdent === next.medunderskriver.navIdent) {
        return (
          <>
            {formatEmployeeName(actor)} hentet saken tilbake fra saksbehandler til <b>seg selv</b>.
          </>
        );
      }

      return (
        <>
          {formatEmployeeName(actor)} sendte saken tilbake til {employeeName(next.medunderskriver)} (medunderskriver).
        </>
      );
    }

    if (previous.flowState === FlowState.NOT_SENT && next.flowState === FlowState.SENT) {
      return (
        <>
          {formatEmployeeName(actor)} sendte saken til {employeeName(next.medunderskriver)} (medunderskriver).
        </>
      );
    }

    if (previous.flowState === FlowState.SENT && next.flowState === FlowState.RETURNED) {
      return <>{formatEmployeeName(actor)} returnerte saken fra medunderskrift til saksbehandler.</>;
    }

    if (previous.flowState === FlowState.SENT && next.flowState === FlowState.NOT_SENT) {
      return (
        <>
          {formatEmployeeName(actor)} hentet saken tilbake fra {employeeName(next.medunderskriver)} (medunderskriver).
        </>
      );
    }
  }

  const isMedunderskriverChange = next.medunderskriver?.navIdent !== previous.medunderskriver?.navIdent;

  if (isMedunderskriverChange) {
    if (next.medunderskriver === null) {
      return (
        <>
          {employeeName(actor)} fjernet {employeeName(previous.medunderskriver)} som medunderskriver.
        </>
      );
    }

    if (previous.medunderskriver === null) {
      return (
        <>
          {employeeName(actor)} satt {employeeName(next.medunderskriver)} som medunderskriver.
        </>
      );
    }

    return (
      <>
        {employeeName(actor)} byttet medunderskriver fra {employeeName(previous.medunderskriver)} til{' '}
        {employeeName(next.medunderskriver)}.
      </>
    );
  }

  return null;
};
