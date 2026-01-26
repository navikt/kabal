import { Tag } from '@navikt/ds-react';

export interface StatusTagProps {
  published: boolean;
  publishedDateTime: string | null;
}

export const StatusTag = ({ publishedDateTime, published }: StatusTagProps) => {
  if (published) {
    return (
      <Tag data-color="info" size="xsmall" variant="outline">
        Publisert
      </Tag>
    );
  }

  if (publishedDateTime === null) {
    return (
      <Tag data-color="warning" size="xsmall" variant="outline">
        Utkast
      </Tag>
    );
  }

  return (
    <Tag data-color="neutral" size="xsmall" variant="outline">
      Avpublisert
    </Tag>
  );
};
