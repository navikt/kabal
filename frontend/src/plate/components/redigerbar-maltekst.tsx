import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Loader, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { PlateElement, PlateRenderElementProps, findNodePath, replaceNodeChildren } from '@udecode/plate-common';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { useSelected } from 'slate-react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { NONE } from '@app/components/smart-editor-texts/types';
import { AddNewParagraphs } from '@app/plate/components/common/add-new-paragraph-buttons';
import {
  SectionContainer,
  SectionToolbar,
  SectionTypeEnum,
  StyledSectionToolbarButton,
} from '@app/plate/components/styled-components';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import { EditorValue, RedigerbarMaltekstElement } from '@app/plate/types';
import { isNodeEmpty } from '@app/plate/utils/queries';
import { useLazyGetTextsQuery } from '@app/redux-api/texts';
import { RichTextTypes } from '@app/types/texts/texts';

export const RedigerbarMaltekst = ({
  attributes,
  children,
  element,
  editor,
}: PlateRenderElementProps<EditorValue, RedigerbarMaltekstElement>) => {
  const { templateId } = useContext(SmartEditorContext);

  const query = useQuery({
    textType: RichTextTypes.REDIGERBAR_MALTEKST,
    sections: [element.section, NONE],
    templateId,
  });

  const isSelected = useSelected();

  const [getTexts, { isLoading }] = useLazyGetTextsQuery();

  const path = findNodePath(editor, element);

  const isInitialized = useRef(!isNodeEmpty(editor, element));

  const insertRedigerbarMaltekst = useCallback(async () => {
    if (query === skipToken || path === undefined) {
      return;
    }

    isInitialized.current = true;

    try {
      const tekster = await getTexts(query).unwrap();

      const maltekster: EditorValue = [];

      for (const tekst of tekster) {
        if (tekst.textType === RichTextTypes.REDIGERBAR_MALTEKST) {
          maltekster.push(...tekst.content);
        }
      }

      replaceNodeChildren(editor, {
        at: path,
        nodes: maltekster.length === 0 ? [createSimpleParagraph()] : maltekster,
      });
    } catch (e) {
      console.error('RedigerbarMaltekst: Failed to get texts', e, query);
      insertRedigerbarMaltekst();
    }
  }, [editor, path, getTexts, query]);

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }

    isInitialized.current = !isNodeEmpty(editor, element);

    if (!isInitialized.current) {
      insertRedigerbarMaltekst();
    }
  }, [editor, element, insertRedigerbarMaltekst]);

  if (isLoading) {
    return (
      <PlateElement asChild attributes={attributes} element={element} editor={editor} contentEditable={false}>
        <SectionContainer
          data-element="redigerbar-maltekst"
          data-section={element.section}
          $sectionType={SectionTypeEnum.REDIGERBAR_MALTEKST}
          $isSelected={isSelected}
        >
          <Loader title="Laster..." />
        </SectionContainer>
      </PlateElement>
    );
  }

  return (
    <PlateElement asChild attributes={attributes} element={element} editor={editor}>
      <SectionContainer
        data-element="redigerbar-maltekst"
        data-section={element.section}
        $sectionType={SectionTypeEnum.REDIGERBAR_MALTEKST}
        $isSelected={isSelected}
      >
        {children}
        <SectionToolbar
          contentEditable={false}
          $sectionType={SectionTypeEnum.REDIGERBAR_MALTEKST}
          $label="Redigerbar maltekst"
        >
          <AddNewParagraphs editor={editor} element={element} />
          <Tooltip content="Tilbakestill tekst" delay={0}>
            <StyledSectionToolbarButton
              title="Tilbakestill tekst"
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
