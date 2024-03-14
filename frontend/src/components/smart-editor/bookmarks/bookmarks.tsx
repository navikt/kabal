import { BookmarkFillIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { TNode, getNodeString, isText, setNodes, toDOMNode } from '@udecode/plate-common';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { BOOKMARK_PREFIX } from '@app/components/smart-editor/constants';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { pushEvent } from '@app/observability';
import { RichText, RichTextEditor, useMyPlateEditorState } from '@app/plate/types';

interface Props {
  editorId: string;
}

export const Bookmarks = ({ editorId }: Props) => {
  const { bookmarksMap, removeBookmark } = useContext(SmartEditorContext);
  const editor = useMyPlateEditorState(editorId);

  const bookmarks = Object.entries(bookmarksMap);

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
                pushEvent('remove-bookmark', undefined, 'smart-editor');
                setNodes(editor, { [key]: undefined }, { match: (n) => key in n, mode: 'lowest', at: [] });
                removeBookmark(key);
              }}
              icon={<TrashIcon aria-hidden />}
            />
          </BookmarkListItem>
        );
      })}
    </BookmarkList>
  );
};

export const getBookmarks = (editor: RichTextEditor): Record<string, RichText[]> => {
  const bookmarkEntries = editor.nodes<RichText>({
    match: (n) => isText(n) && Object.keys(n).some((k) => k.startsWith(BOOKMARK_PREFIX)),
    at: [],
  });

  const bookmarkMap: Map<string, RichText[]> = new Map();

  for (const [node] of bookmarkEntries) {
    const keys = Object.keys(node).filter((k) => k.startsWith(BOOKMARK_PREFIX));

    for (const key of keys) {
      const existing = bookmarkMap.get(key);
      bookmarkMap.set(key, existing !== undefined ? [...existing, node] : [node]);
    }
  }

  if (bookmarkMap.size === 0) {
    return EMPTY_BOOKMARKS;
  }

  return Object.fromEntries(bookmarkMap.entries());
};

const EMPTY_BOOKMARKS: Record<string, RichText[]> = {};

const BookmarkList = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  list-style: none;
  width: 100%;
  margin: 0;
  padding: 0;
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
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
