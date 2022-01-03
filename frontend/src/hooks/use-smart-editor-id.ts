import { useEffect, useState } from 'react';
import { useCreateSmartEditorMutation } from '../redux-api/smart-editor';
import { useGetSmartEditorIdQuery, useUpdateSmartEditorIdMutation } from '../redux-api/smart-editor-id';
import { INewSmartEditor } from '../types/smart-editor';
import { useOppgaveId } from './use-oppgave-id';
import { useOppgaveType } from './use-oppgave-type';

export const useSmartEditorId = (initialContent: INewSmartEditor): string | null => {
  const oppgaveId = useOppgaveId();
  const type = useOppgaveType();

  const { data: smartEditorData } = useGetSmartEditorIdQuery({ oppgaveId, type });
  const [createSmartEditorDocument, { isLoading: createSmartEditorIsLoading }] = useCreateSmartEditorMutation();

  const [updateSmartEditorId] = useUpdateSmartEditorIdMutation();
  const [returnValue, setReturnValue] = useState<string | null>(null);

  useEffect(() => {
    if (typeof smartEditorData === 'undefined') {
      return;
    }

    if (typeof smartEditorData.smartEditorId === 'string') {
      return setReturnValue(smartEditorData.smartEditorId);
    }

    if (createSmartEditorIsLoading) {
      return setReturnValue(null);
    }

    createSmartEditorDocument(initialContent)
      .unwrap()
      .then(({ id }) => {
        setReturnValue(id);
        updateSmartEditorId({
          oppgaveId,
          type,
          smartEditorId: id,
        });
      });
  }, [
    oppgaveId,
    type,
    createSmartEditorDocument,
    initialContent,
    setReturnValue,
    smartEditorData,
    createSmartEditorIsLoading,
    updateSmartEditorId,
  ]);

  return returnValue;
};
