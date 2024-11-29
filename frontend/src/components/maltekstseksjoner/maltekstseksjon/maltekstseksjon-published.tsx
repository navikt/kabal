import { DateTime } from '@app/components/datetime/datetime';
import { getTitle } from '@app/components/editable-title/editable-title';
import { MaltekstseksjonTexts } from '@app/components/maltekstseksjoner/maltekstseksjon/texts';
import { UnpublishMaltekstseksjonButton } from '@app/components/maltekstseksjoner/maltekstseksjon/unpublish-maltekstseksjon-button';
import { DuplicateSectionButton } from '@app/components/smart-editor-texts/duplicate-section-button';
import {
  TagContainer,
  TemplateSectionTagList,
  UtfallTagList,
  YtelseHjemmelTagList,
} from '@app/components/smart-editor-texts/edit/tags';
import { TextHistory } from '@app/components/text-history/text-history';
import { useCreateDraftFromVersionMutation } from '@app/redux-api/maltekstseksjoner/mutations';
import type { IGetMaltekstseksjonParams } from '@app/types/maltekstseksjoner/params';
import type { IPublishedMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { CalendarIcon, PlusIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Label, Tooltip } from '@navikt/ds-react';
import { useCallback } from 'react';
import { useParams } from 'react-router';
import { TextListItem } from '../styled-components';
import { Container, Header, List, SidebarContainer, StyledHeading } from './common';
import { LoadTextListItem } from './list-item';

interface MaltekstProps {
  maltekstseksjon: IPublishedMaltekstseksjon;
  query: IGetMaltekstseksjonParams;
  onDraftCreated: (versionId: string) => void;
}

export const PublishedMaltekstSection = ({ maltekstseksjon, query, onDraftCreated }: MaltekstProps) => {
  const { textId: activeTextId } = useParams<{ textId: string }>();
  const {
    id,
    title,
    textIdList,
    publishedDateTime,
    modified,
    modifiedOrTextsModified,
    versionId,
    publishedByActor,
    published,
  } = maltekstseksjon;
  const [createDraft, { isLoading }] = useCreateDraftFromVersionMutation();

  const onCreateDraft = useCallback(async () => {
    const draft = await createDraft({ id, versionId, query }).unwrap();
    onDraftCreated(draft.versionId);
  }, [createDraft, id, versionId, query, onDraftCreated]);

  const publishedFieldId = `${id}-published`;
  const modifiedFieldId = `${id}-modified`;
  const depublishedFieldId = `${id}-depublished`;

  return (
    <Container>
      <Header>
        <StyledHeading level="1" size="small" style={{ gridArea: 'title' }}>
          {getTitle(title)}
        </StyledHeading>

        <HStack gap="2" align="center" gridColumn="metadata">
          <HStack gap="1" align="center">
            <Label size="small" htmlFor={publishedFieldId}>
              Publisert:
            </Label>
            <HStack asChild align="center">
              <BodyShort id={publishedFieldId} size="small">
                <DateTime dateTime={publishedDateTime} icon={<CalendarIcon aria-hidden style={{ flexShrink: 0 }} />} />
                <span>, av {publishedByActor.navn}</span>
              </BodyShort>
            </HStack>
          </HStack>

          {published ? (
            <HStack gap="1" align="center">
              <HStack gap="1" align="center">
                <Label size="small" htmlFor={modifiedFieldId}>
                  Sist endret:
                </Label>
                <DateTime
                  id={modifiedFieldId}
                  dateTime={modifiedOrTextsModified}
                  icon={<CalendarIcon aria-hidden style={{ flexShrink: 0 }} />}
                />
              </HStack>
            </HStack>
          ) : (
            <HStack gap="1" align="center">
              <HStack gap="1" align="center">
                <Label size="small" htmlFor={depublishedFieldId}>
                  Avpublisert:
                </Label>
                <DateTime
                  id={depublishedFieldId}
                  dateTime={modified}
                  icon={<CalendarIcon aria-hidden style={{ flexShrink: 0 }} />}
                />
                <span>av {publishedByActor.navn}</span>
              </HStack>
            </HStack>
          )}

          <TextHistory {...maltekstseksjon} isUpdating={false} />
        </HStack>

        <TagContainer>
          <TemplateSectionTagList templateSectionIdList={maltekstseksjon.templateSectionIdList} />
          <YtelseHjemmelTagList ytelseHjemmelIdList={maltekstseksjon.ytelseHjemmelIdList} />
          <UtfallTagList utfallIdList={maltekstseksjon.utfallIdList} />
        </TagContainer>

        <HStack gridColumn="actions" gap="2" justify="end" align="start">
          <Tooltip content="Opprett utkast basert på denne versjonen av maltekstseksjonen.">
            <Button
              size="small"
              variant="secondary"
              onClick={onCreateDraft}
              loading={isLoading}
              icon={<PlusIcon aria-hidden />}
            >
              Nytt utkast
            </Button>
          </Tooltip>

          <DuplicateSectionButton id={id} versionId={versionId} query={query} />

          {maltekstseksjon.published ? (
            <UnpublishMaltekstseksjonButton publishedMaltekstseksjon={maltekstseksjon} query={query} />
          ) : null}
        </HStack>
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
