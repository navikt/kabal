import { BodyShort, HStack, Label, Loader } from '@navikt/ds-react';
import { DateTime } from '@/components/datetime/datetime';
import { EditableTitle } from '@/components/editable-title/editable-title';
import { Filters } from '@/components/maltekstseksjoner/filters';
import { Container, Header } from '@/components/maltekstseksjoner/maltekstseksjon/common';
import { Actions } from '@/components/maltekstseksjoner/maltekstseksjon/draft/actions';
import { Sidebar } from '@/components/maltekstseksjoner/maltekstseksjon/draft/sidebar';
import { MaltekstseksjonTexts } from '@/components/maltekstseksjoner/maltekstseksjon/texts';
import {
  TagContainer,
  TemplateSectionTagList,
  UtfallTagList,
  YtelseHjemmelTagList,
} from '@/components/smart-editor-texts/edit/tags';
import { TextHistory } from '@/components/text-history/text-history';
import {
  useUpdateMaltekstTitleMutation,
  useUpdateTemplateSectionIdListMutation,
  useUpdateUtfallIdListMutation,
  useUpdateYtelseHjemmelIdListMutation,
} from '@/redux-api/maltekstseksjoner/mutations';
import type { IGetMaltekstseksjonParams } from '@/types/maltekstseksjoner/params';
import type { IDraftMaltekstseksjon } from '@/types/maltekstseksjoner/responses';

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
        <HStack gap="space-4" align="center" className="[grid-area:metadata]">
          <HStack gap="space-4" align="center">
            <Label size="small" htmlFor={modifiedId}>
              Sist endret:
            </Label>

            <HStack asChild align="center">
              <BodyShort id={modifiedId} size="small">
                {isUpdating ? (
                  <Loader size="xsmall" />
                ) : (
                  <DateTime id={modifiedId} dateTime={maltekstseksjon.modifiedOrTextsModified} />
                )}
                <span>, av {lastEdit === undefined ? 'Ukjent' : lastEdit.actor.navn}</span>
              </BodyShort>
            </HStack>
          </HStack>
          <TextHistory {...maltekstseksjon} isUpdating={isUpdating} />
        </HStack>
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
