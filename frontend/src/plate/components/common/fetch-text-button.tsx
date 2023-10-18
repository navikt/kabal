import { FileSearchIcon, FileTextIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps, HelpText } from '@navikt/ds-react';
import { insertNodes } from '@udecode/plate-common';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Path } from 'slate';
import { styled } from 'styled-components';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { BASE_FONT_SIZE } from '@app/plate/components/get-scaled-em';
import { lexSpecialis } from '@app/plate/functions/lex-specialis';
import { renderReadOnlyLeaf } from '@app/plate/leaf/render-leaf';
import { PlateEditor, PlateEditorContextComponent } from '@app/plate/plate-editor';
import { previewPlugins } from '@app/plate/plugins/plugins-preview';
import { TemplateSections } from '@app/plate/template-sections';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import { useMyPlateEditorRef } from '@app/plate/types';
import { useGetTextsQuery } from '@app/redux-api/texts';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { IRichText, IText, RichTextTypes } from '@app/types/texts/texts';

interface Props {
  previousTextId: string | undefined;
  templateId: TemplateIdEnum;
  section: TemplateSections;
  replaceNodes: (text: IRichText) => void;
  path: Path | undefined;
}

const BUTTON_SIZE: ButtonProps['size'] = 'xsmall';

export const FetchTextButton = ({ path, previousTextId, templateId, section, replaceNodes }: Props) => {
  const editor = useMyPlateEditorRef();
  const { data: oppgave, isLoading } = useOppgave();
  const query = useQuery({ textType: RichTextTypes.REDIGERBAR_MALTEKST, section, templateId });
  const { data: texts } = useGetTextsQuery(query);
  const [ignored, setIgnored] = useState(false);

  const text = useMemo(() => {
    if (isLoading || oppgave === undefined || texts === undefined) {
      return null;
    }

    const { utfallId, extraUtfallIdSet, hjemmelIdSet } = oppgave.resultat;

    return lexSpecialis(
      templateId,
      section,
      oppgave.ytelseId,
      hjemmelIdSet,
      utfallId === null ? extraUtfallIdSet : [utfallId, ...extraUtfallIdSet],
      texts.filter(isRedigerbarMaltekst),
    );
  }, [isLoading, oppgave, section, templateId, texts]);

  // Reset ignored when text changes.
  useEffect(() => setIgnored(false), [text?.id]);

  const onClick = () => {
    if (text === null) {
      return;
    }
    replaceNodes(text);
  };

  const insertParagraph = () => {
    if (path === undefined) {
      return;
    }

    insertNodes(editor, createSimpleParagraph(), { at: [...path, 0], select: true });
  };

  if (ignored) {
    return null;
  }

  if (text === null) {
    if (previousTextId !== undefined) {
      return null;
    }

    return (
      <ButtonContainer contentEditable={false}>
        <Button
          size={BUTTON_SIZE}
          icon={<FileTextIcon aria-hidden />}
          onClick={insertParagraph}
          contentEditable={false}
        >
          Sett inn tomt avsnitt
        </Button>

        <Explainer />
      </ButtonContainer>
    );
  }

  if (previousTextId === undefined) {
    return (
      <ButtonContainer contentEditable={false}>
        <Button size={BUTTON_SIZE} icon={<FileTextIcon aria-hidden />} onClick={onClick}>
          Sett inn tekst
        </Button>

        <Preview text={text} />

        <Explainer />
      </ButtonContainer>
    );
  }

  if (text.id === previousTextId) {
    return null;
  }

  return (
    <ButtonContainer contentEditable={false}>
      <Button size={BUTTON_SIZE} icon={<FileTextIcon aria-hidden />} onClick={onClick}>
        Erstatt tekst
      </Button>

      <Preview text={text} />

      <Button size={BUTTON_SIZE} icon={<XMarkIcon aria-hidden />} variant="secondary" onClick={() => setIgnored(true)}>
        Behold eksisterende tekst
      </Button>

      <Explainer />
    </ButtonContainer>
  );
};

const isRedigerbarMaltekst = (text: IText): text is IRichText => text.textType === RichTextTypes.REDIGERBAR_MALTEKST;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  column-gap: 8px;
  align-items: center;
  border-radius: var(--a-border-radius-medium);
  margin-bottom: 8px;
`;

const Preview = ({ text }: { text: IRichText }) => {
  const [viewContent, setViewContent] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setViewContent(false));

  return (
    <PreviewContainer ref={ref}>
      <Button
        size={BUTTON_SIZE}
        icon={<FileSearchIcon aria-hidden />}
        onClick={() => setViewContent(!viewContent)}
        variant="secondary"
      >
        Forhåndsvis
      </Button>

      {viewContent ? (
        <ContentContainer>
          <PlateEditorContextComponent initialValue={text.content} id={text.id} readOnly plugins={previewPlugins}>
            <PlateEditor id={text.id} readOnly renderLeaf={renderReadOnlyLeaf} />
          </PlateEditorContextComponent>
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

const ContentContainer = styled.div`
  background-color: white;
  box-shadow: var(--a-shadow-medium);
  position: absolute;
  padding: 8px;
  top: 100%;
  left: 0;
  z-index: 22;

  width: calc(var(${EDITOR_SCALE_CSS_VAR}) * 105mm);
  font-size: calc(var(${EDITOR_SCALE_CSS_VAR}) * ${BASE_FONT_SIZE}pt);
`;

const Explainer = () => (
  <HelpText>
    <HelpTextContainer>
      For å få bedre forslag til tekst, sørg for å ha så korrekte utfall og hjemler som mulig.
    </HelpTextContainer>
  </HelpText>
);

const HelpTextContainer = styled.div`
  width: 350px;
`;
