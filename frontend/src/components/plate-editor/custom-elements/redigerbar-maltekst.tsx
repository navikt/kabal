import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { PlateRenderElementProps, findDescendant, replaceNodeChildren } from '@udecode/plate';
import React, { useCallback, useEffect, useState } from 'react';
import { AddNewParagraphBelow } from '@app/components/plate-editor/custom-elements/common/add-new-paragraph-buttons';
import { SideButtons, SideButtonsContainer } from '@app/components/plate-editor/custom-elements/styled-components';
import { isNodeEmpty } from '@app/components/plate-editor/utils/queries';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { useLazyGetTextsQuery } from '@app/redux-api/texts';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { RichTextTypes } from '@app/types/texts/texts';
import { EditorDescendant, EditorValue, RedigerbarMaltekstElement, RootElement } from '../types';

export const RedigerbarMaltekst = ({
  attributes,
  children,
  element,
  editor,
}: PlateRenderElementProps<EditorValue, RedigerbarMaltekstElement>) => {
  const [initialized, setInitialized] = useState(false);

  const query = useQuery({
    textType: RichTextTypes.REDIGERBAR_MALTEKST,
    sections: [element.section],
    templateId: TemplateIdEnum.KLAGEVEDTAK,
  });

  const [getTexts] = useLazyGetTextsQuery();

  const entry = findDescendant<EditorDescendant>(editor, { at: [], match: (n) => n === element });

  const insertRedigerbarMaltekst = useCallback(async () => {
    if (query === skipToken || entry === undefined) {
      return;
    }

    const maltekster = (await getTexts(query).unwrap())
      .map((t) => (t.textType === RichTextTypes.REDIGERBAR_MALTEKST ? t : null))
      .filter(isNotNull)
      .flatMap(({ content }) => content);

    console.log(maltekster);

    replaceNodeChildren<RootElement>(editor, { at: entry[1], nodes: maltekster });
    setInitialized(true);
  }, [editor, entry, getTexts, query]);

  const insertIfEmpty = useCallback(() => {
    if (entry === undefined) {
      return;
    }

    const [node] = entry;

    if (isNodeEmpty(editor, node)) {
      insertRedigerbarMaltekst();
    }
  }, [editor, entry, insertRedigerbarMaltekst]);

  useEffect(() => {
    if (!initialized) {
      insertIfEmpty();
    }
  }, [initialized, insertIfEmpty]);

  return (
    <SideButtonsContainer {...attributes}>
      {children}
      <SideButtons>
        <AddNewParagraphBelow editor={editor} element={element} />
        <Button
          title="Tilbakestill tekst"
          icon={<ArrowCirclepathIcon aria-hidden />}
          onClick={insertRedigerbarMaltekst}
          variant="tertiary"
          size="small"
          contentEditable={false}
        />
      </SideButtons>
    </SideButtonsContainer>
  );
};
