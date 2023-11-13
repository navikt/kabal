import { Heading, Loader, Tag, TagProps } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { RedaktoerRichText } from '@app/components/redaktoer-rich-text/redaktoer-rich-text';
import { isPlainText } from '@app/functions/is-rich-plain-text';
import { useGetTextByIdQuery } from '@app/redux-api/texts/queries';
import { RichTextTypes } from '@app/types/common-text-types';

interface Props {
  textId: string;
  className?: string;
}

export const TextPreview = ({ textId, className }: Props) => {
  const { data: text, isLoading } = useGetTextByIdQuery(textId);

  if (isLoading || text === undefined) {
    return <Loader size="small" />;
  }

  if (isPlainText(text)) {
    return (
      <section className={className}>
        <Header>
          <Heading level="1" size="small">
            {text.title}
          </Heading>
          <Tag size="xsmall" variant="neutral">
            Tekst
          </Tag>
        </Header>
        <div>{text.plainText}</div>
      </section>
    );
  }

  const [name, tagVariant] = getRichTextTypeTagVariantAndName(text.textType);

  return (
    <section className={className}>
      <Header>
        <Heading level="1" size="small">
          {text.title}
        </Heading>
        <Tag size="xsmall" variant={tagVariant}>
          {name}
        </Tag>
      </Header>
      <RedaktoerRichText editorId={textId} savedContent={text.content} readOnly />
    </section>
  );
};

const getRichTextTypeTagVariantAndName = (textType: RichTextTypes): [string, TagProps['variant']] => {
  switch (textType) {
    case RichTextTypes.MALTEKST:
      return ['Maltekst', 'alt1'];
    case RichTextTypes.REDIGERBAR_MALTEKST:
      return ['Redigerbar maltekst', 'warning'];
    case RichTextTypes.GOD_FORMULERING:
      return ['God formulering', 'success'];
    case RichTextTypes.REGELVERK:
      return ['Regelverk', 'info'];
    case RichTextTypes.MALTEKSTSEKSJON:
      return ['Maltekstseksjon', 'neutral'];
  }
};

const Header = styled.header`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  column-gap: 8px;
`;
