import { FilesIcon } from '@navikt/aksel-icons';
import { HStack, Tag, type TagProps, Tooltip } from '@navikt/ds-react';
import { ROLE_NAMES, type Role } from '@/types/bruker';

interface Props {
  role: Role;
  dataColor: TagProps['data-color'];
  variant: TagProps['variant'];
}

export const RoleItem = ({ role, dataColor, variant }: Props) => {
  const formattedRole = ROLE_NAMES[role] ?? role;

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
        <Tag data-color={dataColor} variant={variant} size="small">
          {formattedRole} <FilesIcon aria-hidden />
        </Tag>
      </HStack>
    </Tooltip>
  );
};
