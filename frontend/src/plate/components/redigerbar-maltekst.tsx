import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import {
  PlateElement,
  PlateRenderElementProps,
  findNodePath,
  isEditorReadOnly,
  replaceNodeChildren,
} from '@udecode/plate-common';
import React from 'react';
import { LegacyRedigerbarMaltekst } from '@app/plate/components/legacy-redigerbar-maltekst';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { EditorValue, RedigerbarMaltekstElement } from '@app/plate/types';
import { useLazyGetConsumerTextByIdQuery } from '@app/redux-api/texts/consumer';
import { RichTextTypes } from '@app/types/common-text-types';

export const RedigerbarMaltekst = ({
  attributes,
  children,
  element,
  editor,
}: PlateRenderElementProps<EditorValue, RedigerbarMaltekstElement>) => {
  const [getText, { isFetching }] = useLazyGetConsumerTextByIdQuery();

  const reload = async () => {
    if (element.id === undefined) {
      return;
    }

    const path = findNodePath(editor, element);

    if (path === undefined) {
      return;
    }

    const text = await getText(element.id).unwrap();

    if (text.textType !== RichTextTypes.REDIGERBAR_MALTEKST) {
      return;
    }

    replaceNodeChildren(editor, { at: path, nodes: text.content });
  };

  // TODO: Remove when all smart documents in prod use maltekstseksjon
  if (element.id === undefined) {
    return (
      <LegacyRedigerbarMaltekst editor={editor} attributes={attributes} element={element}>
        {children}
      </LegacyRedigerbarMaltekst>
    );
  }

  const readOnly = isEditorReadOnly(editor);

  return (
    <PlateElement asChild attributes={attributes} element={element} editor={editor}>
      <SectionContainer
        data-element={element.type}
        data-section={element.section}
        $sectionType={SectionTypeEnum.REDIGERBAR_MALTEKST}
      >
        {children}
        {readOnly ? null : (
          <SectionToolbar contentEditable={false}>
            <Tooltip content="Tilbakestill tekst" delay={0}>
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
