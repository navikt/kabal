import { StaticDataContext } from '@app/components/app/static-data-context';
import { RoleList } from '@app/components/role-list/role-list';
import { ENVIRONMENT } from '@app/environment';
import { pushEvent } from '@app/observability';
import { PageWrapper } from '@app/pages/page-wrapper';
import { ALL_PUBLIC_ROLES, type Role } from '@app/types/bruker';
import { BodyShort, Heading, Tag } from '@navikt/ds-react';
import { useContext, useEffect } from 'react';
import { styled } from 'styled-components';

interface Props {
  requiredRoles: Role[];
}

const INSTRUCTION = ENVIRONMENT.isProduction
  ? 'Be din leder om å tildele deg nødvendig rolle.'
  : 'Tildel din testbruker nødvendig rolle eller benytt en annen testbruker.';

export const NoAccessPage = ({ requiredRoles }: Props) => {
  const { user } = useContext(StaticDataContext);

  useEffect(() => {
    pushEvent('no-access-page', 'no-access', {
      userRoles: user.roller.toSorted().join(', '),
      requiredRoles: requiredRoles.toSorted().join(', '),
      path: window.location.pathname,
    });
  }, [requiredRoles, user.roller]);

  return (
    <PageWrapper>
      <Centered>
        <Heading level="1" size="medium" spacing>
          Din bruker har ikke tilgang til denne siden
        </Heading>
        <BodyShort spacing>
          Din bruker har ikke den nødvendige rollen for å få tilgang til <Path />.
        </BodyShort>

        <RoleList
          title="Minst én av følgende roller kreves for å se denne siden"
          description={INSTRUCTION}
          roles={requiredRoles}
          variant="warning-moderate"
        />

        <RoleList title="Roller brukeren din har nå" roles={user.roller} variant="info-moderate" />

        <RoleList
          title="Andre roller Kabal bruker"
          roles={ALL_PUBLIC_ROLES.filter((r) => !(user.roller.includes(r) || requiredRoles.includes(r)))}
          variant="neutral-moderate"
        />
      </Centered>
    </PageWrapper>
  );
};

const Path = () => (
  <Tag variant="neutral-moderate" size="xsmall">
    <StyledPre>{window.location.pathname}</StyledPre>
  </Tag>
);

const StyledPre = styled.pre`
  margin: 0;
`;

const Centered = styled.div`
  margin: 0 auto;
  width: fit-content;
`;
