import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorLanguage } from '@app/hooks/use-smart-editor-language';
import { getNewChildren } from '@app/plate/components/maltekstseksjon/get-children';
import { replaceNodes } from '@app/plate/components/maltekstseksjon/replace-nodes';
import type { MaltekstseksjonUpdate } from '@app/plate/components/maltekstseksjon/types';
import { ReplaceMethod, useGetReplaceMethod } from '@app/plate/components/maltekstseksjon/use-get-replace-method';
import { usePath } from '@app/plate/components/maltekstseksjon/use-path';
import { LexSpecialisStatus, type ScoredText, lexSpecialis } from '@app/plate/functions/lex-specialis/lex-specialis';
import { type MaltekstseksjonElement, useMyPlateEditorRef } from '@app/plate/types';
import {
  useLazyGetConsumerMaltekstseksjonerQuery,
  useLazyGetMaltekstseksjonTextsQuery,
} from '@app/redux-api/maltekstseksjoner/consumer';
import type { IGetConsumerMaltekstseksjonerParams } from '@app/types/common-text-types';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import type { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { type SkipToken, skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useEffect, useState } from 'react';

interface Result {
  isFetching: boolean;
  tiedList: ScoredList;
  maltekstseksjon: IMaltekstseksjon | null;
  manualUpdate: MaltekstseksjonUpdate | null | undefined;
  update: (preferCache: boolean) => void;
}

type ScoredList = ScoredText<IMaltekstseksjon>[];

const NO_TIED_LIST: ScoredList = [];

export const useUpdateMaltekstseksjon = (
  editorId: string,
  element: MaltekstseksjonElement,
  query: IGetConsumerMaltekstseksjonerParams | SkipToken,
  templateId: TemplateIdEnum,
  ytelseId: IOppgavebehandling['ytelseId'],
  resultat: IOppgavebehandling['resultat'],
  onUpdate: () => void,
  isUpdated: boolean,
  canManage: boolean,
): Result => {
  const editor = useMyPlateEditorRef(editorId);
  const language = useSmartEditorLanguage();
  const path = usePath(editor, element);
  const [tiedList, setTiedList] = useState<ScoredList>(NO_TIED_LIST);
  const [manualUpdate, setManualUpdate] = useState<MaltekstseksjonUpdate | null | undefined>(undefined);
  const [maltekstseksjon, setMaltekstseksjon] = useState<IMaltekstseksjon | null>(null);
  const { data: oppgave } = useOppgave();
  const oppgaveIsLoaded = oppgave !== undefined;
  const getReplaceMethod = useGetReplaceMethod(oppgaveIsLoaded);
  const [fetchMaltekstseksjoner, { isFetching: maltekstseksjonIsFetching }] =
    useLazyGetConsumerMaltekstseksjonerQuery();
  const [fetchMaltekstseksjonTexts, { isFetching: textsAreFetching }] = useLazyGetMaltekstseksjonTextsQuery();

  const update = useCallback(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
    async (preferCache = true) => {
      if (isUpdated || !canManage || query === skipToken) {
        return;
      }

      const maltekstseksjoner = await fetchMaltekstseksjoner(query, preferCache).unwrap();

      const { utfallId, extraUtfallIdSet, hjemmelIdSet } = resultat;

      const [lexSpecialisStatus, result] = lexSpecialis(
        templateId,
        element.section,
        ytelseId,
        hjemmelIdSet,
        utfallId === null ? [] : [utfallId, ...extraUtfallIdSet],
        maltekstseksjoner,
      );

      const isTie = lexSpecialisStatus === LexSpecialisStatus.TIE;

      setTiedList(isTie ? result : NO_TIED_LIST);

      if (isTie || lexSpecialisStatus === LexSpecialisStatus.NONE) {
        setMaltekstseksjon(null);
        const replaceMethod = await getReplaceMethod(element, null);

        if (replaceMethod === ReplaceMethod.AUTO) {
          replaceNodes(editor, path, null, null, null);
          onUpdate();
          setManualUpdate(undefined);
        } else if (replaceMethod === ReplaceMethod.MANUAL) {
          setManualUpdate(null);
        } else {
          onUpdate();
          setManualUpdate(undefined);
        }
      } else {
        setMaltekstseksjon(result);
        const { id, textIdList } = result;
        const texts = await fetchMaltekstseksjonTexts({ id, language }, preferCache).unwrap();
        const newChildren = getNewChildren(texts, element, element.section, language);
        const replaceMethod = await getReplaceMethod(element, result, newChildren);

        if (replaceMethod === ReplaceMethod.AUTO) {
          replaceNodes(editor, path, id, textIdList, newChildren);
          onUpdate();
          setManualUpdate(undefined);
        } else if (replaceMethod === ReplaceMethod.MANUAL) {
          setManualUpdate({ maltekstseksjon: result, children: newChildren });
        } else {
          onUpdate();
          setManualUpdate(undefined);
        }
      }
    },
    [
      canManage,
      editor,
      element,
      fetchMaltekstseksjonTexts,
      fetchMaltekstseksjoner,
      getReplaceMethod,
      isUpdated,
      language,
      onUpdate,
      path,
      query,
      resultat,
      templateId,
      ytelseId,
    ],
  );

  useEffect(() => {
    if (isUpdated || maltekstseksjonIsFetching || textsAreFetching || !canManage || query === skipToken) {
      return;
    }

    update();
  }, [canManage, isUpdated, maltekstseksjonIsFetching, query, textsAreFetching, update]);

  return {
    isFetching: maltekstseksjonIsFetching || textsAreFetching,
    tiedList,
    maltekstseksjon,
    manualUpdate,
    update,
  };
};
