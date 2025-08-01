import { format } from '@app/components/settings/abbreviations/format';
import {
  type ErrorExampleData,
  type ExpandingExampleData,
  ExpansionTypeEnum,
} from '@app/components/settings/abbreviations/types';
import { hasOwn } from '@app/functions/object';
import { BodyShort, Heading, HStack, List, Tag, Tooltip } from '@navikt/ds-react';

interface Props {
  title: string;
  children: React.ReactNode;
  examples: (ExpandingExampleData | ErrorExampleData)[];
  recommended?: boolean;
}

export const AbbrevationExample = ({ title, children, examples, recommended = false }: Props) => (
  <section>
    <HStack asChild align="center" gap="2">
      <Heading size="small" spacing>
        {title}
        {recommended ? (
          <Tag variant="success" size="xsmall">
            Anbefalt
          </Tag>
        ) : (
          <Tag variant="warning" size="xsmall">
            Ikke anbefalt
          </Tag>
        )}
      </Heading>
    </HStack>

    <BodyShort size="small" spacing>
      {children}
    </BodyShort>
    <List as="ol" size="small">
      {examples.map((example) => (
        <List.Item key={example.short}>
          <ExpandingExample key={example.short} {...example} />
          {example.tag === undefined ? null : (
            <Tag variant="neutral" size="xsmall">
              {example.tag}
            </Tag>
          )}
        </List.Item>
      ))}
    </List>
  </section>
);

const ExpandingExample = (data: ExpandingExampleData | ErrorExampleData) => {
  if (!isExampleData(data)) {
    return (
      <>
        {format(data.short)} blir <ErrorTag />.
      </>
    );
  }

  const { short, long, cap } = data;

  if (cap === ExpansionTypeEnum.AutoCap) {
    return (
      <>
        {format(short)} blir utvidet til {format(long.toLowerCase())}/{format(long)}. <AutoCap />
      </>
    );
  }

  if (cap === ExpansionTypeEnum.AlwaysCap) {
    return (
      <>
        {format(short)} blir utvidet til {format(long)}. <AlwaysCap />
      </>
    );
  }

  if (cap === ExpansionTypeEnum.AlwaysAllCaps) {
    return (
      <>
        {format(short)} blir utvidet til {format(long.toUpperCase())}. <AlwaysAllCaps />
      </>
    );
  }
};

const isExampleData = (data: ExpandingExampleData | ErrorExampleData): data is ExpandingExampleData =>
  hasOwn(data, 'cap');

const AutoCap = () => (
  <Tooltip content="Automatisk stor forbokstav på starten av en setning.">
    <Tag variant="info" size="xsmall">
      Automatisk stor forbokstav
    </Tag>
  </Tooltip>
);

const AlwaysCap = () => (
  <Tag variant="info" size="xsmall">
    Alltid stor forbokstav
  </Tag>
);

const AlwaysAllCaps = () => (
  <Tag variant="info" size="xsmall">
    Alltid bare store bokstaver
  </Tag>
);

const ErrorTag = () => (
  <Tag variant="error" size="xsmall">
    Ikke gjenkjent
  </Tag>
);
