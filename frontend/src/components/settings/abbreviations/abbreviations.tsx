import { AddAbbreviation } from '@app/components/settings/abbreviations/add';
import { ExistingAbbreviation } from '@app/components/settings/abbreviations/existing';
import { AbbreviationsExplanation } from '@app/components/settings/abbreviations/explanation';
import { SectionHeader, SettingsSection } from '@app/components/settings/styled-components';
import { useGetAbbreviationsQuery } from '@app/redux-api/bruker';
import { Alert, Heading, type HeadingProps, HelpText, Loader } from '@navikt/ds-react';

export const Abbreviations = () => (
  <SettingsSection>
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
      <section className="mb-6">
        <Heading size={headingSize} spacing>
          Legg til forkortelse
        </Heading>

        <AddAbbreviation />
      </section>

      <section>
        <Heading size={headingSize} spacing>
          Eksisterende forkortelser
        </Heading>

        {isLoading ? <Loader title="Laster..." /> : null}

        {hasAbbreviations ? (
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {data.map((item) => (
              <li key={item.id}>
                <ExistingAbbreviation {...item} />
              </li>
            ))}
          </ul>
        ) : (
          <Alert variant="info" size="small">
            Du har ingen forkortelser ennå.
          </Alert>
        )}
      </section>
    </>
  );
};
