/* eslint-disable max-lines */
import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  PlateElement,
  PlateRenderElementProps,
  findNodePath,
  isEditorReadOnly,
  replaceNodeChildren,
  setNodes,
  unsetNodes,
  withoutNormalizing,
  withoutSavingHistory,
} from '@udecode/plate-common';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { areDescendantsEqual } from '@app/functions/are-descendants-equal';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { AddNewParagraphs } from '@app/plate/components/common/add-new-paragraph-buttons';
import { getChildren } from '@app/plate/components/maltekstseksjon/get-children';
import { MaltekstseksjonUpdate } from '@app/plate/components/maltekstseksjon/types';
import { UpdateMaltekstseksjon } from '@app/plate/components/maltekstseksjon/update-maltekstseksjon';
import { MaltekstseksjonContainer, MaltekstseksjonToolbar } from '@app/plate/components/styled-components';
import { lexSpecialis } from '@app/plate/functions/lex-specialis';
import { ELEMENT_EMPTY_VOID } from '@app/plate/plugins/element-types';
import { createEmptyVoid } from '@app/plate/templates/helpers';
import {
  EditorValue,
  EmptyVoidElement,
  MaltekstElement,
  MaltekstseksjonElement,
  RedigerbarMaltekstElement,
} from '@app/plate/types';
import { isOfElementType } from '@app/plate/utils/queries';
import {
  useLazyGetConsumerMaltekstseksjonerQuery,
  useLazyGetMaltekstseksjonTextsQuery,
} from '@app/redux-api/maltekstseksjoner/consumer';
import { ApiQuery, RichTextTypes } from '@app/types/common-text-types';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

enum ReplaceMethod {
  AUTO,
  MANUAL,
  NO_CHANGE,
}

