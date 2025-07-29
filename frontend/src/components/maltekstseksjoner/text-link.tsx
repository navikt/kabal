import { StatusTag, type StatusTagProps } from '@app/components/maltekstseksjoner/status-tag';
import { isoDateTimeToPretty } from '@app/domain/date';
import { HGrid, Tag } from '@navikt/ds-react';
import { Link } from 'react-router-dom';

interface TextLinkProps extends StatusTagProps {
  children: string;
  modified: string;
  to: string;
  isLoading?: boolean;
  icon: React.ReactNode;
  draggable?: boolean;
  onDragStart?: React.DragEventHandler;
  onDragEnd?: React.DragEventHandler;
  ref?: React.Ref<HTMLAnchorElement | null>;
}

export const TextLink = ({
  children,
  icon,
  modified,
  to,
  isLoading = false,
  publishedDateTime,
  published,
  ref,
  ...dragProps
}: TextLinkProps) => {
  if (isLoading) {
    return (
      <GridLink ref={ref} to={to} {...dragProps} title={children}>
        {icon}
        <span className="truncate">Laster...</span>
        <Tag size="xsmall" variant="neutral">
          Laster
        </Tag>
        <time>Laster...</time>
      </GridLink>
    );
  }

  return (
    <GridLink ref={ref} to={to} {...dragProps} title={children}>
      {icon}
      <span className="truncate">{getTitle(children)}</span>
      <StatusTag publishedDateTime={publishedDateTime} published={published} />
      <time dateTime={modified}>{isoDateTimeToPretty(modified)}</time>
    </GridLink>
  );
};

interface GridLinkProps {
  children: React.ReactNode;
  to: string;
  title?: string;
  ref?: React.Ref<HTMLAnchorElement | null>;
  draggable?: boolean;
  onDragStart?: React.DragEventHandler;
  onDragEnd?: React.DragEventHandler;
}

const GridLink = ({ children, title, ref, to, ...dragProps }: GridLinkProps) => (
  <HGrid
    as={Link}
    columns="min-content 1fr 85px min-content"
    gap="2"
    padding="2"
    align="center"
    width="100%"
    className="rounded-medium text-inherit"
    ref={ref}
    to={to}
    {...dragProps}
    title={title}
  >
    {children}
  </HGrid>
);

const getTitle = (title?: string) => (title === undefined || title.length === 0 ? '<Ingen tittel>' : title);
