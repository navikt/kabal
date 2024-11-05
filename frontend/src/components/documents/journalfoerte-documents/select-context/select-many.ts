import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { useCallback } from 'react';
import { getId } from './helpers';
import { useSelectOne } from './select-one';
import type { SelectHook, SelectMany } from './types';

export const useSelectMany: SelectHook<SelectMany> = (setSelectedDocuments, setLastSelectedDocument, documentList) => {
  const selectOne = useSelectOne(setSelectedDocuments, setLastSelectedDocument, documentList);

  return useCallback(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
    (documents: IJournalfoertDokumentId[]) => {
      if (documents.length === 0) {
        return;
      }

      if (documents.length === 1 && documents[0] !== undefined) {
        const [document] = documents;

        for (const doc of documentList) {
          if (doc.journalpostId === document.journalpostId) {
            if (doc.dokumentInfoId === document.dokumentInfoId) {
              selectOne(document);

              return;
            }

            for (const vedlegg of doc.vedlegg) {
              if (vedlegg.dokumentInfoId === document.dokumentInfoId) {
                selectOne({ journalpostId: document.journalpostId, dokumentInfoId: vedlegg.dokumentInfoId });

                return;
              }
            }
          }
        }

        return;
      }

      setLastSelectedDocument(null);
      // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
      setSelectedDocuments((map) => {
        for (const { journalpostId, dokumentInfoId } of documents) {
          for (const doc of documentList) {
            if (doc.journalpostId === journalpostId) {
              if (doc.dokumentInfoId === dokumentInfoId) {
                if (doc.harTilgangTilArkivvariant) {
                  map.set(getId(doc), { journalpostId, dokumentInfoId });
                }

                break;
              }

              for (const vedlegg of doc.vedlegg) {
                if (vedlegg.dokumentInfoId === dokumentInfoId) {
                  if (vedlegg.harTilgangTilArkivvariant) {
                    const ref = { journalpostId, dokumentInfoId: vedlegg.dokumentInfoId };
                    map.set(getId(ref), ref);
                  }

                  break;
                }
              }

              break;
            }
          }
        }

        return new Map(map);
      });
    },
    [documentList, selectOne, setLastSelectedDocument, setSelectedDocuments],
  );
};