export const Maltekstseksjon = ({
  editor,
  attributes,
  children,
  element,
}: PlateRenderElementProps<EditorValue, MaltekstseksjonElement>) => {
  const { data: oppgave } = useOppgave();
  const { templateId } = useContext(SmartEditorContext);
  const query = useQuery({ textType: RichTextTypes.MALTEKSTSEKSJON, section: element.section, templateId });
  const [fetchMaltekstseksjon, { isFetching: maltekstseksjonIsFetching }] = useLazyGetConsumerMaltekstseksjonerQuery();
  const [fetchMaltekstseksjonTexts, { isFetching: maltekstseksjonTextsIsFetching }] =
    useLazyGetMaltekstseksjonTextsQuery();
  const [getOriginalTexts] = useLazyGetMaltekstseksjonTextsQuery();
  const [manualUpdate, setManualUpdate] = useState<MaltekstseksjonUpdate | null | undefined>(undefined);

  const oppgaveIsLoaded = oppgave !== undefined;

  const path = useMemo(() => findNodePath(editor, element), [editor, element]);

  const replaceNodes = useCallback(
    (id: string | null, textIdList: string[] | null, nodes: (MaltekstElement | RedigerbarMaltekstElement)[] | null) => {
      if (path === undefined) {
        return;
      }

      setManualUpdate(undefined);

      withoutSavingHistory(editor, () => {
        withoutNormalizing(editor, () => {
          if (id === null) {
            unsetNodes<MaltekstseksjonElement>(editor, 'id', { at: path });
          } else {
            setNodes<MaltekstseksjonElement>(editor, { id }, { at: path });
          }

          if (textIdList === null) {
            unsetNodes<MaltekstseksjonElement>(editor, 'textIdList', { at: path });
          } else {
            setNodes<MaltekstseksjonElement>(editor, { textIdList }, { at: path });
          }

          if (nodes === null) {
            replaceNodeChildren(editor, { at: path, nodes: [createEmptyVoid()] });
          } else {
            replaceNodeChildren(editor, { at: path, nodes });
          }
        });
      });
    },
    [path, editor],
  );

  type GetReplaceMethodFn = (
    previousMaltekstseksjonElement: MaltekstseksjonElement,
    newMaltekstseksjonId: string | null,
  ) => Promise<ReplaceMethod>;

  const getReplaceMethod: GetReplaceMethodFn = useCallback(
    async (previousMaltekstseksjonElement, newMaltekstseksjonId) => {
      if (!oppgaveIsLoaded) {
        return ReplaceMethod.NO_CHANGE;
      }

      const previousId = previousMaltekstseksjonElement.id ?? null;

      if (previousId === newMaltekstseksjonId) {
        return ReplaceMethod.NO_CHANGE;
      }

      if (previousId === null) {
        return ReplaceMethod.AUTO;
      }

      const [firstChild] = previousMaltekstseksjonElement.children;

      if (isOfElementType<EmptyVoidElement>(firstChild, ELEMENT_EMPTY_VOID)) {
        return ReplaceMethod.AUTO;
      }

      const originalTexts = await getOriginalTexts(previousId, true).unwrap();

      if (originalTexts.length !== previousMaltekstseksjonElement.children.length) {
        return ReplaceMethod.MANUAL;
      }

      for (const text of previousMaltekstseksjonElement.children) {
        if (!originalTexts.some((ot) => ot.id === text.id)) {
          return ReplaceMethod.MANUAL;
        }
      }

      const unchanged = areDescendantsEqual(
        previousMaltekstseksjonElement.children.flatMap((t) => (t.type === ELEMENT_EMPTY_VOID ? [] : t.children)),
        originalTexts.flatMap((t) => t.content),
      );

      return unchanged ? ReplaceMethod.AUTO : ReplaceMethod.MANUAL;
    },
    [oppgaveIsLoaded, getOriginalTexts],
  );

  type UpdateMaltekstseksjonFn = (
    _element: MaltekstseksjonElement,
    resultat: IOppgavebehandling['resultat'],
    ytelseId: IOppgavebehandling['ytelseId'],
    _query: ApiQuery,
  ) => Promise<void>;

  const updateMaltekstseksjon: UpdateMaltekstseksjonFn = useCallback(
    async (_element, resultat, ytelseId, _query) => {
      const maltekstseksjoner = await fetchMaltekstseksjon(_query).unwrap();

      const { utfallId, extraUtfallIdSet, hjemmelIdSet } = resultat;

      const maltekstseksjon = lexSpecialis(
        templateId,
        _element.section,
        ytelseId,
        hjemmelIdSet,
        utfallId === null ? extraUtfallIdSet : [utfallId, ...extraUtfallIdSet],
        maltekstseksjoner,
      );

      if (maltekstseksjon === null) {
        const replace = await getReplaceMethod(_element, null);

        if (replace === ReplaceMethod.AUTO) {
          replaceNodes(null, null, null);
          setManualUpdate(undefined);
        } else if (replace === ReplaceMethod.MANUAL) {
          setManualUpdate(null);
        } else {
          setManualUpdate(undefined);
        }

        return;
      }

      const { id, textIdList } = maltekstseksjon;
      const texts = await fetchMaltekstseksjonTexts(id).unwrap();
      const maltekstseksjonChildren = getChildren(texts, _element, _element.section);
      const autoReplace = await getReplaceMethod(_element, id);

      if (autoReplace === ReplaceMethod.AUTO) {
        replaceNodes(id, textIdList, maltekstseksjonChildren);
        setManualUpdate(undefined);
      } else if (autoReplace === ReplaceMethod.MANUAL) {
        setManualUpdate({ maltekstseksjon, children: maltekstseksjonChildren });
      } else {
        setManualUpdate(undefined);
      }
    },
    [fetchMaltekstseksjon, fetchMaltekstseksjonTexts, replaceNodes, getReplaceMethod, templateId],
  );

  useEffect(() => {
    if (oppgave?.ytelseId === undefined || oppgave?.resultat === undefined || query === skipToken) {
      return;
    }

    updateMaltekstseksjon(element, oppgave.resultat, oppgave.ytelseId, query);
  }, [element, oppgave?.ytelseId, oppgave?.resultat, query, updateMaltekstseksjon]);

  const isFetching = maltekstseksjonIsFetching || maltekstseksjonTextsIsFetching;

  return (
    <PlateElement
      asChild
      attributes={attributes}
      element={element}
      editor={editor}
      contentEditable={!isEditorReadOnly(editor)}
      suppressContentEditableWarning
      onDragStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <MaltekstseksjonContainer data-element={element.type} data-section={element.section}>
        {manualUpdate !== undefined ? <UpdateMaltekstseksjon next={manualUpdate} replaceNodes={replaceNodes} /> : null}
        {children}
        <MaltekstseksjonToolbar contentEditable={false}>
          <AddNewParagraphs editor={editor} element={element} />
          <Tooltip content="Oppdater til siste versjon" delay={0}>
            <Button
              icon={<ArrowCirclepathIcon aria-hidden />}
              onClick={() => {
                if (oppgave !== undefined && query !== skipToken) {
                  updateMaltekstseksjon(element, oppgave.resultat, oppgave.ytelseId, query);
                }
              }}
              variant="tertiary"
              size="xsmall"
              contentEditable={false}
              loading={isFetching}
            />
          </Tooltip>
        </MaltekstseksjonToolbar>
      </MaltekstseksjonContainer>
    </PlateElement>
  );
};
