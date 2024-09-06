import { CalendarIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useCallback } from 'react';
import { useParams } from 'react-router';
import { styled } from 'styled-components';
import { DateTime } from '@app/components/datetime/datetime';
import { getTitle } from '@app/components/editable-title/editable-title';
import { MaltekstseksjonTexts } from '@app/components/maltekstseksjoner/maltekstseksjon/texts';
import {
  TagContainer,
  TemplateSectionTagList,
  UtfallTagList,
  YtelseHjemmelTagList,
} from '@app/components/smart-editor-texts/edit/tags';
import { TextHistory } from '@app/components/text-history/text-history';
import { useCreateDraftFromVersionMutation } from '@app/redux-api/maltekstseksjoner/mutations';
import { IGetMaltekstseksjonParams } from '@app/types/maltekstseksjoner/params';
import { IPublishedMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { TextListItem } from '../styled-components';
import {
  ActionsContainer,
  Container,
  DateTimeContainer,
  Header,
  List,
  SidebarContainer,
  StyledHeading,
} from './common';
import { LoadTextListItem } from './list-item';

interface MaltekstProps {
  maltekstseksjon: IPublishedMaltekstseksjon;
  query: IGetMaltekstseksjonParams;
  onDraftCreated: (versionId: string) => void;
}

export const PublishedMaltekstSection = ({ maltekstseksjon, query, onDraftCreated }: MaltekstProps) => {
  const { textId: activeTextId } = useParams<{ textId: string }>();
  const { id, title, textIdList, publishedDateTime, versionId, publishedByActor } = maltekstseksjon;
  const [createDraft, { isLoading }] = useCreateDraftFromVersionMutation();

  const onCreateDraft = useCallback(async () => {
    const draft = await createDraft({ id, versionId, query }).unwrap();
    onDraftCreated(draft.versionId);
  }, [createDraft, id, versionId, query, onDraftCreated]);

  return (
    <Container>
      <Header>
        <StyledHeading level="1" size="small" style={{ gridArea: 'title' }}>
          {getTitle(title)}
        </StyledHeading>
        <Row>
          <LabelValue>
            <DateTimeContainer>
              <strong>Publisert:</strong>
              <DateTime dateTime={publishedDateTime} icon={<CalendarIcon aria-hidden style={{ flexShrink: 0 }} />} />
            </DateTimeContainer>
            av {publishedByActor.navn}
          </LabelValue>
          <TextHistory {...maltekstseksjon} isUpdating={false} />
        </Row>
        <TagContainer>
          <TemplateSectionTagList templateSectionIdList={maltekstseksjon.templateSectionIdList} />
          <YtelseHjemmelTagList ytelseHjemmelIdList={maltekstseksjon.ytelseHjemmelIdList} />
          <UtfallTagList utfallIdList={maltekstseksjon.utfallIdList} />
        </TagContainer>
        <ActionsContainer>
          <Button size="small" variant="secondary" onClick={onCreateDraft} loading={isLoading}>
            Opprett utkast basert på denne versjonen av maltekstseksjonen
          </Button>
        </ActionsContainer>
      </Header>

      <SidebarContainer>
        <List>
          {textIdList.map((textId) => (
            <TextListItem key={textId} $isActive={textId === activeTextId} $isDragging={false} data-dragovertext="">
              <LoadTextListItem textId={textId} maltekstseksjon={maltekstseksjon} query={query} />
            </TextListItem>
          ))}
        </List>
      </SidebarContainer>

      <MaltekstseksjonTexts maltekstseksjon={maltekstseksjon} query={query} />
    </Container>
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: var(--a-spacing-2);
  grid-area: metadata;
`;

const LabelValue = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: var(--a-spacing-1);
`;
