import { RoleItem } from '@app/components/role-list/role-list-item';
import type { Role } from '@app/types/bruker';
import { Heading, List, type TagProps } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  roles: Role[];
  title: string;
  description?: string;
  variant: TagProps['variant'];
}

export const RoleList = ({ roles, variant, title, description }: Props) => {
  if (roles.length === 0) {
    return (
      <StyledSection>
        <Heading level="3" size="xsmall" spacing>
          {title}
        </Heading>
        <em>Ingen roller</em>
      </StyledSection>
    );
  }

  return (
    <StyledList size="small" title={title} description={description}>
      {roles.map((r) => (
        <StyledListItem key={r}>
          <RoleItem key={r} role={r} variant={variant} />
        </StyledListItem>
      ))}
    </StyledList>
  );
};

const StyledList = styled(List)`
  width: fit-content;
`;

const StyledListItem = styled(List.Item)`
  width: fit-content;
`;

const StyledSection = styled.section`
  margin-block: var(--a-spacing-3);
`;
