import { Tag } from '@navikt/ds-react';

export interface StatusTagProps {
  published: boolean;
  publishedDateTime: string | null;
}

export const StatusTag = ({ publishedDateTime, published }: StatusTagProps) => {
  if (published) {
    return (
      <Tag size="xsmall" variant="info">
        Publisert
      </Tag>
    );
  }

  if (publishedDateTime === null) {
    return (
      <Tag size="xsmall" variant="warning">
        Utkast
      </Tag>
    );
  }

  return (
    <Tag size="xsmall" variant="neutral">
      Avpublisert
    </Tag>
  );
};
