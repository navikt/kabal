import { GavelSoundBlockIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useContext } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { styled } from 'styled-components';
import { RICH_TEXT_ROW_GAP } from '@app/components/rich-text/styled-components';
import { RegelverkContainerType } from '@app/components/rich-text/types/editor-types';
import { SmartEditorContext } from '@app/components/smart-editor/context/smart-editor-context';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { createRegelverkContainer, createSimpleParagraph } from '@app/components/smart-editor/templates/helpers';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { useLazyGetTextsQuery } from '@app/redux-api/texts';
import { RichTextTypes, TemplateSections } from '@app/types/texts/texts';
import { RenderElementProps } from './render-props';

export const RegelverkContainerElement = ({
  element,
  children,
  attributes,
}: RenderElementProps<RegelverkContainerType>) => (
  <Wrapper {...attributes}>
    <GenerateButton element={element} />
    {children}
  </Wrapper>
);

interface GenerateButtonProps {
  element: RegelverkContainerType;
}

const GenerateButton = ({ element }: GenerateButtonProps) => {
  const editor = useSlateStatic();
  const { templateId } = useContext(SmartEditorContext);
  const [getTexts] = useLazyGetTextsQuery();

  const query = useQuery({
    textType: RichTextTypes.REGELVERK,
    sections: [TemplateSections.REGELVERK],
    templateId: templateId ?? undefined,
  });

  const onClick = async () => {
    if (query === skipToken) {
      return;
    }

    try {
      const redigerbareMaltekster = (await getTexts(query).unwrap())
        .map((t) => (t.textType === RichTextTypes.REGELVERK ? t : null))
        .filter(isNotNull);

      const path = ReactEditor.findPath(editor, element);

      // Replace possibly edited content with generated content.
      Editor.withoutNormalizing(editor, () => {
        Transforms.removeNodes(editor, { at: path });

        const nodes =
          redigerbareMaltekster.length === 0
            ? [createSimpleParagraph()]
            : redigerbareMaltekster.flatMap((r) => r.content);

        Transforms.insertNodes(editor, createRegelverkContainer(nodes), { at: path, select: true });
      });
    } catch (err) {
      console.error('Failed to get redigerbare maltekster.', err);
    }
  };

  return (
    <StyledButton
      variant="tertiary"
      title="Oppdater regelverk"
      icon={<GavelSoundBlockIcon aria-hidden />}
      onClick={onClick}
      size="small"
      contentEditable={false}
    />
  );
};

const StyledButton = styled(Button)`
  position: absolute;
  left: -36pt;
  top: 0;
  opacity: 0;
  transition: opacity 0.2s ease-in-out 0s;
  user-select: none;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${RICH_TEXT_ROW_GAP};
  position: relative;
  outline: 2px dashed var(--a-border-action);
  border-radius: 4px;
  border-top-right-radius: 0;

  &::after {
    content: 'Regelverk';
    position: absolute;
    bottom: 100%;
    right: -2px;
    background-color: var(--a-border-action);
    color: white;
    font-size: 14px;
    border-radius: 4px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    padding: 2px 4px;
  }

  &::before {
    content: '';
    position: absolute;
    left: -12pt;
    width: 6pt;
    height: 0;
    top: 0;
    background-color: var(--a-bg-subtle);
    transition: height 0.4s ease-in-out;
  }

  &:hover {
    ${StyledButton} {
      opacity: 1;
    }

    &::before {
      height: 100%;
    }
  }
`;
