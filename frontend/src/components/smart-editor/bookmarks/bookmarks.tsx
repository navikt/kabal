import { BookmarkFillIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { TNode, getNodeString, setNodes, toDOMNode } from '@udecode/plate-common';
import { styled } from 'styled-components';
import { useBookmarks } from '@app/components/smart-editor/bookmarks/use-bookmarks';
import { pushEvent } from '@app/observability';
import { useMyPlateEditorState } from '@app/plate/types';

interface Props {
  editorId: string;
}

export const Bookmarks = ({ editorId }: Props) => {
  const bookmarks = useBookmarks();
  const editor = useMyPlateEditorState(editorId);

  if (bookmarks.length === 0) {
    return null;
  }

  const onClick = (node: TNode) => toDOMNode(editor, node)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  return (
    <BookmarkList>
      {bookmarks.map(([key, nodes]) => {
        const [node] = nodes;

        if (node === undefined) {
          return null;
        }

        const color = node[key];

        if (typeof color !== 'string') {
          return null;
        }

        const content = nodes.map((n) => getNodeString(n)).join('');

        return (
          <BookmarkListItem key={key}>
            <StyledButton
              size="xsmall"
              variant="tertiary-neutral"
              onClick={() => onClick(node)}
              icon={<BookmarkFillIcon aria-hidden />}
              style={{ color }}
            >
              {content}
            </StyledButton>
            <Button
              size="xsmall"
              variant="tertiary-neutral"
              onClick={() => {
                pushEvent('remove-bookmark', 'smart-editor');
                setNodes(editor, { [key]: undefined }, { match: (n) => key in n, mode: 'lowest', at: [] });
              }}
              icon={<TrashIcon aria-hidden />}
            />
          </BookmarkListItem>
        );
      })}
    </BookmarkList>
  );
};

const BookmarkList = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  list-style: none;
  width: 100%;
  margin: 0;
  padding: 0;
  padding-left: var(--a-spacing-4);
  padding-right: var(--a-spacing-4);
  position: relative;
  max-width: 350px;
`;

const BookmarkListItem = styled.li`
  display: flex;
  flex-direction: row;
`;

const StyledButton = styled(Button)`
  justify-content: flex-start;
  flex-grow: 1;
  overflow: hidden;

  > .navds-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
