import { PublishedTextFooter } from '@app/components/maltekstseksjoner/texts/text-published-footer';
import { Tags } from '@app/components/smart-editor-texts/edit/tags';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import type { IPublishedPlainText } from '@app/types/texts/responses';
import { BodyLong, Heading } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  text: IPublishedPlainText;
  hasDraft: boolean;
  setTabId: (versionId: string) => void;
}

export const PublishedPlainText = ({ text, hasDraft, setTabId }: Props) => {
  const lang = useRedaktoerLanguage();

  return (
    <PublishedContainer>
      <Heading level="1" size="small" spacing>
        {text.title}
      </Heading>

      <Tags {...text} />

      <Background>
        <StyledBodyLong>{text.plainText[lang]}</StyledBodyLong>
      </Background>

      <PublishedTextFooter text={text} hasDraft={hasDraft} setTabId={setTabId} />
    </PublishedContainer>
  );
};

const Background = styled.div`
  background-color: var(--a-bg-subtle);
  padding: var(--a-spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-4);
`;

const PublishedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-2);
  padding: var(--a-spacing-4);
`;

const StyledBodyLong = styled(BodyLong)`
  background-color: var(--a-bg-default);
  padding: var(--a-spacing-4);
  border-radius: var(--a-spacing-1);
  box-shadow: var(--a-shadow-medium);
`;
