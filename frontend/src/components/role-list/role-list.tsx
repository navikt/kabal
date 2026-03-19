import { BodyShort, Box, Heading, List, type TagProps } from '@navikt/ds-react';
import { RoleItem } from '@/components/role-list/role-list-item';
import type { Role } from '@/types/bruker';

interface Props {
  roles: Role[];
  title: string;
  description?: string;
  variant: TagProps['variant'];
}

export const RoleList = ({ roles, variant, title, description }: Props) => {
  if (roles.length === 0) {
    return (
      <section className="my-3">
        <Heading level="3" size="xsmall" spacing>
          {title}
        </Heading>

        <em>Ingen roller</em>
      </section>
    );
  }

  return (
    <section className="my-3">
      <Heading level="3" size="xsmall" spacing>
        {title}
      </Heading>

      {description === undefined ? null : (
        <BodyShort size="small" spacing>
          {description}
        </BodyShort>
      )}

      <div>
        <Heading size="small">{title}</Heading>
        <BodyShort>{description}</BodyShort>
        <Box marginBlock="space-16" asChild>
          <List size="small" className="w-fit">
            {roles.map((r) => (
              <List.Item key={r} className="w-fit">
                <RoleItem key={r} role={r} variant={variant} />
              </List.Item>
            ))}
          </List>
        </Box>
      </div>
    </section>
  );
};
