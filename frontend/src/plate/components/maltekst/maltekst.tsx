import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import {
  PlateElement,
  PlateRenderElementProps,
  findNodePath,
  isEditorReadOnly,
  isElement,
  replaceNodeChildren,
} from '@udecode/plate-common';
import React from 'react';
import { LegacyMaltekst } from '@app/plate/components/maltekst/legacy-maltekst';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { ELEMENT_EMPTY_VOID } from '@app/plate/plugins/element-types';
import { EditorValue, MaltekstElement } from '@app/plate/types';
import { useLazyGetConsumerTextByIdQuery } from '@app/redux-api/texts/consumer';
import { RichTextTypes } from '@app/types/common-text-types';

export const Maltekst = ({
  editor,
  attributes,
  children,
  element,
}: PlateRenderElementProps<EditorValue, MaltekstElement>) => {
  const [getText, { isFetching }] = useLazyGetConsumerTextByIdQuery();

  // TODO: Remove this when all smart documents in prod use maltekstseksjon
  if (element.id === undefined) {
    return (
      <LegacyMaltekst editor={editor} attributes={attributes} element={element}>
        {children}
      </LegacyMaltekst>
    );
  }

  const reload = async () => {
    if (element.id === undefined) {
      return;
    }

    const path = findNodePath(editor, element);

    if (path === undefined) {
      return;
    }

    const text = await getText(element.id).unwrap();

    if (text.textType !== RichTextTypes.MALTEKST) {
      return;
    }

    replaceNodeChildren(editor, { at: path, nodes: text.content });
  };

  const [first] = element.children;

  if (isElement(first) && first.type === ELEMENT_EMPTY_VOID) {
    return (
      <PlateElement as="div" attributes={attributes} element={element} editor={editor}>
        {null}
      </PlateElement>
    );
  }

  const readOnly = isEditorReadOnly(editor);

  return (
    <PlateElement
      asChild
      attributes={attributes}
      element={element}
      editor={editor}
      contentEditable={!readOnly}
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
        {readOnly ? null : (
          <SectionToolbar contentEditable={false}>
            <Tooltip content="Oppdater til siste versjon" delay={0}>
              <Button
                icon={<ArrowCirclepathIcon aria-hidden />}
                onClick={reload}
                variant="tertiary"
                size="xsmall"
                contentEditable={false}
                loading={isFetching}
              />
            </Tooltip>
          </SectionToolbar>
        )}
      </SectionContainer>
    </PlateElement>
  );
};
