import { CalendarIcon, ClockDashedIcon, PencilWritingIcon, UploadIcon } from '@navikt/aksel-icons';
import { Button, Tag } from '@navikt/ds-react';
import React, { useRef, useState } from 'react';
import { styled } from 'styled-components';
import { EditorName } from '@app/components/editor-name/editor-name';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { pushEvent } from '@app/observability';
import { IEditor } from '@app/types/maltekstseksjoner/responses';

interface PublishedProps {
  publishedDateTime: string;
  publishedBy: string;
}

interface DraftProps {
  publishedDateTime: null;
  publishedBy: null;
}

interface Props {
  published: boolean;
  modified: string;
  created: string;
  createdBy: string;
  editors: IEditor[];
  isUpdating: boolean;
}

export const TextHistory = ({
  publishedDateTime,
  publishedBy,
  created,
  createdBy,
  editors,
}: Props & (PublishedProps | DraftProps)) => {
  const [showEditors, setShowEditors] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setShowEditors(false));

  return (
    <EditorHistoryContainer ref={ref}>
      {showEditors && (
        <EditorList>
          {publishedDateTime !== null ? (
            <ListItem>
              <StyledTag variant="info" size="xsmall">
                <UploadIcon aria-hidden />
                Publisert
              </StyledTag>
              <span>
                {' '}
                av <EditorName editorId={publishedBy} /> {isoDateTimeToPretty(publishedDateTime)}
              </span>
            </ListItem>
          ) : null}
          {editors.map((editor) => (
            <ListItem key={editor.navIdent}>
              <StyledTag variant="warning" size="xsmall">
                <PencilWritingIcon aria-hidden />
                Endret
              </StyledTag>
              <span>
                {' '}
                av <EditorName key={editor.navIdent} editorId={editor.navIdent} /> {isoDateTimeToPretty(editor.created)}
              </span>
            </ListItem>
          ))}
          <ListItem>
            <StyledTag variant="alt1" size="xsmall">
              <CalendarIcon aria-hidden />
              Opprettet
            </StyledTag>
            <span>
              {' '}
              av <EditorName editorId={createdBy} /> {isoDateTimeToPretty(created)}
            </span>
          </ListItem>
        </EditorList>
      )}
      <Button
        variant="tertiary"
        size="xsmall"
        onClick={() => {
          const enabled = !showEditors;
          pushEvent('toggle-text-history', { enabled: enabled.toString() }, 'texts');
          setShowEditors(enabled);
        }}
        icon={<ClockDashedIcon aria-hidden />}
      >
        {showEditors ? 'Skjul' : 'Vis'} historikk
      </Button>
    </EditorHistoryContainer>
  );
};

const EditorHistoryContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
`;

const EditorList = styled.ul`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  box-shadow: var(--a-shadow-medium);
  border-radius: var(--a-border-radius-medium);
  z-index: 1;
  list-style: none;
  margin: 0;
  padding: 8px;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
`;

const ListItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  white-space: pre;
`;

const StyledTag = styled(Tag)`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 4px;
`;
