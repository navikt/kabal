import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import {
  PlateElement,
  PlateRenderElementProps,
  findNodePath,
  replaceNodeChildren,
  setNodes,
} from '@udecode/plate-common';
import React, { useCallback, useContext, useEffect } from 'react';
import { styled } from 'styled-components';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { GLOBAL, LIST_DELIMITER, NONE } from '@app/components/smart-editor-texts/types';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { AddNewParagraphs } from '@app/plate/components/common/add-new-paragraph-buttons';
import { FetchTextButton } from '@app/plate/components/common/fetch-text-button';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { lexSpecialis } from '@app/plate/functions/lex-specialis';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import { EditorValue, RedigerbarMaltekstElement } from '@app/plate/types';
import { useGetTextsQuery, useLazyGetTextsQuery } from '@app/redux-api/texts';
import { IRichText, IText, RichTextTypes, isPlainText } from '@app/types/texts/texts';

export const RedigerbarMaltekst = ({
  attributes,
  children,
  element,
  editor,
}: PlateRenderElementProps<EditorValue, RedigerbarMaltekstElement>) => {
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const { templateId } = useContext(SmartEditorContext);
  const query = useQuery({ textType: RichTextTypes.REDIGERBAR_MALTEKST, section: element.section, templateId });
  const [getTexts, { isLoading }] = useLazyGetTextsQuery();
  const { data: allTexts } = useGetTextsQuery(
    oppgave === undefined
      ? skipToken
      : {
          textType: RichTextTypes.REDIGERBAR_MALTEKST,
          templateSectionList:
            templateId !== undefined && element.section !== undefined
              ? [`${templateId}${LIST_DELIMITER}${element.section}`, `${GLOBAL}${LIST_DELIMITER}${element.section}`]
              : [],
          ytelseHjemmelList: [oppgave.ytelseId],
          utfall: NONE,
        },
  );

  const path = findNodePath(editor, element);

  const setText = useCallback(
    (text: Pick<IRichText, 'id' | 'content'> | null) => {
      if (path === undefined) {
        return;
      }

      const isNull = text === null;
      const nodes = isNull ? [createSimpleParagraph()] : text.content;
      const textId = isNull ? 'empty-paragraph' : text.id;

      setNodes<RedigerbarMaltekstElement>(editor, { textId }, { match: (node) => node === element, at: [] });
      replaceNodeChildren(editor, { at: path, nodes });
    },
    [editor, element, path],
  );

  useEffect(() => {
    if (element.textId !== undefined || allTexts === undefined) {
      return;
    }

    if (allTexts.length === 0) {
      return setText(null);
    }

    const texts: IRichText[] = [];

    for (const text of allTexts) {
      if (text.utfall.length === 0 && text.ytelseHjemmelList.length === 0 && !isPlainText(text)) {
        texts.push(text);
      }
    }

    if (texts.length === 0) {
      return setText(null);
    }

    const [first, ...rest] = texts.sort((a, b) => a.id.localeCompare(b.id));

    if (first === undefined) {
      return;
    }

    const text = rest.reduce<IRichText>(
      (prev, curr) => ({
        ...prev,
        id: prev.id + ',' + curr.id,
        content: prev.content.concat(curr.content),
      }),
      first,
    );

    setText(text);
  }, [allTexts, element.textId, setText]);

  const insertRedigerbarMaltekst = useCallback(async () => {
    if (query === skipToken || path === undefined || oppgaveIsLoading || oppgave === undefined) {
      return;
    }

    try {
      const tekster = await getTexts(query).unwrap();

      const { utfallId, extraUtfallIdSet, hjemmelIdSet } = oppgave.resultat;

      const text = lexSpecialis(
        templateId,
        element.section,
        oppgave.ytelseId,
        hjemmelIdSet,
        utfallId === null ? extraUtfallIdSet : [utfallId, ...extraUtfallIdSet],
        tekster.filter(isRedigerbarMaltekst),
      );

      setText(text);
    } catch (e) {
      console.error('RedigerbarMaltekst: Failed to get texts', e, query);
      insertRedigerbarMaltekst();
    }
  }, [query, path, oppgaveIsLoading, oppgave, getTexts, templateId, element.section, setText]);

  return (
    <PlateElement asChild attributes={attributes} element={element} editor={editor}>
      <SectionContainer
        data-element={element.type}
        data-section={element.section}
        data-text-id={element.textId}
        $sectionType={SectionTypeEnum.REDIGERBAR_MALTEKST}
      >
        <FetchTextButton
          previousTextId={element.textId}
          templateId={templateId}
          section={element.section}
          replaceNodes={setText}
          path={path}
        />
        {isLoading ? <Overlay /> : null}
        {children}
        <SectionToolbar contentEditable={false}>
          <AddNewParagraphs editor={editor} element={element} />
          <Tooltip content="Oppdater tekst" delay={0}>
            <Button
              title="Oppdater tekst"
              icon={<ArrowCirclepathIcon aria-hidden />}
              onClick={insertRedigerbarMaltekst}
              variant="tertiary"
              size="xsmall"
              contentEditable={false}
            />
          </Tooltip>
        </SectionToolbar>
      </SectionContainer>
    </PlateElement>
  );
};

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;
  opacity: 0.5;
  height: 100%;
  width: 100%;
  pointer-events: none;
`;

const isRedigerbarMaltekst = (text: IText): text is IRichText => text.textType === RichTextTypes.REDIGERBAR_MALTEKST;
