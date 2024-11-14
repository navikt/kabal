import { DateTime } from '@app/components/datetime/datetime';
import { EditableTitle } from '@app/components/editable-title/editable-title';
import { Filters } from '@app/components/maltekstseksjoner/filters';
import { MaltekstseksjonTexts } from '@app/components/maltekstseksjoner/maltekstseksjon/texts';
import {
  TagContainer,
  TemplateSectionTagList,
  UtfallTagList,
  YtelseHjemmelTagList,
} from '@app/components/smart-editor-texts/edit/tags';
import { TextHistory } from '@app/components/text-history/text-history';
import {
  useUpdateMaltekstTitleMutation,
  useUpdateTemplateSectionIdListMutation,
  useUpdateUtfallIdListMutation,
  useUpdateYtelseHjemmelIdListMutation,
} from '@app/redux-api/maltekstseksjoner/mutations';
import type { IGetMaltekstseksjonParams } from '@app/types/maltekstseksjoner/params';
import type { IDraftMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { Label, Loader } from '@navikt/ds-react';
import { Container, DateTimeContainer, Header, MetadataContainer } from '../common';
import { Actions } from './actions';
import { Sidebar } from './sidebar';

interface MaltekstProps {
  maltekstseksjon: IDraftMaltekstseksjon;
  query: IGetMaltekstseksjonParams;
  onDraftDeleted: () => void;
}

export const DraftMaltekstSection = ({ maltekstseksjon, query, onDraftDeleted }: MaltekstProps) => {
  const { id, title } = maltekstseksjon;
  const [updateTitle, { isLoading: isUpdatingTitle }] = useUpdateMaltekstTitleMutation({
    fixedCacheKey: `${maltekstseksjon.id}-title`,
  });
  const [, { isLoading: isUpdatingTemplateSections }] = useUpdateTemplateSectionIdListMutation({
    fixedCacheKey: `${maltekstseksjon.id}-templatesections`,
  });
  const [, { isLoading: isUpdatingHjemmelIdList }] = useUpdateYtelseHjemmelIdListMutation({
    fixedCacheKey: `${maltekstseksjon.id}-ytelsehjemmel`,
  });
  const [, { isLoading: isUpdatingUtfall }] = useUpdateUtfallIdListMutation({
    fixedCacheKey: `${maltekstseksjon.id}-utfall`,
  });

  const isUpdating = isUpdatingTitle || isUpdatingTemplateSections || isUpdatingHjemmelIdList || isUpdatingUtfall;

  const lastEdit = maltekstseksjon.edits.at(-1);

  const modifiedId = `${maltekstseksjon.versionId}-modified`;

  return (
    <Container>
      <Header>
        <EditableTitle
          label="Malteksttittel"
          title={title}
          onChange={(newTitle) => updateTitle({ id, query, title: newTitle })}
          isLoading={isUpdatingTitle}
        />
        <MetadataContainer>
          <DateTimeContainer>
            <Label size="small" htmlFor={modifiedId}>
              Sist endret:
            </Label>
            {isUpdating ? (
              <Loader size="xsmall" />
            ) : (
              <DateTime id={modifiedId} dateTime={maltekstseksjon.modifiedOrTextsModified} />
            )}
          </DateTimeContainer>
          <span>av {lastEdit === undefined ? 'Ukjent' : lastEdit.actor.navn}</span>
          <TextHistory {...maltekstseksjon} isUpdating={isUpdating} />
        </MetadataContainer>
        <Filters maltekst={maltekstseksjon} query={query} />
        <TagContainer>
          <TemplateSectionTagList templateSectionIdList={maltekstseksjon.templateSectionIdList} />
          <YtelseHjemmelTagList ytelseHjemmelIdList={maltekstseksjon.ytelseHjemmelIdList} />
          <UtfallTagList utfallIdList={maltekstseksjon.utfallIdList} />
        </TagContainer>
        <Actions query={query} onDraftDeleted={onDraftDeleted} maltekstseksjon={maltekstseksjon} />
      </Header>

      <Sidebar maltekstseksjon={maltekstseksjon} query={query} />

      <MaltekstseksjonTexts maltekstseksjon={maltekstseksjon} query={query} />
    </Container>
  );
};
