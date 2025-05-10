import { merge } from '@app/functions/classes';
import { Box } from '@navikt/ds-react';
import { css, styled } from 'styled-components';

export const StyledAttachmentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0;
  grid-column-end: action-end;
  grid-column-start: title-start;
  position: relative;
  padding: 0;
  margin: 0;
  margin-left: 14px;
  list-style-type: none;
`;

const treeRootStructureCss = css`
  content: '';
  display: block;
  width: 0;
  position: absolute;
  top: 0;
  border-left: 1px solid var(--a-border-subtle);
`;

export const JournalfoerteDocumentsAttachments = styled(StyledAttachmentList)<{ $treeLineHeight: number }>`
  position: absolute;
  right: 0;
  margin-left: 0;

  &::before {
    ${treeRootStructureCss}
    height: ${({ $treeLineHeight }) => $treeLineHeight}px;
    left: 0;
  }
`;

export const NewDocAttachmentsContainer = styled.div<{ $showTreeLine: boolean }>`
  position: relative;

  &::before {
    ${treeRootStructureCss}
    display: ${({ $showTreeLine }) => ($showTreeLine ? 'block' : 'none')};
    bottom: 15px;
    left: 14px;
  }
`;

export const StyledAttachmentListItem = ({ className, children, ...rest }: React.HTMLAttributes<HTMLElement>) => (
  <Box
    as="li"
    borderRadius="medium"
    position="absolute"
    left="0"
    right="0"
    paddingInline="4 0"
    className={merge(
      'before:absolute before:top-4 before:left-0 before:block before:w-3 before:border-border-subtle before:border-b',
      className,
    )}
    {...rest}
  >
    {children}
  </Box>
);

interface LogiskeVedleggListItemStyleProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'className'> {
  connected: boolean;
}

export const LogiskeVedleggListItemStyle = ({ connected, children, ...rest }: LogiskeVedleggListItemStyleProps) => {
  const bottomClassname = connected ? 'before:bottom-0' : 'before:bottom-[11px]';

  return (
    <li className={`absolute right-0 left-0 flex pl-4 ${BEFORE_CLASSES} ${bottomClassname} ${AFTER_CLASSES}`} {...rest}>
      {children}
    </li>
  );
};

const BEFORE_CLASSES =
  'before:top-[-4px] before:absolute before:left-0 before:w-3 before:border-border-subtle before:border-l';
const AFTER_CLASSES = 'after:absolute after:left-[1px] after:top-3 after:h-[1px] after:w-3 after:bg-border-subtle';
