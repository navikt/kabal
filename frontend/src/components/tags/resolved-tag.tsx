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

const ResolvedTag = ({ id, variant, useName }: Props) => {
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

const HjemmelTag = styled(BaseTagStyle)`
  background-color: var(--a-purple-100);
  border: 1px solid var(--a-purple-300);
`;
const YtelseTag = styled(BaseTagStyle)`
  background-color: var(--a-blue-100);
  border: 1px solid var(--a-blue-300);
`;
const UtfallTag = styled(BaseTagStyle)`
  background-color: var(--a-limegreen-100);
  border: 1px solid var(--a-limegreen-300);
`;
const SectionTag = styled(BaseTagStyle)`
  background-color: var(--a-deepblue-100);
  border: 1px solid var(--a-deepblue-300);
`;
const EnhetTag = styled(BaseTagStyle)`
  background-color: var(--a-orange-100);
  border: 1px solid var(--a-orange-300);
`;
const TemplateTag = styled(BaseTagStyle)`
  background-color: var(--a-red-100);
  border: 1px solid var(--a-red-300);
`;

export const VARIANTS: Record<keyof AppQuery, typeof Tag> = {
  hjemler: HjemmelTag,
  ytelser: YtelseTag,
  utfall: UtfallTag,
  sections: SectionTag,
  enheter: EnhetTag,
  templates: TemplateTag,
};
