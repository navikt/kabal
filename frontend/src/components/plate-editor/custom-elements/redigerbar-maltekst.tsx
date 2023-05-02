import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { TextAddSpaceBefore } from '@styled-icons/fluentui-system-regular';
import { PlateRenderElementProps, findDescendant, replaceNodeChildren } from '@udecode/plate';
import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { useLazyGetTextsQuery } from '@app/redux-api/texts';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { RichTextTypes } from '@app/types/texts/texts';
import { EditorValue, RedigerbarMaltekstElement } from '../types';

export const RedigerbarMaltekst = ({
  attributes,
  children,
  element,
  editor,
}: PlateRenderElementProps<EditorValue, RedigerbarMaltekstElement>) => {
  const query = useQuery({
    textType: RichTextTypes.REDIGERBAR_MALTEKST,
    sections: [element.section],
    templateId: TemplateIdEnum.KLAGEVEDTAK,
  });
  const [getTexts, { data }] = useLazyGetTextsQuery();

  const load = useCallback(async () => {
    if (query === skipToken) {
      return;
    }

    const maltekster = (await getTexts(query).unwrap())
      .map((t) => (t.textType === RichTextTypes.MALTEKST ? t : null))
      .filter(isNotNull)
      .flatMap(({ content }) => content);

    const entry = findDescendant(editor, { at: [], match: (n) => n === element });

    if (entry === undefined) {
      return;
    }

    const [, path] = entry;

    replaceNodeChildren(editor, {
      at: path,
      nodes: [
        {
          type: 'p',
          children: [{ text: `test ${Math.random()}` }],
        },
      ],
    });
  }, [editor, element, getTexts, query]);

  useEffect(() => {
    load();
  }, []);

  return (
    <Container {...attributes}>
      {children}
      <StyledButton
        contentEditable={false}
        onClick={() => {
          load();
          console.log('Add new paragraph below maltekst');
        }}
        title="Legg til nytt avsnitt under"
        icon={<TextAddSpaceBefore size={24} />}
        variant="tertiary"
        size="xsmall"
      />
    </Container>
  );
};

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
  color: #333;

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
