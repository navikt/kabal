import { RoleItem } from '@app/components/role-list/role-list-item';
import type { Role } from '@app/types/bruker';
import { BodyShort, Heading, List, type TagProps } from '@navikt/ds-react';

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

      <List size="small" title={title} description={description} className="w-fit">
        {roles.map((r) => (
          <List.Item key={r} className="w-fit">
            <RoleItem key={r} role={r} variant={variant} />
          </List.Item>
        ))}
      </List>
    </section>
  );
};
