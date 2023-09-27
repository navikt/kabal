import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Loader, Tooltip } from '@navikt/ds-react';
import {
  PlateElement,
  PlateRenderElementProps,
  findNodePath,
  isElement,
  replaceNodeChildren,
  withoutNormalizing,
  withoutSavingHistory,
} from '@udecode/plate-common';
import React, { useContext, useEffect } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { NONE } from '@app/components/smart-editor-texts/types';
import { AddNewParagraphs } from '@app/plate/components/common/add-new-paragraph-buttons';
import { nodesEquals } from '@app/plate/components/maltekst/nodes-equals';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { ELEMENT_EMPTY_VOID } from '@app/plate/plugins/element-types';
import { EditorValue, EmptyVoidElement, MaltekstElement, RichTextEditorElement } from '@app/plate/types';
import { useGetTextsQuery } from '@app/redux-api/texts';
import { IRichText, IText, RichTextTypes } from '@app/types/texts/texts';

export const Maltekst = ({
  editor,
  attributes,
  children,
  element,
}: PlateRenderElementProps<EditorValue, MaltekstElement>) => {
  const { templateId } = useContext(SmartEditorContext);
  const query = useQuery({
    textType: RichTextTypes.MALTEKST,
    sections: [element.section, NONE],
    templateId,
  });
  const { data, isLoading, isFetching, refetch } = useGetTextsQuery(query);

  useEffect(() => {
    if (isLoading || isFetching || data === undefined) {
      return;
    }

    const path = findNodePath(editor, element);

    if (path === undefined) {
      return;
    }

    const rawMaltekster = lexSpecialis(data.filter(isMaltekst));
    const maltekster = rawMaltekster.length === 0 ? EMPTY_VOID : rawMaltekster;

    if (nodesEquals(element.children, maltekster)) {
      return;
    }

    withoutSavingHistory(editor, () => {
      withoutNormalizing(editor, () =>
        replaceNodeChildren<RichTextEditorElement>(editor, { at: path, nodes: maltekster }),
      );
    });
  }, [data, editor, element, isFetching, isLoading]);

  if (isLoading) {
    return (
      <PlateElement asChild attributes={attributes} element={element} editor={editor} suppressContentEditableWarning>
        <SectionContainer
          data-element={element.type}
          data-section={element.section}
          $sectionType={SectionTypeEnum.MALTEKST}
        >
          <Loader title="Laster..." />
        </SectionContainer>
      </PlateElement>
    );
  }

  const [first] = element.children;

  if (isElement(first) && first.type === ELEMENT_EMPTY_VOID) {
    return (
      <PlateElement as="div" attributes={attributes} element={element} editor={editor}>
        {null}
      </PlateElement>
    );
  }

  return (
    <PlateElement
      asChild
      attributes={attributes}
      element={element}
      editor={editor}
      contentEditable={true}
      suppressContentEditableWarning
      onDragStart={(event) => event.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <SectionContainer
        data-element={element.type}
        data-section={element.section}
        $sectionType={SectionTypeEnum.MALTEKST}
      >
        {children}
        <SectionToolbar contentEditable={false}>
          <AddNewParagraphs editor={editor} element={element} />
          <Tooltip content="Oppdater til siste versjon" delay={0}>
            <Button
              title="Oppdater til siste versjon"
              icon={<ArrowCirclepathIcon aria-hidden />}
              onClick={refetch}
              variant="tertiary"
              size="xsmall"
              contentEditable={false}
              loading={isLoading || isFetching}
            />
          </Tooltip>
        </SectionToolbar>
      </SectionContainer>
    </PlateElement>
  );
};

const lexSpecialis = (maltekster: IRichText[]): EditorValue | [EmptyVoidElement] => {
  if (maltekster.length === 0) {
    return EMPTY_VOID;
  }

  if (maltekster.length === 1) {
    return maltekster[0]?.content ?? EMPTY_VOID;
  }

  return maltekster.find((t) => t.hjemler.length !== 0)?.content ?? maltekster[0]?.content ?? EMPTY_VOID;
};

const isMaltekst = (text: IText): text is IRichText => text.textType === RichTextTypes.MALTEKST;

const EMPTY_VOID: [EmptyVoidElement] = [{ type: ELEMENT_EMPTY_VOID, children: [{ text: '' }] }];
