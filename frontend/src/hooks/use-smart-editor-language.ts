import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentQuery, useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { Language } from '@app/types/texts/language';

export const useSmartEditorLanguage = () => {
  const { dokumentId } = useContext(SmartEditorContext);
  const oppgaveId = useOppgaveId();
  const { data: documents } = useGetDocumentsQuery(oppgaveId);
  const { data: document } = useGetDocumentQuery(oppgaveId === skipToken ? skipToken : { dokumentId, oppgaveId });

  // Try to use cache for single document first. This will probably not be in place in time, though.
  if (document !== undefined && document?.isSmartDokument) {
    return document.language;
  }

  // Fallback to going through all documents, which should already be in cache.
  if (documents !== undefined) {
    const doc = documents.find(({ id }) => dokumentId === id);

    if (doc !== undefined && doc.isSmartDokument) {
      return doc.language;
    }
  }

  return Language.NB;
};

export enum SpellCheckLanguage {
  NB = 'no-NB',
  NN = 'no-NN',
}

export const SPELL_CHECK_LANGUAGES = Object.freeze({
  [Language.NB]: SpellCheckLanguage.NB,
  [Language.NN]: SpellCheckLanguage.NN,
});

export const useSmartEditorSpellCheckLanguage = () => {
  const language = useSmartEditorLanguage();

  return SPELL_CHECK_LANGUAGES[language];
};
