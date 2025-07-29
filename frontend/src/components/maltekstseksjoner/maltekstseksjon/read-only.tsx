import { useGetMaltekstseksjonQuery } from '@app/redux-api/maltekstseksjoner/queries';
import { BoxNew, Heading, HStack, Loader, Tag, VStack } from '@navikt/ds-react';
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
      <HStack align="center" justify="start" gap="0 2" as="header">
        <Heading level="1" size="medium">
          {maltekstseksjon.title.length > 0 ? maltekstseksjon.title : '<Ingen tittel>'}
        </Heading>
        <Tag variant="info" size="xsmall">
          Maltekstseksjon
        </Tag>
      </HStack>

      <VStack asChild gap="2 0">
        <BoxNew
          as="ul"
          borderRadius="medium 0 0 medium"
          paddingBlock="4 2"
          paddingInline="3 0"
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
        </BoxNew>
      </VStack>
    </section>
  );
};
