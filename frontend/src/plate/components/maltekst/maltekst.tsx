import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Loader, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import {
  PlateElement,
  PlateRenderElementProps,
  findNode,
  insertNodes,
  isElement,
  removeNodes,
  withoutNormalizing,
  withoutSavingHistory,
} from '@udecode/plate-common';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { useSelected } from 'slate-react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { NONE } from '@app/components/smart-editor-texts/types';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { AddNewParagraphs } from '@app/plate/components/common/add-new-paragraph-buttons';
import { nodesEquals } from '@app/plate/components/maltekst/nodes-equals';
import {
  SectionContainer,
  SectionToolbar,
  SectionTypeEnum,
  StyledSectionToolbarButton,
} from '@app/plate/components/styled-components';
import { ELEMENT_MALTEKST } from '@app/plate/plugins/element-types';
import { EditorValue, MaltekstElement } from '@app/plate/types';
import { useLazyGetTextsQuery } from '@app/redux-api/texts';
import { IRichText, RichTextTypes } from '@app/types/texts/texts';

const lexSpecialis = (maltekster: IRichText[]): EditorValue | null => {
  if (maltekster.length === 0) {
    return null;
  }

  if (maltekster.length === 1) {
    return maltekster[0]?.content ?? null;
  }

  return maltekster.find((t) => t.hjemler.length !== 0)?.content ?? maltekster[0]?.content ?? null;
};

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
  const [getTexts, { isLoading }] = useLazyGetTextsQuery();
  const initialized = useRef(false);

  const isSelected = useSelected();

  const load = useCallback(async () => {
    initialized.current = true;

    if (query === skipToken) {
      return;
    }

    const maltekster = lexSpecialis(
      (await getTexts(query).unwrap()).map((t) => (t.textType === RichTextTypes.MALTEKST ? t : null)).filter(isNotNull),
    );

    if (maltekster === null) {
      return;
    }

    const entry = findNode(editor, {
      at: [],
      match: (n) => n === element,
      voids: false,
    });

    if (entry === undefined) {
      return;
    }

    const [node, path] = entry;

    if (isElement(node) && node.type === ELEMENT_MALTEKST && nodesEquals(node.children, maltekster)) {
      return;
    }

    withoutSavingHistory(editor, () => {
      withoutNormalizing(editor, () => {
        removeNodes(editor, {
          at: path,
          voids: false,
          match: (n) => n === element,
        });

        insertNodes(editor, { ...element, children: maltekster }, { at: path, voids: false });
      });
    });
  }, [editor, element, getTexts, query]);

  useEffect(() => {
    if (!initialized.current) {
      load();
    }
  }, [load]);

  if (isLoading) {
    return (
      <PlateElement asChild attributes={attributes} element={element} editor={editor} suppressContentEditableWarning>
        <SectionContainer data-element="maltekst" $sectionType={SectionTypeEnum.MALTEKST} $isSelected={isSelected}>
          <Loader title="Laster..." />
        </SectionContainer>
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
      <SectionContainer data-element="maltekst" $sectionType={SectionTypeEnum.MALTEKST} $isSelected={isSelected}>
        {children}
        <SectionToolbar $sectionType={SectionTypeEnum.MALTEKST} $label="Maltekst" contentEditable={false}>
          <AddNewParagraphs editor={editor} element={element} />
          <Tooltip content="Oppdater til siste versjon" delay={0}>
            <StyledSectionToolbarButton
              title="Oppdater til siste versjon"
              icon={<ArrowCirclepathIcon aria-hidden />}
              onClick={load}
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
