import { Tag } from '@navikt/ds-react';
import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';
import { StatusTag, StatusTagProps } from '@app/components/maltekstseksjoner/status-tag';
import { isoDateTimeToPretty } from '@app/domain/date';

interface TextLinkProps extends StatusTagProps {
  children: string;
  modified: string;
  to: string;
  isLoading?: boolean;
  icon: React.ReactNode;
  draggable?: boolean;
  onDragStart?: React.DragEventHandler;
  onDragEnd?: React.DragEventHandler;
}

export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(
  ({ children, icon, modified, to, isLoading = false, hasDraft, ...dragProps }, ref) => {
    if (isLoading) {
      return (
        <StyledLink to={to} {...dragProps}>
          {icon}
          <EllipsisTitle>Laster...</EllipsisTitle>
          <Tag size="xsmall" variant="neutral">
            Laster
          </Tag>
          <time>Laster...</time>
        </StyledLink>
      );
    }

    return (
      <StyledLink ref={ref} to={to} {...dragProps} title={children}>
        {icon}
        <EllipsisTitle>{getTitle(children)}</EllipsisTitle>
        <StatusTag hasDraft={hasDraft} />
        <time dateTime={modified}>{isoDateTimeToPretty(modified)}</time>
      </StyledLink>
    );
  },
);

TextLink.displayName = 'TextListItem';

const getTitle = (title?: string) => (title === undefined || title.length === 0 ? '<Ingen tittel>' : title);

const EllipsisTitle = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledLink = styled(Link)`
  display: grid;
  grid-template-columns: min-content 1fr 73px min-content;
  gap: 8px;
  align-content: center;
  align-items: center;
  width: 100%;
  color: inherit;
  text-decoration: none;
  padding: 8px;
  border-radius: var(--a-border-radius-medium);
`;
