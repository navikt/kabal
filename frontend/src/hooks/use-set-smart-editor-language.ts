import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSetLanguageMutation } from '@app/redux-api/oppgaver/mutations/smart-document';
import type { Language } from '@app/types/texts/language';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';

export const useSetSmartEditorLanguage = (): [
  (lang: Language) => Promise<void>,
  ReturnType<typeof useSetLanguageMutation>[1],
] => {
  const { documentId } = useContext(SmartEditorContext);
  const oppgaveId = useOppgaveId();
  const [setLanguage, status] = useSetLanguageMutation({ fixedCacheKey: documentId ?? undefined });

  return [
    async (lang: Language) => {
      if (documentId === null || oppgaveId === skipToken) {
        return;
      }

      await setLanguage({ dokumentId: documentId, language: lang, oppgaveId });
    },
    status,
  ];
};
