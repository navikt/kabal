import { PlateEditor } from '@udecode/plate-common';
import { useCallback } from 'react';
import { Path } from 'slate';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorLanguage } from '@app/hooks/use-smart-editor-language';
import { getNewChildren } from '@app/plate/components/maltekstseksjon/get-children';
import { replaceNodes } from '@app/plate/components/maltekstseksjon/replace-nodes';
import { MaltekstseksjonUpdate } from '@app/plate/components/maltekstseksjon/types';
import { ReplaceMethod, useGetReplaceMethod } from '@app/plate/components/maltekstseksjon/use-get-replace-method';
import { LexSpecialisStatus, ScoredText, lexSpecialis } from '@app/plate/functions/lex-specialis/lex-specialis';
import { EditorValue, MaltekstseksjonElement } from '@app/plate/types';
import {
  useLazyGetConsumerMaltekstseksjonerQuery,
  useLazyGetMaltekstseksjonTextsQuery,
} from '@app/redux-api/maltekstseksjoner/consumer';
import { IGetTextsParams } from '@app/types/common-text-types';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

type UpdateMaltekstseksjonFn = (
  element: MaltekstseksjonElement,
  resultat: IOppgavebehandling['resultat'],
  ytelseId: IOppgavebehandling['ytelseId'],
  query: IGetTextsParams,
) => Promise<void>;

interface Result {
  updateMaltekstseksjon: UpdateMaltekstseksjonFn;
  isFetching: boolean;
}

type ScoredList = ScoredText<IMaltekstseksjon>[];

export const NO_TIED_LIST: ScoredList = [];

export const useUpdateMaltekstseksjon = (
  editor: PlateEditor<EditorValue>,
  path: Path | undefined,
  templateId: TemplateIdEnum,
  setIsUpdating: (isUpdating: boolean) => void,
  setManualUpdate: (manualUpdate: MaltekstseksjonUpdate | null | undefined) => void,
  setTiedList: (tiedList: ScoredList) => void,
  setMaltekstseksjon: (maltekstseksjon: IMaltekstseksjon | null) => void,
): Result => {
  const language = useSmartEditorLanguage();
  const { data: oppgave } = useOppgave();
  const oppgaveIsLoaded = oppgave !== undefined;
  const getReplaceMethod = useGetReplaceMethod(oppgaveIsLoaded);
  const [fetchMaltekstseksjon, { isFetching: maltekstseksjonIsFetching }] = useLazyGetConsumerMaltekstseksjonerQuery();
  const [fetchMaltekstseksjonTexts, { isFetching: textsAreFetching }] = useLazyGetMaltekstseksjonTextsQuery();

  const updateMaltekstseksjon = useCallback<UpdateMaltekstseksjonFn>(
    async (element, resultat, ytelseId, query) => {
      const { utfallId, extraUtfallIdSet, hjemmelIdSet } = resultat;

      const maltekstseksjoner = await fetchMaltekstseksjon(query).unwrap();

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
          setManualUpdate(undefined);
        } else if (replaceMethod === ReplaceMethod.MANUAL) {
          setManualUpdate(null);
        } else {
          setManualUpdate(undefined);
        }
      } else {
        setMaltekstseksjon(result);
        const { id, textIdList } = result;
        const texts = await fetchMaltekstseksjonTexts({ id, language }).unwrap();
        const newChildren = getNewChildren(texts, element, element.section, language);
        const replaceMethod = await getReplaceMethod(element, result, newChildren);

        if (replaceMethod === ReplaceMethod.AUTO) {
          replaceNodes(editor, path, id, textIdList, newChildren);
          setManualUpdate(undefined);
        } else if (replaceMethod === ReplaceMethod.MANUAL) {
          setManualUpdate({ maltekstseksjon: result, children: newChildren });
        } else {
          setManualUpdate(undefined);
        }
      }

      requestIdleCallback(() => setIsUpdating(false));
    },
    [
      fetchMaltekstseksjon,
      templateId,
      setTiedList,
      setMaltekstseksjon,
      getReplaceMethod,
      editor,
      path,
      setManualUpdate,
      fetchMaltekstseksjonTexts,
      language,
      setIsUpdating,
    ],
  );

  return {
    updateMaltekstseksjon,
    isFetching: maltekstseksjonIsFetching || textsAreFetching,
  };
};
