import { GavelSoundBlockIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { PlateRenderElementProps, findDescendant, replaceNodeChildren } from '@udecode/plate';
import React, { useCallback } from 'react';
import { MaltekstContainer, SideButtons } from '@app/components/plate-editor/custom-elements/styled-components';
import { ELEMENT_REGELVERK_CONTAINER } from '@app/components/plate-editor/plugins/regelverk';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { useLazyGetTextsQuery } from '@app/redux-api/texts';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { RichTextTypes, TemplateSections } from '@app/types/texts/texts';
import { EditorValue, RegelverkContainerElement } from '../types';

export const Regelverk = ({
  attributes,
  children,
  element,
  editor,
}: PlateRenderElementProps<EditorValue, RegelverkContainerElement>) => {
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

    const regelverkEntry = findDescendant(editor, { at: [], match: (n) => n === element });

    if (regelverkEntry === undefined) {
      return;
    }

    const [, at] = regelverkEntry;

    const regelverkContainer = findDescendant(editor, { at, match: (n) => n.type === ELEMENT_REGELVERK_CONTAINER });

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
    <MaltekstContainer {...attributes}>
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
    </MaltekstContainer>
  );
};
