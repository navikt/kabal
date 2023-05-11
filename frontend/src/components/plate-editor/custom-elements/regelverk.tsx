import { GavelSoundBlockIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { PlateRenderElementProps, findDescendant, replaceNodeChildren } from '@udecode/plate';
import React, { useCallback } from 'react';
import { SideButtons, SideButtonsContainer } from '@app/components/plate-editor/custom-elements/styled-components';
import { ELEMENT_REGELVERK_CONTAINER } from '@app/components/plate-editor/plugins/element-types';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { useLazyGetTextsQuery } from '@app/redux-api/texts';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { TemplateSections } from '@app/types/texts/template-sections';
import { RichTextTypes } from '@app/types/texts/texts';
import { EditorDescendant, EditorValue, RegelverkContainerElement, RegelverkElement } from '../types';

export const Regelverk = ({
  attributes,
  children,
  element,
  editor,
}: PlateRenderElementProps<EditorValue, RegelverkElement>) => {
  const query = useQuery({
    textType: RichTextTypes.REGELVERK,
    sections: [TemplateSections.REGELVERK], // Unncessary?
    templateId: TemplateIdEnum.KLAGEVEDTAK,
  });

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

    replaceNodeChildren<EditorDescendant>(editor, { at: [...regelverkContainer[1]], nodes: regelverk });
  }, [editor, element, getTexts, query]);

  return (
    <SideButtonsContainer {...attributes}>
      {children}
      <SideButtons>
        <Button
          title="Oppdater regelverk"
          icon={<GavelSoundBlockIcon aria-hidden />}
          onClick={insertRegelverk}
          variant="tertiary"
          size="small"
          contentEditable={false}
        />
      </SideButtons>
    </SideButtonsContainer>
  );
};
