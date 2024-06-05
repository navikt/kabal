/* eslint-disable import/no-unused-modules */
import { BodyShort, Label } from '@navikt/ds-react';

interface TitleAndDescriptionProps {
  title: string;
  description: string;
}

export const TitleAndDescription = ({ title, description }: TitleAndDescriptionProps) => (
  <>
    <Label size="small">{title}</Label>
    <BodyShort>{description}</BodyShort>
  </>
);

interface TitleAndContentProps {
  title: string;
  children: React.ReactNode;
}

export const TitleAndContent = ({ title, children }: TitleAndContentProps) => (
  <>
    <Label size="small">{title}</Label>
    {children}
  </>
);
