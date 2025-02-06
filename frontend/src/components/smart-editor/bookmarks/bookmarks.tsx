import { useBookmarks } from '@app/components/smart-editor/bookmarks/use-bookmarks';
import { hasOwn } from '@app/functions/object';
import { pushEvent } from '@app/observability';
import { BookmarkPlugin } from '@app/plate/plugins/bookmark';
import { type FormattedText, useMyPlateEditorState } from '@app/plate/types';
import { BookmarkFillIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { NodeApi, type TNode } from '@udecode/plate';
import { styled } from 'styled-components';

interface Props {
  editorId: string;
}

export const Bookmarks = ({ editorId }: Props) => {
  const bookmarks = useBookmarks();
  const editor = useMyPlateEditorState(editorId);

  if (bookmarks.length === 0) {
    return null;
  }

  const onClick = (node: TNode) => editor.api.toDOMNode(node)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

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

        const content = nodes.map((n) => NodeApi.string(n)).join('');

        return (
          <HStack as="li" key={key}>
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
                editor.tf.unsetNodes<FormattedText>([BookmarkPlugin.key, key], {
                  match: (n) => hasOwn(n, key),
                  mode: 'lowest',
                  at: [],
                  split: true,
                });
              }}
              icon={<TrashIcon aria-hidden />}
            />
          </HStack>
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
