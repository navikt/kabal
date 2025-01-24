import { CustomRecipients } from '@app/components/documents/new-documents/modal/finish-document/custom-recipients';
import { isSendError } from '@app/components/documents/new-documents/modal/finish-document/is-send-error';
import { SingleRecipient } from '@app/components/documents/new-documents/modal/finish-document/single-recipient';
import { SuggestedRecipients } from '@app/components/documents/new-documents/modal/finish-document/suggested-recipients';
import { UnreachableSuggestedRecipients } from '@app/components/documents/new-documents/modal/finish-document/unreachable-suggested-recipients';
import { getIsIncomingDocument } from '@app/functions/is-incoming-document';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSuggestedBrevmottakere } from '@app/hooks/use-suggested-brevmottakere';
import { useFinishDocumentMutation, useSetMottakerListMutation } from '@app/redux-api/oppgaver/mutations/documents';
import type { IMainDocument, IMottaker } from '@app/types/documents/documents';
import { PartStatusEnum } from '@app/types/oppgave-common';
import { Alert } from '@navikt/ds-react';
import { useCallback, useEffect, useMemo } from 'react';
import { StyledFinishDocument } from './styled-components';

export const Receipients = (document: IMainDocument) => {
  const [setMottakerList] = useSetMottakerListMutation();
  const [, { error: finishError }] = useFinishDocumentMutation({
    fixedCacheKey: document.id,
  });
  const { data, isLoading: oppgaveIsLoading } = useOppgave();

  const [suggestedBrevmottakere] = useSuggestedBrevmottakere(document);

  const sendErrors = useMemo(() => {
    if (isSendError(finishError)) {
      return finishError.data.sections.find((s) => s.section === 'mottakere')?.properties ?? [];
    }

    return [];
  }, [finishError]);

  const oppgaveId = data?.id;

  const reachableSuggestedRecipients = suggestedBrevmottakere.filter((s) => s.reachable);

  const addMottakere = useCallback(
    (mottakere: IMottaker[]) => {
      if (oppgaveId === undefined) {
        return;
      }

      const mottakerList =
        document.mottakerList.length === 0 && reachableSuggestedRecipients.length === 1
          ? [
              ...reachableSuggestedRecipients.filter(
                (s) => !document.mottakerList.some((m) => m.part.id === s.part.id),
              ),
              ...document.mottakerList,
            ]
          : [...document.mottakerList];

      for (const mottaker of mottakere) {
        if (mottakerList.some((m) => m.part.id === mottaker.part.id)) {
          continue;
        }

        mottakerList.push(mottaker);
      }

      setMottakerList({ oppgaveId, dokumentId: document.id, mottakerList });
    },
    [oppgaveId, document.mottakerList, document.id, reachableSuggestedRecipients, setMottakerList],
  );

  const removeMottakere = useCallback(
    (ids: string[]) => {
      if (oppgaveId === undefined) {
        return;
      }

      const mottakerList = document.mottakerList.filter((m) => !ids.includes(m.part.id));

      if (mottakerList.length === document.mottakerList.length) {
        return;
      }

      setMottakerList({ oppgaveId, dokumentId: document.id, mottakerList });
    },
    [document.id, document.mottakerList, oppgaveId, setMottakerList],
  );

  const changeMottaker = useCallback(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
    (changedMottaker: IMottaker) => {
      if (oppgaveId === undefined) {
        return;
      }

      const mottakerCount = document.mottakerList.length;
      const mottakerList = new Array<IMottaker>(mottakerCount);
      let found = false;

      for (let i = mottakerCount; i >= 0; i--) {
        const mottaker = document.mottakerList[i];

        if (mottaker === undefined) {
          continue;
        }

        if (mottaker.part.id === changedMottaker.part.id) {
          found = true;
          mottakerList[i] = {
            part: mottaker.part,
            handling: changedMottaker.handling ?? mottaker.handling,
            overriddenAddress:
              changedMottaker.overriddenAddress === undefined
                ? mottaker.overriddenAddress
                : changedMottaker.overriddenAddress,
          };
        } else {
          mottakerList[i] = mottaker;
        }
      }

      if (!found) {
        mottakerList.push(changedMottaker);
      }

      setMottakerList({ oppgaveId, dokumentId: document.id, mottakerList });
    },
    [document.mottakerList, document.id, setMottakerList, oppgaveId],
  );

  useEffect(() => {
    const unreachableRecipients = document.mottakerList.filter(
      (m) =>
        m.part.statusList?.some((s) => s.status === PartStatusEnum.DEAD || s.status === PartStatusEnum.DELETED) ??
        false,
    );

    if (unreachableRecipients.length > 0) {
      removeMottakere(unreachableRecipients.map((r) => r.part.id));
    }
  }, [document.mottakerList, removeMottakere]);

  if (oppgaveIsLoading || document.isMarkertAvsluttet || data === undefined || getIsIncomingDocument(document)) {
    return null;
  }

  const customRecipients = document.mottakerList.filter((m) =>
    suggestedBrevmottakere.every((s) => s.part.id !== m.part.id),
  );
  const unreachableSuggestedRecipients = suggestedBrevmottakere.filter((s) => !s.reachable);
  const [firstReachableRecipient, ...restReachableSuggestedRecipients] = reachableSuggestedRecipients;
  const onlyOneReachableRecipient =
    restReachableSuggestedRecipients.length === 0 &&
    customRecipients.length === 0 &&
    firstReachableRecipient !== undefined;

  return (
    <StyledFinishDocument>
      {onlyOneReachableRecipient ? (
        <SingleRecipient
          recipient={firstReachableRecipient}
          templateId={document.templateId}
          changeMottaker={changeMottaker}
        />
      ) : null}

      <SuggestedRecipients
        recipients={onlyOneReachableRecipient ? restReachableSuggestedRecipients : reachableSuggestedRecipients}
        selectedIds={document.mottakerList.map((m) => m.part.id)}
        addMottakere={addMottakere}
        removeMottakere={removeMottakere}
        changeMottaker={changeMottaker}
        sendErrors={sendErrors}
        templateId={document.templateId}
      />

      <UnreachableSuggestedRecipients recipients={unreachableSuggestedRecipients} />

      <CustomRecipients
        mottakerList={customRecipients}
        addMottakere={addMottakere}
        removeMottakere={removeMottakere}
        changeMottaker={changeMottaker}
        sendErrors={sendErrors}
        templateId={document.templateId}
      />

      {reachableSuggestedRecipients.length === 0 && customRecipients.length === 0 ? (
        <Alert variant="warning" size="small">
          Ingen gyldige mottakere.
        </Alert>
      ) : null}

      {sendErrors?.length === 0 ? null : (
        <Alert variant="error" size="small">
          Brevet er ikke sendt til noen. Se feil over.
        </Alert>
      )}
    </StyledFinishDocument>
  );
};
