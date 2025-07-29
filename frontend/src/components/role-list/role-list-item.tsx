import { ROLE_NAMES, type Role } from '@app/types/bruker';
import { FilesIcon } from '@navikt/aksel-icons';
import { HStack, Tag, type TagProps, Tooltip } from '@navikt/ds-react';

interface Props {
  role: Role;
  variant: TagProps['variant'];
}

export const RoleItem = ({ role, variant }: Props) => {
  const formattedRole = ROLE_NAMES[role];

  return (
    <Tooltip key={role} content="Kopier">
      <HStack
        as="button"
        type="button"
        onClick={() => navigator.clipboard.writeText(formattedRole)}
        gap="2"
        align="center"
        className="cursor-pointer"
      >
        <Tag variant={variant} size="small">
          {formattedRole} <FilesIcon aria-hidden />
        </Tag>
      </HStack>
    </Tooltip>
  );
};
