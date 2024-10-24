import { StaticDataContext } from '@app/components/app/static-data-context';
import { RoleList } from '@app/components/role-list/role-list';
import { ENVIRONMENT } from '@app/environment';
import { useLandingPagePath } from '@app/hooks/use-landing-page-path';
import { pushEvent } from '@app/observability';
import { PageWrapper } from '@app/pages/page-wrapper';
import { ALL_PUBLIC_ROLES } from '@app/types/bruker';
import { BodyShort, Heading } from '@navikt/ds-react';
import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { styled } from 'styled-components';

const INSTRUCTION = ENVIRONMENT.isProduction
  ? 'Be din leder om å tildele deg nødvendige roller.'
  : 'Tildel din testbruker nødvendige roller eller benytt en annen testbruker.';

export const LandingPage = () => {
  const { user } = useContext(StaticDataContext);
  const result = useLandingPagePath();

  const hasResult = result !== null;

  useEffect(() => {
    if (!hasResult) {
      pushEvent('landing-page', 'landing-page', {
        userRoles: user.roller.toSorted().join(', '),
      });
    }
  }, [hasResult, user.roller]);

  if (hasResult) {
    const [path] = result;

    return <Navigate replace to={path} />;
  }

  return (
    <PageWrapper>
      <Centered>
        <Heading level="1" size="medium" spacing>
          Velkommen til Kabal
        </Heading>
        <BodyShort spacing>Kabal sender deg automatisk til riktig side basert på rollene til brukeren din.</BodyShort>
        <BodyShort spacing>
          Siden du har endt opp her betyr det mest sannsynlig at brukeren din ikke har korrekte roller for å bruke
          Kabal.
        </BodyShort>
        <RoleList title="Roller brukeren din har nå" roles={user.roller} variant="info-moderate" />
        <RoleList
          title="Andre roller Kabal bruker"
          description={INSTRUCTION}
          roles={ALL_PUBLIC_ROLES.filter((r) => !user.roller.includes(r))}
          variant="neutral-moderate"
        />
      </Centered>
    </PageWrapper>
  );
};

const Centered = styled.div`
  margin: 0 auto;
  width: fit-content;
  max-width: 500px;
`;
