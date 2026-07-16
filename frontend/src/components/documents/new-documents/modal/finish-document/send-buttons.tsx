import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';
import { Confirm } from '@/components/documents/new-documents/modal/finish-document/confirm';
import {
  type FinishProps,
  isSmartDocumentValidatonError,
  type ValidationError,
} from '@/components/documents/new-documents/modal/finish-document/types';
import { ModalContext } from '@/components/documents/new-documents/modal/modal-context';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorActiveDocument } from '@/hooks/settings/use-setting';
import { useSuggestedBrevmottakere } from '@/hooks/use-suggested-brevmottakere';
import { useFinishDocumentMutation, useSetMottakerListMutation } from '@/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery, useLazyValidateDocumentQuery } from '@/redux-api/oppgaver/queries/documents';
import { DistribusjonsType } from '@/types/documents/documents';
import { DocumentValidationFrontendError } from '@/types/documents/validation';

export const SendButtons = ({ document, accessError = null, validationErrors = [], ...rest }: FinishProps) => {
  const { id: dokumentId, tittel: documentTitle, mottakerList, dokumentTypeId } = document;
  const { data, isLoading: oppgaveIsLoading } = useOppgave();
  const [setMottakerList] = useSetMottakerListMutation();
  const [finish, { isLoading: isFinishing }] = useFinishDocumentMutation({ fixedCacheKey: document.id });
  const [validate, { isFetching: isValidating }] = useLazyValidateDocumentQuery();
  const { data: documents = [] } = useGetDocumentsQuery(data?.id ?? skipToken);
  const { value: activeSmartEditor, remove: removeActiveSmartEditor } = useSmartEditorActiveDocument();
  const { close, setValidationErrors } = useContext(ModalContext);
  const [suggestedBrevmottakere] = useSuggestedBrevmottakere(document.mottakerList, document.templateId);
  const reachableSuggestedReceivers = suggestedBrevmottakere.filter((s) => s.reachable);

  if (oppgaveIsLoading || data === undefined) {
    return null;
  }

  const onValidate = async () => {
    if (typeof data?.id !== 'string') {
      return false;
    }

    const currentDocumentErrors: ValidationError['errors'] = [...validationErrors];

    // Ekspedisjonsbrev til Trygderetten will always have Trygderetten as only receiver
    if (mottakerList.length === 0 && dokumentTypeId !== DistribusjonsType.EKSPEDISJONSBREV_TIL_TRYGDERETTEN) {
      if (reachableSuggestedReceivers.length !== 1) {
        currentDocumentErrors.push(DocumentValidationFrontendError.NO_RECEIVERS);
      } else {
        await setMottakerList({
          oppgaveId: data.id,
          dokumentId,
          mottakerList: reachableSuggestedReceivers,
        });
      }
    }

    const validation = await validate({ dokumentId, oppgaveId: data.id }).unwrap();

    const serverErrors = validation.find((v) => v.dokumentId === dokumentId)?.errors ?? [];
    const otherDocumentValidationErrors = validation.filter((v) => v.dokumentId !== dokumentId && v.errors.length > 0);

    currentDocumentErrors.push(...serverErrors);

    const allValidationErrors: ValidationError[] = [
      ...(currentDocumentErrors.length === 0
        ? []
        : [{ dokumentId, title: documentTitle, errors: currentDocumentErrors }]),
      ...otherDocumentValidationErrors.map((v) => ({
        dokumentId: v.dokumentId,
        title: documents.find((d) => d.id === v.dokumentId)?.tittel ?? v.dokumentId,
        errors: v.errors,
      })),
    ];

    setValidationErrors(allValidationErrors);

    return allValidationErrors.length === 0;
  };

  const onFinish = async () => {
    try {
      if (
        mottakerList.length === 0 &&
        reachableSuggestedReceivers.length === 1 &&
        dokumentTypeId !== DistribusjonsType.EKSPEDISJONSBREV_TIL_TRYGDERETTEN
      ) {
        await setMottakerList({
          oppgaveId: data.id,
          dokumentId,
          mottakerList: reachableSuggestedReceivers,
        });
      }

      await finish({ dokumentId, oppgaveId: data.id }).unwrap();

      if (dokumentId === activeSmartEditor) {
        removeActiveSmartEditor();
      }
      close();
    } catch (e) {
      if (isSmartDocumentValidatonError(e)) {
        const allValidationErrors = e.data.documents.map<ValidationError>((d) => ({
          dokumentId: d.dokumentId,
          title: documents.find((doc) => doc.id === d.dokumentId)?.tittel ?? d.dokumentId,
          errors: d.errors,
        }));

        setValidationErrors(allValidationErrors);
      }
    }
  };

  return (
    <Confirm
      actionText="Send ut"
      onValidate={onValidate}
      onFinish={onFinish}
      isValidating={isValidating}
      isFinishing={isFinishing}
      accessError={accessError}
      {...rest}
    />
  );
};
