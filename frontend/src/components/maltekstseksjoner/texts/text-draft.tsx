import { HelpText, Switch, Tooltip } from '@navikt/ds-react';
import { focusEditor, getEndPoint, isEditorFocused } from '@udecode/plate-common';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { EditableTitle } from '@app/components/editable-title/editable-title';
import { EditorValue, RichTextEditor } from '@app/plate/types';
import {
  usePublishMutation,
  useSetTextTitleMutation,
  useSetTextTypeMutation,
  useUpdateContentMutation,
} from '@app/redux-api/texts/mutations';
import { RichTextTypes } from '@app/types/common-text-types';
import { IDraftRichText } from '@app/types/texts/responses';
import { areDescendantsEqual } from '../../../functions/are-descendants-equal';
import { RedaktoerRichText } from '../../redaktoer-rich-text/redaktoer-rich-text';
import { DraftTextFooter } from './text-draft-footer';

interface Props {
  text: IDraftRichText;
  isActive: boolean;
  setActive: (textId: string) => void;
  isDeletable: boolean;
  onDraftDeleted: () => void;
  maltekstseksjonId: string;
}

export const DraftText = ({ text, isActive, setActive, ...rest }: Props) => {
  const [updateTextType, { isLoading: isTextTypeUpdating }] = useSetTextTypeMutation();
  const [updateTitle, { isLoading: isTitleUpdating }] = useSetTextTitleMutation();
  const [updateContent, { isLoading: isUpdatingContent }] = useUpdateContentMutation();
  const [publish] = usePublishMutation({ fixedCacheKey: text.id });
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<RichTextEditor>(null);
  const [content, setContent] = useState(text.content);
  const { id } = text;
  const isUpdating = useRef(false);
  const contentRef = useRef(content);
  const queryRef = useRef({ textType: text.textType });

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    queryRef.current.textType = text.textType;
  }, [text.textType]);

  useEffect(() => {
    if (isActive && editorRef.current !== null && !isEditorFocused(editorRef.current)) {
      setTimeout(() => {
        if (editorRef.current !== null) {
          focusEditor(editorRef.current, getEndPoint(editorRef.current, []));
        }
      }, 0);
    }
  }, [isActive]);

  const updateContentIfChanged = useCallback(
    async (_content: EditorValue) => {
      if (isUpdating.current || areDescendantsEqual(_content, text.content)) {
        return;
      }
      isUpdating.current = true;
      const query = queryRef.current;
      await updateContent({ query, id, content: _content });
      isUpdating.current = false;
    },
    [id, text.content, updateContent],
  );

  useEffect(() => {
    if (isUpdating.current || areDescendantsEqual(content, text.content)) {
      return;
    }

    const timer = setTimeout(async () => {
      if (isUpdating.current) {
        return;
      }
      updateContentIfChanged(content);
    }, 1000);

    return () => clearTimeout(timer);
  }, [content, id, updateContent, text.content, updateContentIfChanged]);

  useEffect(
    () => () => {
      // Save on unmount, if changed.
      updateContentIfChanged(contentRef.current);
    },
    [updateContentIfChanged],
  );

  const onPublish = useCallback(async () => {
    await updateContentIfChanged(contentRef.current);
    const query = queryRef.current;
    await publish({ id, query });
  }, [id, publish, updateContentIfChanged]);

  const isLocked = text.textType === RichTextTypes.MALTEKST;

  return (
    <Container ref={containerRef}>
      <Header>
        <HeaderGroup>
          <EditableTitle
            label="Teksttittel"
            title={text.title}
            onChange={(title) => updateTitle({ id: text.id, query: queryRef.current, title })}
            isLoading={isTitleUpdating}
          />
        </HeaderGroup>

        <HeaderGroup>
          <Tooltip content={isLocked ? 'Lås opp' : 'Lås igjen'}>
            <Switch
              checked={isLocked}
              size="small"
              loading={isTextTypeUpdating}
              onChange={({ target }) =>
                updateTextType({
                  id,
                  newTextType: target.checked ? RichTextTypes.MALTEKST : RichTextTypes.REDIGERBAR_MALTEKST,
                  oldTextType: text.textType,
                })
              }
            >
              Låst
            </Switch>
          </Tooltip>
          <HelpText title="Hva er låsing?">
            En låst tekst vil ikke kunne redigeres av saksbehandler med unntak av innfyllingsfelter som legges inn i
            teksten her.
          </HelpText>
        </HeaderGroup>
      </Header>

      <RedaktoerRichText
        ref={editorRef}
        editorId={text.id}
        savedContent={text.content}
        onChange={setContent}
        onFocus={() => setActive(text.id)}
      />

      <DraftTextFooter
        text={text}
        isSaving={isUpdatingContent || isTextTypeUpdating || isTitleUpdating}
        onPublish={onPublish}
        {...rest}
      />
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  position: relative;
  padding-top: 8px;
`;

const Header = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const HeaderGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 8px;
`;
