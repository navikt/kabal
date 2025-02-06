import { HStack, Tag } from '@navikt/ds-react';

interface TabLabelProps {
  isDraft: boolean;
  isPublished: boolean;
  children: string | number;
}

export const TabLabel = ({ isDraft, isPublished, children }: TabLabelProps) => {
  if (isPublished) {
    return (
      <HStack align="center" gap="1">
        <Tag size="xsmall" variant="info">
          Aktiv
        </Tag>
        Versjon {children}
      </HStack>
    );
  }

  if (isDraft) {
    return (
      <HStack align="center" gap="1">
        <Tag size="xsmall" variant="warning">
          Utkast
        </Tag>
        Versjon {children}
      </HStack>
    );
  }

  return (
    <HStack align="center" gap="1">
      <Tag size="xsmall" variant="neutral">
        Inaktiv
      </Tag>
      Versjon {children}
    </HStack>
  );
};
