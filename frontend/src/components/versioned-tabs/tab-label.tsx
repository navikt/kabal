import { HStack, Tag } from '@navikt/ds-react';

interface TabLabelProps {
  isDraft: boolean;
  isPublished: boolean;
  children: string | number;
}

export const TabLabel = ({ isDraft, isPublished, children }: TabLabelProps) => {
  if (isPublished) {
    return (
      <HStack align="center" gap="space-4" wrap={false}>
        <Tag data-color="info" size="xsmall" variant="outline">
          Aktiv
        </Tag>
        Versjon {children}
      </HStack>
    );
  }

  if (isDraft) {
    return (
      <HStack align="center" gap="space-4" wrap={false}>
        <Tag data-color="warning" size="xsmall" variant="outline">
          Utkast
        </Tag>
        Versjon {children}
      </HStack>
    );
  }

  return (
    <HStack align="center" gap="space-4" wrap={false}>
      <Tag data-color="neutral" size="xsmall" variant="outline">
        Inaktiv
      </Tag>
      Versjon {children}
    </HStack>
  );
};
