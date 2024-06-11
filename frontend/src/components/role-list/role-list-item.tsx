import { FilesIcon } from '@navikt/aksel-icons';
import { Tag, TagProps, Tooltip } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { ROLE_NAMES, Role } from '@app/types/bruker';

interface Props {
  role: Role;
  variant: TagProps['variant'];
}

export const RoleItem = ({ role, variant }: Props) => {
  const formattedRole = ROLE_NAMES[role];

  return (
    <Tooltip key={role} content="Kopier">
      <RoleContent onClick={() => navigator.clipboard.writeText(formattedRole)}>
        <Tag variant={variant} size="small">
          {formattedRole} <FilesIcon aria-hidden />
        </Tag>
      </RoleContent>
    </Tooltip>
  );
};

const RoleContent = styled.button`
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
  margin: 0;
  padding: 0;
  border: none;
`;
