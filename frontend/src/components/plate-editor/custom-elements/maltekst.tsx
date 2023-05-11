import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { PlateRenderElementProps, findDescendant } from '@udecode/plate';
import React, { useCallback, useEffect, useState } from 'react';
import { AddNewParagraphBelow } from '@app/components/plate-editor/custom-elements/common/add-new-paragraph-buttons';
import { SideButtons, SideButtonsContainer } from '@app/components/plate-editor/custom-elements/styled-components';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { useLazyGetTextsQuery } from '@app/redux-api/texts';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { RichTextTypes } from '@app/types/texts/texts';
import { EditorValue, MaltekstElement } from '../types';
import { MaltekstContent } from './maltekst-content';

export const Maltekst = ({
  editor,
  attributes,
  children,
  element,
}: PlateRenderElementProps<EditorValue, MaltekstElement>) => {
  const query = useQuery({
    textType: RichTextTypes.MALTEKST,
    sections: [element.section],
    templateId: TemplateIdEnum.KLAGEVEDTAK,
  });
  const [getTexts] = useLazyGetTextsQuery();
  const [maltekst, setMaltekst] = useState<EditorValue>([]);
  const [initialized, setInitialized] = useState(false);

  const load = useCallback(async () => {
    const entry = findDescendant<MaltekstElement>(editor, { at: [], match: (n) => n === element });

    if (query === skipToken || entry === undefined) {
      return;
    }

    const maltekster = (await getTexts(query).unwrap())
      .map((t) => (t.textType === RichTextTypes.MALTEKST ? t : null))
      .filter(isNotNull)
      .flatMap(({ content }) => content);

    setMaltekst(maltekster);
    setInitialized(true);
  }, [editor, element, getTexts, query]);

  useEffect(() => {
    if (!initialized) {
      load();
    }
  }, [initialized, load]);

  return (
    <SideButtonsContainer {...attributes} contentEditable={false}>
      {children}

      <MaltekstContent value={maltekst} />

      <SideButtons>
        <AddNewParagraphBelow editor={editor} element={element} />
        <Button
          title="Oppdater til siste versjon"
          icon={<ArrowCirclepathIcon aria-hidden />}
          onClick={load}
          variant="tertiary"
          size="small"
          contentEditable={false}
        />
      </SideButtons>
    </SideButtonsContainer>
  );
};
