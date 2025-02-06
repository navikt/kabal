import { DeleteMaltekstseksjonDraftButton } from '@app/components/maltekstseksjoner/maltekstseksjon/draft/delete-draft-button';
import { DuplicateSectionButton } from '@app/components/smart-editor-texts/duplicate-section-button';
import { isRichText } from '@app/functions/is-rich-plain-text';
import {
  useDeleteDraftVersionMutation,
  usePublishMutation,
  usePublishWithTextsMutation,
} from '@app/redux-api/maltekstseksjoner/mutations';
import { useLazyGetTextByIdQuery } from '@app/redux-api/texts/queries';
import type { IGetMaltekstseksjonParams } from '@app/types/maltekstseksjoner/params';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { LANGUAGES } from '@app/types/texts/language';
import type { IRichText } from '@app/types/texts/responses';
import { UploadIcon } from '@navikt/aksel-icons';
import { Button, type ButtonProps, ErrorMessage, HStack, Tooltip } from '@navikt/ds-react';
import { useCallback, useState } from 'react';
import { styled } from 'styled-components';

interface Props {
  maltekstseksjon: IMaltekstseksjon;
  query: IGetMaltekstseksjonParams;
  onDraftDeleted: () => void;
}

export const Actions = ({ query, onDraftDeleted, maltekstseksjon }: Props) => {
  const { id, title, versionId } = maltekstseksjon;

  return (
    <HStack gap="2" justify="end" className="[grid-area:actions]">
      <PublishButtons maltekstseksjon={maltekstseksjon} query={query} />

      <DuplicateSectionButton id={id} versionId={versionId} query={query} />

      <DeleteMaltekstseksjonDraftButton id={id} query={query} onDraftDeleted={onDraftDeleted} title={title} />
    </HStack>
  );
};

interface PublishButtonProps {
  maltekstseksjon: IMaltekstseksjon;
  query: IGetMaltekstseksjonParams;
}

const PublishButtons = ({ query, maltekstseksjon }: PublishButtonProps) => {
  const [publish, { isLoading: isPublishing }] = usePublishMutation();
  const [publishWithTexts, { isLoading: isPublishingWithTexts }] = usePublishWithTextsMutation();
  const [, { isLoading: isDeleting }] = useDeleteDraftVersionMutation();
  const getWarning = useUtranslatedWarning(maltekstseksjon.textIdList);
  const [untranslatedWarning, setUntranslatedWarning] = useState<string | null>(null);

  const { id } = maltekstseksjon;

  const onPublish = useCallback(() => publish({ id, query }), [id, publish, query]);

  const onPublishWithTexts = useCallback(async () => {
    const warning = await getWarning();

    setUntranslatedWarning(warning);

    if (warning !== null) {
      return;
    }

    await publishWithTexts({ id, query });

    setUntranslatedWarning(null);
  }, [getWarning, id, publishWithTexts, query]);

  const loading = isPublishing || isPublishingWithTexts || isDeleting;
  const noTexts = maltekstseksjon.textIdList.length === 0;

  const props: ButtonProps = {
    size: 'small',
    variant: 'primary',
    icon: <UploadIcon aria-hidden />,
    loading,
    disabled: noTexts,
    title: getTitle(noTexts),
  };

  return (
    <>
      <Tooltip content="Publiser bare maltekstseksjonen, upubliserte tekster forblir upuliserte.">
        <Button {...props} onClick={onPublish}>
          Publiser
        </Button>
      </Tooltip>

      <Tooltip content="Publiser maltekstseksjon og alle tekster.">
        <Button {...props} onClick={onPublishWithTexts}>
          Publiser alt
        </Button>
      </Tooltip>

      {untranslatedWarning === null ? null : (
        <StyledErrorMessage size="small">{untranslatedWarning}</StyledErrorMessage>
      )}
    </>
  );
};

const getTitle = (noTexts: boolean) => (noTexts ? 'Du må legge til minst én tekst før du kan publisere' : undefined);

const useUtranslatedWarning = (textIdList: string[]): (() => Promise<string | null>) => {
  const [getText] = useLazyGetTextByIdQuery();

  return useCallback(async () => {
    const promises = textIdList.map(async (id) => {
      const { data } = await getText(id);

      return data;
    });

    const texts = await Promise.all(promises);

    const untranslated = texts
      .filter(
        (text): text is IRichText =>
          text !== undefined && isRichText(text) && LANGUAGES.some((lang) => text.richText[lang] === null),
      )
      .map((text) => (text.title.length > 0 ? text.title : '<Ingen tittel>'));

    if (untranslated.length === 0) {
      return null;
    }

    return `Følgende tekster må oversettes før du kan publisere: ${untranslated.join(', ')}`;
  }, [getText, textIdList]);
};

const StyledErrorMessage = styled(ErrorMessage)`
  white-space: wrap;
`;
