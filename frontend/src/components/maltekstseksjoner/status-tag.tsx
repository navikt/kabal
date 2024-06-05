import { Tag } from '@navikt/ds-react';

export interface StatusTagProps {
  hasDraft: boolean;
}

export const StatusTag = ({ hasDraft }: StatusTagProps) => {
  if (hasDraft) {
    return (
      <Tag size="xsmall" variant="warning">
        Utkast
      </Tag>
    );
  }

  return (
    <Tag size="xsmall" variant="info">
      Publisert
    </Tag>
  );
};
