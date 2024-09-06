import { CalendarIcon, ClockDashedIcon, PencilWritingIcon, UploadIcon } from '@navikt/aksel-icons';
import { Button, Tag } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { styled } from 'styled-components';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { pushEvent } from '@app/observability';
import { INavEmployee } from '@app/types/bruker';
import { IEditor } from '@app/types/maltekstseksjoner/responses';

interface PublishedProps {
  publishedDateTime: string;
  publishedByActor: INavEmployee;
}

interface DraftProps {
  publishedDateTime: null;
  publishedByActor: null;
}

interface Props {
  published: boolean;
  modified: string;
  created: string;
  createdByActor: INavEmployee;
  edits: IEditor[];
  isUpdating: boolean;
}

export const TextHistory = ({
  publishedDateTime,
  publishedByActor,
  created,
  createdByActor,
  edits,
}: Props & (PublishedProps | DraftProps)) => {
  const [showEdits, setShowEdits] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setShowEdits(false));

  return (
    <EditorHistoryContainer ref={ref}>
      {showEdits && (
        <EditorList>
          {publishedDateTime !== null ? (
            <ListItem>
              <StyledTag variant="info" size="xsmall">
                <UploadIcon aria-hidden />
                Publisert
              </StyledTag>
              <span>
                {' '}
                av {publishedByActor.navn} {isoDateTimeToPretty(publishedDateTime)}
              </span>
            </ListItem>
          ) : null}
          {edits.map((edit) => (
            <ListItem key={edit.actor.navIdent}>
              <StyledTag variant="warning" size="xsmall">
                <PencilWritingIcon aria-hidden />
                Endret
              </StyledTag>
              <span>
                {' '}
                av {edit.actor.navn} {isoDateTimeToPretty(edit.created)}
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
              av {createdByActor.navn} {isoDateTimeToPretty(created)}
            </span>
          </ListItem>
        </EditorList>
      )}
      <Button
        variant="tertiary"
        size="xsmall"
        onClick={() => {
          const enabled = !showEdits;
          pushEvent('toggle-text-history', 'texts', { enabled: enabled.toString() });
          setShowEdits(enabled);
        }}
        icon={<ClockDashedIcon aria-hidden />}
      >
        {showEdits ? 'Skjul' : 'Vis'} historikk
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
  background-color: var(--a-bg-default);
  box-shadow: var(--a-shadow-medium);
  border-radius: var(--a-border-radius-medium);
  z-index: 1;
  list-style: none;
  margin: 0;
  padding: var(--a-spacing-2);
  display: flex;
  flex-direction: column;
  row-gap: var(--a-spacing-1);
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
  column-gap: var(--a-spacing-1);
`;
