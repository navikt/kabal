import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Loader, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { PlateElement, PlateRenderElementProps, findNodePath, replaceNodeChildren } from '@udecode/plate-common';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { AddNewParagraphs } from '@app/plate/components/common/add-new-paragraph-buttons';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { lexSpecialis } from '@app/plate/functions/lex-specialis';
import { ELEMENT_EMPTY_VOID } from '@app/plate/plugins/element-types';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import { EditorValue, EmptyVoidElement, RedigerbarMaltekstElement } from '@app/plate/types';
import { isNodeEmpty, isOfElementType } from '@app/plate/utils/queries';
import { useLazyGetTextsQuery } from '@app/redux-api/texts';
import { IRichText, IText, RichTextTypes } from '@app/types/texts/texts';

const consistsOfOnlyEmptyVoid = (element: RedigerbarMaltekstElement) => {
  if (element.children.length !== 1) {
    return false;
  }

  const [child] = element.children;

  return isOfElementType<EmptyVoidElement>(child, ELEMENT_EMPTY_VOID);
};

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

  const path = findNodePath(editor, element);

  const isInitialized = useRef(!isNodeEmpty(editor, element));

  const insertRedigerbarMaltekst = useCallback(async () => {
    if (query === skipToken || path === undefined || oppgaveIsLoading || oppgave === undefined) {
      return;
    }

    isInitialized.current = true;

    try {
      const tekster = await getTexts(query).unwrap();

      const nodes = lexSpecialis(
        templateId,
        element.section,
        oppgave.ytelseId,
        oppgave.resultat.hjemmelIdSet,
        oppgave.resultat.utfallId === null
          ? oppgave.resultat.extraUtfallIdSet
          : [oppgave.resultat.utfallId, ...oppgave.resultat.extraUtfallIdSet],
        tekster.filter(isRedigerbarMaltekst),
      )?.content ?? [createSimpleParagraph()];

      replaceNodeChildren(editor, {
        at: path,
        nodes,
      });
    } catch (e) {
      console.error('RedigerbarMaltekst: Failed to get texts', e, query);
      insertRedigerbarMaltekst();
    }
  }, [query, path, oppgaveIsLoading, oppgave, getTexts, templateId, element.section, editor]);

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }

    isInitialized.current = !consistsOfOnlyEmptyVoid(element);

    if (!isInitialized.current) {
      insertRedigerbarMaltekst();
    }
  }, [editor, element, insertRedigerbarMaltekst]);

  if (isLoading) {
    return (
      <PlateElement asChild attributes={attributes} element={element} editor={editor} contentEditable={false}>
        <SectionContainer
          data-element={element.type}
          data-section={element.section}
          $sectionType={SectionTypeEnum.REDIGERBAR_MALTEKST}
        >
          <Loader title="Laster..." />
        </SectionContainer>
      </PlateElement>
    );
  }

  return (
    <PlateElement asChild attributes={attributes} element={element} editor={editor}>
      <SectionContainer
        data-element={element.type}
        data-section={element.section}
        $sectionType={SectionTypeEnum.REDIGERBAR_MALTEKST}
      >
        {children}
        <SectionToolbar contentEditable={false}>
          <AddNewParagraphs editor={editor} element={element} />
          <Tooltip content="Tilbakestill tekst" delay={0}>
            <Button
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

const isRedigerbarMaltekst = (text: IText): text is IRichText => text.textType === RichTextTypes.REDIGERBAR_MALTEKST;
