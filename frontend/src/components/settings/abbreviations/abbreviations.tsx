import { AddAbbreviation } from '@app/components/settings/abbreviations/add';
import { ExistingAbbreviation } from '@app/components/settings/abbreviations/existing';
import { AbbreviationsExplanation } from '@app/components/settings/abbreviations/explanation';
import { SectionHeader, SettingsSection } from '@app/components/settings/styled-components';
import { useGetAbbreviationsQuery } from '@app/redux-api/bruker';
import { Alert, Heading, type HeadingProps, HelpText, Loader } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const Abbreviations = () => (
  <SettingsSection $area="abbreviations" style={{ minWidth: 854 }}>
    <SectionHeader>
      <AbbreviationsHeadingContent />
    </SectionHeader>
    <AbbreviationsExplanation />
    <AbbreviationsContent />
  </SettingsSection>
);

export const AbbreviationsHeadingContent = () => (
  <>
    Forkortelser for brevutforming
    <HelpText>
      Forkortelser som brukes i brevutformingen. Forkortelsene vil bli erstattet med full tekst når du legger inn
      mellomrom eller skilletegn.
    </HelpText>
  </>
);

interface ContentProps {
  headingSize?: HeadingProps['size'];
}

export const AbbreviationsContent = ({ headingSize = 'small' }: ContentProps) => {
  const { data = [], isLoading } = useGetAbbreviationsQuery();

  if (isLoading) {
    return <Loader title="Laster..." />;
  }

  const hasAbbreviations = !isLoading && data.length > 0;

  return (
    <>
      <SpacedSection>
        <Heading size={headingSize} spacing>
          Legg til forkortelse
        </Heading>

        <AddAbbreviation />
      </SpacedSection>

      <section>
        <Heading size={headingSize} spacing>
          Eksisterende forkortelser
        </Heading>

        {isLoading ? <Loader title="Laster..." /> : null}

        {hasAbbreviations ? (
          <AbbreviationList>
            {data.map((item) => (
              <li key={item.id}>
                <ExistingAbbreviation {...item} />
              </li>
            ))}
          </AbbreviationList>
        ) : (
          <Alert variant="info" size="small">
            Du har ingen forkortelser ennå.
          </Alert>
        )}
      </section>
    </>
  );
};

const SpacedSection = styled.section`
  margin-bottom: var(--a-spacing-6);
`;

const AbbreviationList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  row-gap: var(--a-spacing-1);
`;
