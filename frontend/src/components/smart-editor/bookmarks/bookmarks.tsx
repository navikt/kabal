import { useBookmarks } from '@app/components/smart-editor/bookmarks/use-bookmarks';
import { hasOwn } from '@app/functions/object';
import { pushEvent } from '@app/observability';
import { BookmarkPlugin } from '@app/plate/plugins/bookmark';
import { type FormattedText, useMyPlateEditorState } from '@app/plate/types';
import { BookmarkFillIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, HStack, VStack } from '@navikt/ds-react';
import { NodeApi, type TNode } from 'platejs';

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
    <VStack as="ul" position="relative" justify="start" width="100%" paddingInline="space-16" maxWidth="350px">
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
            <Button
              size="xsmall"
              variant="tertiary-neutral"
              onClick={() => onClick(node)}
              icon={<BookmarkFillIcon aria-hidden />}
              style={{ color }}
              className="grow justify-start overflow-hidden"
            >
              <span className="truncate">{content}</span>
            </Button>
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
    </VStack>
  );
};
