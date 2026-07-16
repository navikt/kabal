import { useContext } from 'react';
import { Confirm } from '@/components/documents/new-documents/modal/finish-document/confirm';
import {
  type FinishProps,
  isSmartDocumentValidatonError,
  type ValidationError,
} from '@/components/documents/new-documents/modal/finish-document/types';
import { ModalContext } from '@/components/documents/new-documents/modal/modal-context';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useSmartEditorActiveDocument } from '@/hooks/settings/use-setting';
import { useFinishDocumentMutation } from '@/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery, useLazyValidateDocumentQuery } from '@/redux-api/oppgaver/queries/documents';

export const ArchiveButtons = ({ document, accessError = null, validationErrors = [], ...rest }: FinishProps) => {
  const { id: dokumentId, tittel: documentTitle } = document;
  const [finish, { isLoading }] = useFinishDocumentMutation({ fixedCacheKey: document.id });
  const oppgaveId = useOppgaveId();
  const { close, setValidationErrors } = useContext(ModalContext);
  const [validate, { isFetching: isValidating }] = useLazyValidateDocumentQuery();
  const { data: documents = [] } = useGetDocumentsQuery(oppgaveId);
  const { value: activeSmartEditor, remove: removeActiveSmartEditor } = useSmartEditorActiveDocument();

  const onValidate = async () => {
    if (typeof oppgaveId !== 'string') {
      return false;
    }

    const validation = await validate({ dokumentId, oppgaveId }).unwrap();

    const serverErrorsForThisDocument = validation.find((v) => v.dokumentId === dokumentId)?.errors ?? [];
    const otherDocumentValidationErrors = validation.filter((v) => v.dokumentId !== dokumentId && v.errors.length > 0);

    const currentDocumentErrors: ValidationError['errors'] = [...validationErrors, ...serverErrorsForThisDocument];

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
    if (typeof oppgaveId !== 'string') {
      return;
    }

    try {
      await finish({ dokumentId, oppgaveId }).unwrap();

      if (dokumentId === activeSmartEditor) {
        removeActiveSmartEditor();
      }
      close();
    } catch (e) {
      if (isSmartDocumentValidatonError(e)) {
        const allValidationErrors = e.data.documents.map((d) => ({
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
      actionText="Arkiver"
      onValidate={onValidate}
      onFinish={onFinish}
      isFinishing={isLoading || document.isMarkertAvsluttet}
      isValidating={isValidating}
      accessError={accessError}
      {...rest}
    />
  );
};
