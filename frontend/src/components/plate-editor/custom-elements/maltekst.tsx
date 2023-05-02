import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { TextAddSpaceBefore } from '@styled-icons/fluentui-system-regular';
import { Plate, PlateProvider, PlateRenderElementProps, TEditableProps } from '@udecode/plate';
import React, { memo, useCallback, useEffect, useId, useState } from 'react';
import styled from 'styled-components';
import { renderLeaf } from '@app/components/plate-editor/leaf/render-leaf';
import { plugins } from '@app/components/plate-editor/plugins/plugins';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { useLazyGetTextsQuery } from '@app/redux-api/texts';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { RichTextTypes } from '@app/types/texts/texts';
import { EditorValue, ListItemElement, MaltekstElement, RichTextEditor } from '../types';

const editableProps: TEditableProps<EditorValue> = {
  spellCheck: false,
  autoFocus: false,
};

export const Maltekst = ({ attributes, children, element }: PlateRenderElementProps<EditorValue, MaltekstElement>) => {
  const id = useId();
  const query = useQuery({
    textType: RichTextTypes.MALTEKST,
    sections: [element.section],
    templateId: TemplateIdEnum.KLAGEVEDTAK,
  });
  const [getTexts, { data }] = useLazyGetTextsQuery();
  const [maltekst, setMaltekst] = useState<EditorValue>([]);

  const load = useCallback(async () => {
    if (query === skipToken) {
      return;
    }

    const maltekster = (await getTexts(query).unwrap())
      .map((t) => (t.textType === RichTextTypes.MALTEKST ? t : null))
      .filter(isNotNull)
      .flatMap(({ content }) => content);

    const items: ListItemElement[] = [];

    const number = Math.random() * 9 + 1;

    for (let i = 0; i < number; i++) {
      items.push({
        type: 'li',
        children: [{ text: `List item ${i}` }],
      });
    }

    setMaltekst([{ type: 'ul', children: items }]);
  }, [getTexts, query]);

  useEffect(() => {
    load();
  }, []);

  return (
    <Container {...attributes} contentEditable={false}>
      {children}

      <MaltekstContent value={maltekst} />

      <StyledButton
        contentEditable={false}
        onClick={() => console.log('Add new paragraph below maltekst')}
        title="Legg til nytt avsnitt under"
        icon={<TextAddSpaceBefore size={24} />}
        variant="tertiary"
        size="xsmall"
      />
    </Container>
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

const StyledButton = styled(Button)`
  position: absolute;
  left: -36pt;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  :focus {
    opacity: 1;
  }
`;

const Container = styled.div`
  display: inherit;
  flex-direction: inherit;
  row-gap: inherit;
  position: relative;
  color: var(--a-text-subtle);

  ::before {
    content: '';
    position: absolute;
    left: -12pt;
    width: 6pt;
    height: 0;
    top: 0;
    background-color: var(--a-bg-subtle);
    transition: height 0.4s ease-in-out;
  }

  :hover {
    ${StyledButton} {
      opacity: 1;
    }

    ::before {
      height: 100%;
    }
  }
`;
