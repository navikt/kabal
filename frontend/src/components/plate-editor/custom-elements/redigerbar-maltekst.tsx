import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { TextAddSpaceBefore } from '@styled-icons/fluentui-system-regular';
import {
  PlateRenderElementProps,
  findDescendant,
  insertElements,
  isElement,
  replaceNodeChildren,
} from '@udecode/plate';
import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { createSimpleParagraph } from '@app/components/plate-editor/templates/helpers';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { useLazyGetPlateTextsQuery } from '@app/redux-api/texts';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { RichTextTypes } from '@app/types/texts/texts';
import { EditorValue, RedigerbarMaltekstElement } from '../types';

// Ensures a next-path even though original path is at end
const nextPath = (path: number[]) => {
  const last = path[path.length - 1];

  return [...path.slice(0, -1), typeof last === 'number' ? last + 1 : 0];
};

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

  const [getTexts] = useLazyGetPlateTextsQuery();

  const entry = findDescendant(editor, { at: [], match: (n) => n === element });

  const load = useCallback(async () => {
    if (query === skipToken) {
      return;
    }

    if (entry === undefined) {
      return;
    }

    const [node, path] = entry;

    const hasTexts = isElement(node) && editor.hasTexts(node);
    console.log('hasTexts', hasTexts);

    const maltekster = (await getTexts(query).unwrap())
      .map((t) => (t.textType === RichTextTypes.REDIGERBAR_MALTEKST ? t : null))
      .filter(isNotNull)
      .flatMap(({ content }) => content);

    replaceNodeChildren(editor, { at: path, nodes: maltekster });
  }, [editor, entry, getTexts, query]);

  // TODO: Fix infinite loop with populated dependency array
  useEffect(() => {
    load();
  }, []);

  const insertParagraph = () => {
    if (entry === undefined) {
      return;
    }

    insertElements(editor, createSimpleParagraph(), { at: nextPath(entry[1]) });
  };

  return (
    <Container {...attributes}>
      {children}
      <Buttons>
        <Button
          title="Legg til nytt avsnitt under"
          icon={<TextAddSpaceBefore size={24} />}
          onClick={insertParagraph}
          variant="tertiary"
          size="xsmall"
          contentEditable={false}
        />
        <Button
          title="Tilbakestill tekst"
          icon={<ArrowCirclepathIcon aria-hidden />}
          onClick={load}
          variant="tertiary"
          size="small"
          contentEditable={false}
        />
      </Buttons>
    </Container>
  );
};

const Buttons = styled.div`
  position: absolute;
  left: -36pt;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  display: flex;
  flex-direction: column;

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
    ${Buttons} {
      opacity: 1;
    }

    ::before {
      height: 100%;
    }
  }
`;
