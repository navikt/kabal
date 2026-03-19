import { FilesIcon } from '@navikt/aksel-icons';
import { HStack, Tag, type TagProps, Tooltip } from '@navikt/ds-react';
import { ROLE_NAMES, type Role } from '@/types/bruker';

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
        gap="space-8"
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
