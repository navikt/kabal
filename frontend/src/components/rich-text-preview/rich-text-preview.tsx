import { FileSearchIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps } from '@navikt/ds-react';
import { Plate } from '@udecode/plate-common';
import { useRef, useState } from 'react';
import { styled } from 'styled-components';
import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { SPELL_CHECK_LANGUAGES } from '@app/hooks/use-smart-editor-language';
import { BASE_FONT_SIZE } from '@app/plate/components/get-scaled-em';
import { renderReadOnlyLeaf } from '@app/plate/leaf/render-leaf';
import { PlateEditor } from '@app/plate/plate-editor';
import { previewPlugins } from '@app/plate/plugins/plugin-sets/preview';
import { EditorValue, RichTextEditor } from '@app/plate/types';

type OpenSide = 'left' | 'right';
type OpenDirection = 'up' | 'down';

interface PreviewProps {
  content: EditorValue;
  id: string;
  buttonSize: ButtonProps['size'];
  buttonVariant: ButtonProps['variant'];
  buttonText?: string;
  openSide?: OpenSide;
  openDirection?: OpenDirection;
}

export const RichTextPreview = ({
  content,
  id,
  buttonSize,
  buttonVariant,
  buttonText,
  openDirection = 'down',
  openSide = 'right',
}: PreviewProps) => {
  const [viewContent, setViewContent] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setViewContent(false));
  const lang = useRedaktoerLanguage();

  return (
    <PreviewContainer ref={ref}>
      <Button
        size={buttonSize}
        icon={<FileSearchIcon aria-hidden />}
        onClick={() => setViewContent(!viewContent)}
        variant={buttonVariant}
        title="Forhåndsvis"
      >
        {buttonText}
      </Button>

      {viewContent ? (
        <ContentContainer $openSide={openSide} $openDirection={openDirection}>
          <Plate<EditorValue, RichTextEditor>
            id={id}
            initialValue={structuredClone(content)} // Do not remove. Solves a bug where the main editor crashes when the preview is toggled on and off.
            readOnly
            plugins={previewPlugins}
          >
            <PlateEditor id={id} readOnly renderLeaf={renderReadOnlyLeaf} lang={SPELL_CHECK_LANGUAGES[lang]} />
          </Plate>
        </ContentContainer>
      ) : null}
    </PreviewContainer>
  );
};

const PreviewContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ContentContainer = styled.div<{ $openSide: OpenSide; $openDirection: OpenDirection }>`
  background-color: white;
  box-shadow: var(--a-shadow-medium);
  position: absolute;
  padding: 8px;
  left: ${({ $openSide }) => ($openSide === 'left' ? 'auto' : '0')};
  right: ${({ $openSide }) => ($openSide === 'left' ? '0' : 'auto')};
  bottom: ${({ $openDirection }) => ($openDirection === 'up' ? '100%' : 'auto')};
  top: ${({ $openDirection }) => ($openDirection === 'up' ? 'auto' : '100%')};
  z-index: 22;

  width: calc(var(${EDITOR_SCALE_CSS_VAR}) * 105mm);
  font-size: calc(var(${EDITOR_SCALE_CSS_VAR}) * ${BASE_FONT_SIZE}pt);
`;
