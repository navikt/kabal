import { getTitle } from '@app/components/editable-title/editable-title';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { SPELL_CHECK_LANGUAGES } from '@app/hooks/use-smart-editor-language';
import { KabalPlateEditor } from '@app/plate/plate-editor';
import { previewComponents, previewPlugins } from '@app/plate/plugins/plugin-sets/preview';
import type { KabalValue, RichTextEditor } from '@app/plate/types';
import { useGetMaltekstseksjonQuery } from '@app/redux-api/maltekstseksjoner/queries';
import { useLazyGetTextByIdQuery } from '@app/redux-api/texts/queries';
import { RichTextTypes } from '@app/types/common-text-types';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import type { IRichText, IText } from '@app/types/texts/responses';
import { Box, Heading, Loader, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { Plate, usePlateEditor } from 'platejs/react';
import { useCallback, useEffect, useState } from 'react';
import { styled } from 'styled-components';

interface Props {
  id: string | null;
}

export const Preview = ({ id }: Props) => {
  const lang = useRedaktoerLanguage();
  const { data: maltekstseksjon } = useGetMaltekstseksjonQuery(id ?? skipToken);
  const [getContent] = useLazyGetTextByIdQuery();
  const [children, setChildren] = useState<KabalValue | null>(null);

  const getChildren = useCallback(async () => {
    if (maltekstseksjon === undefined) {
      return;
    }

    try {
      const texts = await Promise.all(maltekstseksjon.textIdList.map((tId) => getContent(tId, false).unwrap()));

      const c: KabalValue = texts
        .filter(isMaltekstOrRedigerbarMaltekst)
        .flatMap((text) => text.richText[lang])
        .filter(isNotNull);

      setChildren(c);
    } catch (error) {
      console.error('Failed to load maltekstseksjon content:', error);
      setChildren(null);
    }
  }, [getContent, lang, maltekstseksjon]);

  useEffect(() => {
    // biome-ignore lint/nursery/noFloatingPromises: Safe promise.
    getChildren();
  }, [getChildren]);

  if (id === null) {
    return null;
  }

  if (maltekstseksjon === undefined || children === null) {
    return <Loader title="Laster..." />;
  }

  return <LoadedPreview id={id} value={children} maltekstseksjon={maltekstseksjon} />;
};

interface LoadedPreviewProps {
  id: string;
  value: KabalValue;
  maltekstseksjon: IMaltekstseksjon;
}

const LoadedPreview = ({ id, value, maltekstseksjon }: LoadedPreviewProps) => {
  const lang = useRedaktoerLanguage();

  const editor = usePlateEditor<KabalValue, (typeof previewPlugins)[0]>({
    id,
    plugins: previewPlugins,
    override: { components: previewComponents },
    value: value,
  });
  return (
    <>
      <VStack asChild align="center" gap="4" padding="4">
        <Box borderRadius="medium" background="surface-subtle">
          <Heading level="1" size="xsmall">
            Forhåndsvisning av {getTitle(maltekstseksjon.title)}
          </Heading>
          <Sheet>
            <Plate<RichTextEditor> editor={editor} readOnly>
              <KabalPlateEditor id={id} readOnly lang={SPELL_CHECK_LANGUAGES[lang]} />
            </Plate>
          </Sheet>
        </Box>
      </VStack>
    </>
  );
};

const Sheet = styled.div`
  padding: 20mm;
  padding-top: 15mm;
  box-shadow: var(--a-shadow-medium);
  background-color: var(--a-bg-default);
  width: 210mm;
`;

const isMaltekstOrRedigerbarMaltekst = (text: IText): text is IRichText =>
  text.textType === RichTextTypes.MALTEKST || text.textType === RichTextTypes.REDIGERBAR_MALTEKST;
