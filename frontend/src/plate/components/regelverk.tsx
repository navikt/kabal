import { GavelSoundBlockIcon } from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { PlateElement, PlateRenderElementProps, findDescendant, replaceNodeChildren } from '@udecode/plate-common';
import React, { useCallback, useContext } from 'react';
import { useSelected } from 'slate-react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { isNotNull } from '@app/functions/is-not-type-guards';
import {
  SectionContainer,
  SectionToolbar,
  SectionTypeEnum,
  StyledSectionToolbarButton,
} from '@app/plate/components/styled-components';
import { ELEMENT_REGELVERK_CONTAINER } from '@app/plate/plugins/element-types';
import { EditorValue, RegelverkContainerElement, RegelverkElement, TemplateSections } from '@app/plate/types';
import { useLazyGetTextsQuery } from '@app/redux-api/texts';
import { RichTextTypes } from '@app/types/texts/texts';

export const Regelverk = ({
  attributes,
  children,
  element,
  editor,
}: PlateRenderElementProps<EditorValue, RegelverkElement>) => {
  const { templateId } = useContext(SmartEditorContext);
  const query = useQuery({
    textType: RichTextTypes.REGELVERK,
    sections: [TemplateSections.REGELVERK], // Unncessary?
    templateId,
  });

  const isSelected = useSelected();

  const [getTexts] = useLazyGetTextsQuery();

  const insertRegelverk = useCallback(async () => {
    if (query === skipToken) {
      return;
    }

    const regelverkEntry = findDescendant<RegelverkElement>(editor, { at: [], match: (n) => n === element });

    if (regelverkEntry === undefined) {
      return;
    }

    const [, at] = regelverkEntry;

    const regelverkContainer = findDescendant<RegelverkContainerElement>(editor, {
      at,
      match: (n) => n.type === ELEMENT_REGELVERK_CONTAINER,
    });

    if (regelverkContainer === undefined) {
      return;
    }

    const regelverk = (await getTexts(query).unwrap())
      .map((t) => (t.textType === RichTextTypes.REGELVERK ? t : null))
      .filter(isNotNull)
      .flatMap(({ content }) => content);

    replaceNodeChildren(editor, { at: [...regelverkContainer[1]], nodes: regelverk });
  }, [editor, element, getTexts, query]);

  return (
    <PlateElement
      asChild
      attributes={attributes}
      element={element}
      editor={editor}
      onDragStart={(event) => event.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <SectionContainer $sectionType={SectionTypeEnum.REGELVERK} $isSelected={isSelected} data-element="regelverk">
        {children}
        <SectionToolbar $label="Regelverk" $sectionType={SectionTypeEnum.REGELVERK} contentEditable={false}>
          <Tooltip content="Oppdater regelverk" delay={0}>
            <StyledSectionToolbarButton
              title="Oppdater regelverk"
              icon={<GavelSoundBlockIcon aria-hidden />}
              onClick={insertRegelverk}
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

export const RegelverkContainer = ({
  attributes,
  children,
  element,
  editor,
}: PlateRenderElementProps<EditorValue, RegelverkContainerElement>) => (
  <PlateElement
    asChild
    attributes={attributes}
    element={element}
    editor={editor}
    onDragStart={(event) => event.stopPropagation()}
    onDrop={(e) => e.stopPropagation()}
  >
    <div>{children}</div>
  </PlateElement>
);
