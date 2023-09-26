import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Dropdown, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { PlateElement, PlateRenderElementProps, findNodePath, replaceNodeChildren } from '@udecode/plate-common';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { NONE } from '@app/components/smart-editor-texts/types';
import { AddNewParagraphs } from '@app/plate/components/common/add-new-paragraph-buttons';
import { SectionContainer, SectionTypeEnum } from '@app/plate/components/section-container';
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

  const [getTexts, { isLoading, isFetching }] = useLazyGetTextsQuery();

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
          sectionType={SectionTypeEnum.REDIGERBAR_MALTEKST}
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
        sectionType={SectionTypeEnum.REDIGERBAR_MALTEKST}
        menu={{
          title: 'Redigerbar maltekst',
          items: (
            <>
              <AddNewParagraphs editor={editor} element={element} />
              <Dropdown.Menu.GroupedList.Item onClick={insertRedigerbarMaltekst} disabled={isLoading || isFetching}>
                <ArrowCirclepathIcon aria-hidden height={20} width={20} /> Tilbakestill tekst
              </Dropdown.Menu.GroupedList.Item>
            </>
          ),
        }}
      >
        {children}
      </SectionContainer>
    </PlateElement>
  );
};
