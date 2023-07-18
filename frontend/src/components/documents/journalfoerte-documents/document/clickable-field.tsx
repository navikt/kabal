import { Button } from '@navikt/ds-react';
import React, { memo } from 'react';
import { styled } from 'styled-components';
import { Fields } from '@app/components/documents/journalfoerte-documents/grid';

interface StyledClickableFieldProps {
  $area: Fields;
}

export const StyledClickableField = styled(Button)<StyledClickableFieldProps>`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  grid-area: ${({ $area }) => $area};
`;

interface ClickableFieldProps extends StyledClickableFieldProps {
  children: string;
  onClick: () => void;
}

export const ClickableField = memo(
  (props: ClickableFieldProps) => (
    <StyledClickableField {...props} size="small" variant="tertiary" title={props.children} />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children && prevProps.onClick === nextProps.onClick,
);

ClickableField.displayName = 'ClickableField';
