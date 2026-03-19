import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';
import { SmartEditorContext } from '@/components/smart-editor/context';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useSetLanguageMutation } from '@/redux-api/oppgaver/mutations/smart-document';
import type { Language } from '@/types/texts/language';

export const useSetSmartEditorLanguage = (): [
  (lang: Language) => Promise<void>,
  ReturnType<typeof useSetLanguageMutation>[1],
] => {
  const { dokumentId } = useContext(SmartEditorContext);
  const oppgaveId = useOppgaveId();
  const [setLanguage, status] = useSetLanguageMutation({ fixedCacheKey: dokumentId });

  return [
    async (lang: Language) => {
      if (oppgaveId === skipToken) {
        return;
      }

      await setLanguage({ dokumentId, language: lang, oppgaveId });
    },
    status,
  ];
};
