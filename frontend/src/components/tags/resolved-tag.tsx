import { Tag } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { AppQuery } from '@app/types/common-text-types';

interface BaseProps {
  useName: (id: string) => string;
  variant: keyof typeof VARIANTS;
}

interface Props extends BaseProps {
  id: string;
}

const ResolvedTag = ({ id, variant, useName }: Props) => <CustomTag variant={variant}>{useName(id)}</CustomTag>;

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

interface CustomTagProps {
  children: string;
  variant: keyof typeof VARIANTS;
}

export const CustomTag = ({ children, variant }: CustomTagProps) => (
  <StyledTag variant="info" size="small" title={children} $variant={variant}>
    {children}
  </StyledTag>
);

interface StyledTagProps {
  $variant: keyof typeof VARIANTS;
}

const StyledTag = styled(Tag)<StyledTagProps>`
  height: fit-content;
  border: 1px solid ${({ $variant }) => `var(--a-${VARIANTS[$variant]}-300)`};
  background-color: ${({ $variant }) => `var(--a-${VARIANTS[$variant]}-100)`};
`;

const VARIANTS: Record<keyof AppQuery, string> = {
  templateSectionIdList: 'red',
  ytelseHjemmelIdList: 'blue',
  utfallIdList: 'limegreen',
  enhetIdList: 'purple',
};
