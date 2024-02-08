import { Alert } from '@navikt/ds-react';
import React, { useCallback, useMemo } from 'react';
import { CustomRecipients } from '@app/components/documents/new-documents/modal/finish-document/custom-recipients';
import { isSendError } from '@app/components/documents/new-documents/modal/finish-document/is-send-error';
import { SingleRecipient } from '@app/components/documents/new-documents/modal/finish-document/single-recipient';
import { SuggestedRecipients } from '@app/components/documents/new-documents/modal/finish-document/suggested-recipients';
import { getIsIncomingDocument } from '@app/functions/is-incoming-document';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSuggestedBrevmottakere } from '@app/hooks/use-suggested-brevmottakere';
import { useFinishDocumentMutation, useSetMottakerListMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { IMainDocument, IMottaker } from '@app/types/documents/documents';
import { StyledFinishDocument } from './styled-components';

export const Receipients = (document: IMainDocument) => {
  const [setMottakerList] = useSetMottakerListMutation();
  const [, { error: finishError }] = useFinishDocumentMutation({
    fixedCacheKey: document.id,
  });
  const { data, isLoading: oppgaveIsLoading } = useOppgave();

  const [suggestedBrevmottakere] = useSuggestedBrevmottakere(document.mottakerList);

  const sendErrors = useMemo(() => {
    if (isSendError(finishError)) {
      return finishError.data.sections.find((s) => s.section === 'mottakere')?.properties ?? [];
    }

    return [];
  }, [finishError]);

  const oppgaveId = data?.id;

  const addMottakere = useCallback(
    (mottakere: IMottaker[]) => {
      if (oppgaveId === undefined) {
        return;
      }

      const mottakerList =
        document.mottakerList.length === 0 && suggestedBrevmottakere.length === 1
          ? [
              ...suggestedBrevmottakere.filter((s) => !document.mottakerList.some((m) => m.part.id === s.part.id)),
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
    [oppgaveId, document.mottakerList, document.id, suggestedBrevmottakere, setMottakerList],
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

  if (oppgaveIsLoading || document.isMarkertAvsluttet || data === undefined || getIsIncomingDocument(document)) {
    return null;
  }

  const customRecipients = document.mottakerList.filter((m) =>
    suggestedBrevmottakere.every((s) => s.part.id !== m.part.id),
  );
  const [recipient] = suggestedBrevmottakere;
  const onlyOneRecipient =
    suggestedBrevmottakere.length === 1 && customRecipients.length === 0 && recipient !== undefined;

  return (
    <StyledFinishDocument>
      {onlyOneRecipient ? (
        <SingleRecipient recipient={recipient} templateId={document.templateId} changeMottaker={changeMottaker} />
      ) : (
        <SuggestedRecipients
          suggestedRecipients={suggestedBrevmottakere}
          selectedIds={document.mottakerList.map((m) => m.part.id)}
          addMottakere={addMottakere}
          removeMottakere={removeMottakere}
          changeMottaker={changeMottaker}
          sendErrors={sendErrors}
          templateId={document.templateId}
        />
      )}

      <CustomRecipients
        mottakerList={customRecipients}
        addMottakere={addMottakere}
        removeMottakere={removeMottakere}
        changeMottaker={changeMottaker}
        sendErrors={sendErrors}
        templateId={document.templateId}
      />

      {sendErrors?.length === 0 ? null : (
        <Alert variant="error" size="small">
          Brevet er ikke sendt til noen. Se feil over.
        </Alert>
      )}
    </StyledFinishDocument>
  );
};
