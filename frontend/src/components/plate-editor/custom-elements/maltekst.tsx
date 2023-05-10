import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Plate, PlateProvider, PlateRenderElementProps, TEditableProps, findDescendant } from '@udecode/plate';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { AddNewParagraphButton } from '@app/components/plate-editor/custom-elements/common/add-new-paragraph-button';
import { MaltekstContainer, SideButtons } from '@app/components/plate-editor/custom-elements/styled-components';
import { renderLeaf } from '@app/components/plate-editor/leaf/render-leaf';
import { plugins } from '@app/components/plate-editor/plugins/plugins';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { useLazyGetTextsQuery } from '@app/redux-api/texts';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { RichTextTypes } from '@app/types/texts/texts';
import { EditorValue, MaltekstElement, RichTextEditor } from '../types';

const editableProps: TEditableProps<EditorValue> = {
  spellCheck: false,
  autoFocus: false,
};

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
    const entry = findDescendant(editor, { at: [], match: (n) => n === element });

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
    <MaltekstContainer {...attributes} contentEditable={false}>
      {children}

      <MaltekstContent value={maltekst} />

      <SideButtons>
        <AddNewParagraphButton editor={editor} element={element} />
        <Button
          title="Oppdater til siste versjon"
          icon={<ArrowCirclepathIcon aria-hidden />}
          onClick={load}
          variant="tertiary"
          size="small"
          contentEditable={false}
        />
      </SideButtons>
    </MaltekstContainer>
  );
};

const MaltekstContent = memo(
  ({ value }: { value: EditorValue }) => {
    const id = Math.random();

    return (
      <PlateProvider<EditorValue, RichTextEditor>
        initialValue={value}
        plugins={plugins}
        renderLeaf={renderLeaf}
        id={id}
        readOnly
      >
        <Plate<EditorValue, RichTextEditor> editableProps={editableProps} id={id} value={value} />
      </PlateProvider>
    );
  },
  (prevProps, nextProps) => prevProps === nextProps
);

MaltekstContent.displayName = 'MaltekstContent';
