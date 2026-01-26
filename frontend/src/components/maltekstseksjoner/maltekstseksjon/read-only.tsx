import { useGetMaltekstseksjonQuery } from '@app/redux-api/maltekstseksjoner/queries';
import { Box, Heading, HStack, Loader, Tag, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { TextPreview } from '../texts/preview';

interface Props {
  id: string | null;
  textToHighlight?: string;
}

export const MaltekstseksjonReadOnly = ({ id, textToHighlight }: Props) => {
  const { data: maltekstseksjon } = useGetMaltekstseksjonQuery(id ?? skipToken);

  if (id === null) {
    return null;
  }

  if (maltekstseksjon === undefined) {
    return <Loader title="Laster..." />;
  }

  return (
    <section className="mt-4">
      <HStack align="center" justify="start" gap="space-0 space-8" as="header">
        <Heading level="1" size="medium">
          {maltekstseksjon.title.length > 0 ? maltekstseksjon.title : '<Ingen tittel>'}
        </Heading>
        <Tag data-color="info" variant="outline" size="xsmall">
          Maltekstseksjon
        </Tag>
      </HStack>
      <VStack asChild gap="space-8 space-0">
        <Box
          as="ul"
          borderRadius="8 0 0 8"
          paddingBlock="space-16 space-8"
          paddingInline="space-12 space-0"
          borderWidth="0 0 0 4"
          borderColor="info"
        >
          {maltekstseksjon.textIdList.map((textId) => (
            <li key={textId}>
              <TextPreview
                textId={textId}
                className={`rounded-sm outline-offset-2 ${textId === textToHighlight ? 'outline-4 outline-ax-border-accent outline-solid' : ''}`}
              />
            </li>
          ))}
        </Box>
      </VStack>
    </section>
  );
};
