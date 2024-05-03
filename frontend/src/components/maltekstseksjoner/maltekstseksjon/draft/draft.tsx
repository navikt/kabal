import { Loader } from '@navikt/ds-react';
import { DateTime } from '@app/components/datetime/datetime';
import { EditableTitle } from '@app/components/editable-title/editable-title';
import { EditorName } from '@app/components/editor-name/editor-name';
import { Filters } from '@app/components/maltekstseksjoner/filters';
import { MaltekstseksjonTexts } from '@app/components/maltekstseksjoner/maltekstseksjon/texts';
import { MaltekstHistoryModal } from '@app/components/maltekstseksjoner/maltekstseksjon/timeline/timeline';
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
import { IGetMaltekstseksjonParams } from '@app/types/maltekstseksjoner/params';
import { IDraftMaltekstseksjon, IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { Container, DateTimeContainer, Header, MetadataContainer } from '../common';
import { Actions } from './actions';
import { Sidebar } from './sidebar';

interface MaltekstProps {
  maltekstseksjon: IDraftMaltekstseksjon;
  nextMaltekstseksjon?: IMaltekstseksjon;
  query: IGetMaltekstseksjonParams;
  onDraftDeleted: () => void;
}

export const DraftMaltekstSection = ({
  maltekstseksjon,
  nextMaltekstseksjon,
  query,
  onDraftDeleted,
}: MaltekstProps) => {
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

  const lastEditor = maltekstseksjon.editors.at(-1);

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
            <strong>Sist endret:</strong>
            {isUpdating ? <Loader size="xsmall" /> : <DateTime dateTime={maltekstseksjon.modified} />}
          </DateTimeContainer>
          <span>av {lastEditor === undefined ? 'Ukjent' : <EditorName editorId={lastEditor.navIdent} />}</span>
          <TextHistory {...maltekstseksjon} isUpdating={isUpdating} />
          <MaltekstHistoryModal
            maltekstseksjon={maltekstseksjon}
            nextMaltekstseksjonDate={nextMaltekstseksjon?.publishedDateTime}
          />
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

      <MaltekstseksjonTexts maltekstseksjon={maltekstseksjon} nextMaltekstseksjon={nextMaltekstseksjon} query={query} />
    </Container>
  );
};
