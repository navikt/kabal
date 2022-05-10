import { Tag } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { AppQuery } from '../../types/texts/texts';

interface BaseProps {
  useName: (id: string) => string;
  variant: keyof typeof VARIANTS;
}

interface Props extends BaseProps {
  id: string;
}

export const ResolvedTag = ({ id, variant, useName }: Props) => {
  const name = useName(id);

  const StyledTag = VARIANTS[variant];

  return (
    <StyledTag variant="info" size="small" title={name}>
      {name}
    </StyledTag>
  );
};

interface ListProps extends BaseProps {
  ids: string[];
}

export const ResolvedTags = ({ ids, ...props }: ListProps) => (
  <>
    {ids.map((id) => (
      <ResolvedTag key={id} id={id} {...props} />
    ))}
  </>
);

const BaseTagStyle = styled(Tag)`
  height: fit-content;
`;

export const HjemmelTag = styled(BaseTagStyle)`
  background-color: var(--navds-global-color-purple-100);
  border: 1px solid var(--navds-global-color-purple-300);
`;
export const YtelseTag = styled(BaseTagStyle)`
  background-color: var(--navds-global-color-blue-100);
  border: 1px solid var(--navds-global-color-blue-300);
`;
export const UtfallTag = styled(BaseTagStyle)`
  background-color: var(--navds-global-color-limegreen-100);
  border: 1px solid var(--navds-global-color-limegreen-300);
`;
export const SectionTag = styled(BaseTagStyle)`
  background-color: var(--navds-global-color-deepblue-100);
  border: 1px solid var(--navds-global-color-deepblue-300);
`;
export const EnhetTag = styled(BaseTagStyle)`
  background-color: var(--navds-global-color-orange-100);
  border: 1px solid var(--navds-global-color-orange-300);
`;
export const TemplateTag = styled(BaseTagStyle)`
  background-color: var(--navds-global-color-red-100);
  border: 1px solid var(--navds-global-color-red-300);
`;

export const VARIANTS: Record<keyof AppQuery, typeof Tag> = {
  hjemler: HjemmelTag,
  ytelser: YtelseTag,
  utfall: UtfallTag,
  sections: SectionTag,
  enheter: EnhetTag,
  templates: TemplateTag,
};
